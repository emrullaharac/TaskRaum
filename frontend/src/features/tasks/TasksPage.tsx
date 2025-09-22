import { useEffect, useMemo, useState } from "react";
import {
    Box, Typography, Stack, TextField, MenuItem, Card, CardContent, IconButton, Button,
    Chip, Tooltip, useMediaQuery
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useTheme } from "@mui/material/styles";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import type { ProjectDto, TaskDto, TaskStatus, TaskPriority } from "../../types/domain";
import { listProjects } from "../projects/api";
import { listTasksByProjectStatus, createTask, updateTask, deleteTask, moveTask } from "./api";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const COLUMNS: { key: TaskStatus; title: string }[] = [
    { key: "TODO", title: "To do" },
    { key: "IN_PROGRESS", title: "In progress" },
    { key: "DONE", title: "Done" },
];

function fmtDate(iso?: string | null) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
}
function isOverdue(iso?: string | null) {
    if (!iso) return false;
    const today = new Date().toISOString().slice(0, 10);
    return iso < today;
}
const PRIORITY_OPTS: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
const priorityColor: Record<TaskPriority, "default" | "warning" | "error" | "info"> = {
    LOW: "info",
    MEDIUM: "warning",
    HIGH: "error",
};

function toNullIfEmpty(v: string) {
    return v && v.trim() !== "" ? v : null;
}

export default function TasksPage() {
    const [projects, setProjects] = useState<ProjectDto[]>([]);
    const [projectId, setProjectId] = useState<string>("");
    const [tasks, setTasks] = useState<TaskDto[]>([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editTask, setEditTask] = useState<TaskDto | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("TODO");
    const [dueDate, setDueDate] = useState<string>("");
    const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<TaskDto | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    async function refreshTasks(pid: string) {
        const parts = await Promise.all(COLUMNS.map((c) => listTasksByProjectStatus(pid, c.key)));
        setTasks(parts.flat());
    }

    useEffect(() => {
        (async () => {
            const prj = await listProjects();
            setProjects(prj);
            if (prj.length) {
                setProjectId(prj[0].id);
                await refreshTasks(prj[0].id);
            }
        })();
    }, []);

    const grouped = useMemo(() => {
        const g: Record<TaskStatus, TaskDto[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
        for (const t of tasks) g[t.status].push(t);
        return g;
    }, [tasks]);

    async function onDragEnd(result: DropResult) {
        if (!result.destination) return;
        const sourceCol = result.source.droppableId as TaskStatus;
        const destCol = result.destination.droppableId as TaskStatus;
        if (sourceCol === destCol) return;

        const task = grouped[sourceCol][result.source.index];

        const updated = await moveTask(task, destCol);

        setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, status: updated.status } : t))
        );
    }

    const openCreate = () => {
        setEditTask(null);
        setTitle("");
        setDescription("");
        setStatus("TODO");
        setDueDate(new Date().toISOString().slice(0, 10));
        setPriority("MEDIUM");
        setDialogOpen(true);
    };
    const openEdit = (t: TaskDto) => {
        setEditTask(t);
        setTitle(t.title);
        setDescription(t.description || "");
        setStatus(t.status);
        setDueDate(t.dueDate || "");
        setPriority(t.priority ?? "MEDIUM");
        setDialogOpen(true);
    };

    const onSubmit = async () => {
        if (!projectId) return;
        const values = {
            title,
            description,
            status,
            dueDate: toNullIfEmpty(dueDate),
            priority: priority,
        };
        if (editTask) await updateTask(editTask.id, values);
        else await createTask(projectId, values);
        setDialogOpen(false);
        await refreshTasks(projectId);
    };

    function askDelete(t: TaskDto) {
        setPendingDelete(t);
        setConfirmOpen(true);
    }
    const onConfirmDelete = async (ok: boolean) => {
        setConfirmOpen(false);
        if (!ok || !pendingDelete || !projectId) return;
        await deleteTask(pendingDelete.id);
        setPendingDelete(null);
        await refreshTasks(projectId);
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" fontWeight="bold">
                    Tasks
                </Typography>
                <Stack direction="row" gap={2}>
                    <TextField
                        select
                        size="small"
                        label="Project"
                        value={projectId}
                        onChange={(e) => {
                            setProjectId(e.target.value);
                            void refreshTasks(e.target.value);
                        }}
                        sx={{ minWidth: 240 }}
                    >
                        {projects.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.title}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={openCreate}
                        disabled={!projectId}
                    >
                        New Task
                    </Button>
                </Stack>
            </Stack>

            <DragDropContext onDragEnd={onDragEnd}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    gap={2}
                    sx={{ overflowX: { md: "auto" } , mt: 4, }}
                >
                    {COLUMNS.map((col) => {
                        const items = grouped[col.key] || [];
                        return (
                            <Droppable droppableId={col.key} key={col.key}>
                                {(provided) => (
                                    <Card
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            minWidth: { md: 340 },
                                            flex: 1,
                                            bgcolor: "background.default",
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 3,
                                            boxShadow: 0,
                                        }}
                                    >
                                        <CardContent sx={{ pb: 1.5 }}>
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                mb={1}
                                            >
                                                <Typography variant="h6">{col.title}</Typography>
                                                <Chip
                                                    size="small"
                                                    label={items.length}
                                                    sx={{ borderRadius: "999px" }}
                                                />
                                            </Stack>

                                            {items.map((t, idx) => (
                                                <Draggable
                                                    draggableId={t.id}
                                                    index={idx}
                                                    key={t.id}
                                                    isDragDisabled={isMobile}
                                                >
                                                    {(drag) => (
                                                        <Card
                                                            ref={drag.innerRef}
                                                            {...drag.draggableProps}
                                                            {...drag.dragHandleProps}
                                                            sx={{
                                                                mb: 1.25,
                                                                borderRadius: 2,
                                                                border: "1px solid",
                                                                borderColor: "divider",
                                                            }}
                                                        >
                                                            <CardContent sx={{ position: "relative", pb: 5 }}>
                                                                <Stack
                                                                    direction="row"
                                                                    alignItems="center"
                                                                    justifyContent="space-between"
                                                                    mb={0.5}
                                                                >
                                                                    <Typography
                                                                        variant="subtitle1"
                                                                        fontWeight={600}
                                                                        sx={{ pr: 1, wordBreak: "break-word" }}
                                                                    >
                                                                        {t.title}
                                                                    </Typography>
                                                                    {t.priority && (
                                                                        <Chip
                                                                            size="small"
                                                                            label={t.priority}
                                                                            color={priorityColor[t.priority]}
                                                                            sx={{ textTransform: "capitalize" }}
                                                                        />
                                                                    )}
                                                                </Stack>

                                                                {t.description && (
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                        sx={{
                                                                            display: "-webkit-box",
                                                                            WebkitLineClamp: 2,
                                                                            WebkitBoxOrient: "vertical",
                                                                            overflow: "hidden",
                                                                        }}
                                                                    >
                                                                        {t.description}
                                                                    </Typography>
                                                                )}

                                                                {t.dueDate && (
                                                                    <Stack
                                                                        direction="row"
                                                                        alignItems="center"
                                                                        gap={0.5}
                                                                        mt={0.75}
                                                                    >
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Due: {fmtDate(t.dueDate)}
                                                                        </Typography>
                                                                        {t.status !== "DONE" && isOverdue(t.dueDate) && (
                                                                            <Tooltip title="Overdue">
                                                                                <WarningAmberOutlinedIcon
                                                                                    fontSize="small"
                                                                                    color="error"
                                                                                />
                                                                            </Tooltip>
                                                                        )}
                                                                    </Stack>
                                                                )}

                                                                <Box sx={{ position: "absolute", right: 8, bottom: 8 }}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => openEdit(t)}
                                                                    >
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => askDelete(t)}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </Draggable>
                                            ))}

                                            {provided.placeholder}
                                        </CardContent>
                                    </Card>
                                )}
                            </Droppable>
                        );
                    })}
                </Stack>
            </DragDropContext>

            {dialogOpen && (
                <Card
                    sx={{
                        position: "fixed",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                    }}
                    onClick={() => setDialogOpen(false)}
                >
                    <Card
                        sx={{ maxWidth: 520, width: "100%" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CardContent>
                            <Stack gap={2}>
                                <TextField
                                    label="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                />
                                <TextField
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <TextField
                                    select
                                    label="Status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                >
                                    <MenuItem value="TODO">To do</MenuItem>
                                    <MenuItem value="IN_PROGRESS">In progress</MenuItem>
                                    <MenuItem value="DONE">Done</MenuItem>
                                </TextField>
                                <TextField
                                    select
                                    label="Priority"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                    required
                                >
                                    {PRIORITY_OPTS.map((p) => (
                                        <MenuItem key={p} value={p}>
                                            {p.charAt(0) + p.slice(1).toLowerCase()}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Due date"
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                                <Stack direction="row" gap={1} justifyContent="flex-end">
                                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                                    <Button variant="contained" onClick={onSubmit}>
                                        {editTask ? "Save" : "Create"}
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Card>
            )}

            <ConfirmDialog
                open={confirmOpen}
                title="Delete task?"
                message={`"${pendingDelete?.title}" will be permanently deleted.`}
                confirmText="Delete"
                cancelText="Cancel"
                onClose={onConfirmDelete}
            />
        </Box>
    );
}
