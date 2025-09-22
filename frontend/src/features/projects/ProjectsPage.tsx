import { useEffect, useState, useCallback } from "react";
import {Box, Typography, Card, CardContent, IconButton, Button, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Grid, Chip, LinearProgress, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { ProjectDto, TaskDto, ProjectStatus, ID, Page } from "../../types/domain";
import { listProjects, createProject, updateProject, deleteProject } from "./api.ts";
import { listAllTasksByProject } from "../tasks/api.ts";
import ConfirmDialog from "../../components/common/ConfirmDialog";

type StatusFilter = ProjectStatus | "ALL";

function statusChipProps(status?: ProjectStatus) {
    switch (status) {
        case "ACTIVE":   return { label: "Active",   color: "success" as const, variant: "filled" as const };
        case "PAUSED":   return { label: "Paused",   color: "warning" as const, variant: "filled" as const };
        case "ARCHIVED": return { label: "Archived", color: "default" as const, variant: "outlined" as const };
        default:         return { label: "—",        color: "default" as const, variant: "outlined" as const };
    }
}
function toArray<T>(res: T[] | Page<T>): T[] { return Array.isArray(res) ? res : res.content ?? []; }

export default function ProjectsPage() {
    const [projects, setProjects] = useState<ProjectDto[]>([]);
    const [progress, setProgress] = useState<Record<ID, number>>({});
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editProject, setEditProject] = useState<ProjectDto | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<ProjectStatus>("ACTIVE");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMsg, setConfirmMsg] = useState("");
    const [onConfirm, setOnConfirm] = useState<(() => Promise<void>) | null>(null);

    const computeProgress = useCallback(async (list: ProjectDto[]) => {
        const entries = await Promise.all(list.map(async (p) => {
            const resp = await listAllTasksByProject(p.id);
            const tasks: TaskDto[] = toArray<TaskDto>(resp);
            if (!tasks.length) return [p.id, 0] as const;
            const done = tasks.filter(t => t.status === "DONE").length;
            return [p.id, (done / tasks.length) * 100] as const;
        }));
        const map: Record<ID, number> = {};
        entries.forEach(([id, pct]) => { map[id] = pct; });
        setProgress(map);
    }, []);

    const refresh = useCallback(async (filter: StatusFilter) => {
        let list: ProjectDto[];
        if (filter === "ALL") {
            const [a, p, r] = await Promise.all([
                listProjects({ status: "ACTIVE" }),
                listProjects({ status: "PAUSED" }),
                listProjects({ status: "ARCHIVED" }),
            ]);
            const map = new Map(a.concat(p, r).map(x => [x.id, x]));
            list = Array.from(map.values());
        } else {
            list = await listProjects({ status: filter });
        }
        setProjects(list);
        await computeProgress(list);
    }, [computeProgress]);

    useEffect(() => { void refresh("ALL"); }, [refresh]);

    const openCreate = () => {
        setEditProject(null);
        setTitle("");
        setDescription("");
        setStatus("ACTIVE");
        setDialogOpen(true);
    };
    const openEdit = (p: ProjectDto) => {
        setEditProject(p);
        setTitle(p.title);
        setDescription(p.description || "");
        setStatus(p.status ?? "ACTIVE");
        setDialogOpen(true);
    };

    function askConfirm(message: string, action: () => Promise<void>) {
        setConfirmMsg(message);
        setOnConfirm(() => action);
        setConfirmOpen(true);
    }

    const onSubmit = async () => {
        const values = { title, description };
        if (editProject) {
            if (status === "ARCHIVED") {
                askConfirm(
                    `Archive "${editProject.title}"? You won't be able to edit it (but you can restore later).`,
                    async () => {
                        await updateProject(editProject.id, { ...values, status });
                        setDialogOpen(false);
                        await refresh(statusFilter);
                    }
                );
                return;
            }
            await updateProject(editProject.id, { ...values, status });
        } else {
            await createProject(values);
        }
        setDialogOpen(false);
        await refresh(statusFilter);
    };

    const onDelete = (p: ProjectDto) => {
        askConfirm(
            `Delete "${p.title}" permanently? This cannot be undone.`,
            async () => { await deleteProject(p.id); await refresh(statusFilter); }
        );
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" fontWeight="bold">Projects</Typography>
                <Stack direction="row" gap={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="filter-label">Filter</InputLabel>
                        <Select
                            labelId="filter-label"
                            label="Filter"
                            value={statusFilter}
                            onChange={(e) => { const v = e.target.value as StatusFilter; setStatusFilter(v); void refresh(v); }}
                        >
                            <MenuItem value="ALL">ALL</MenuItem>
                            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                            <MenuItem value="PAUSED">PAUSED</MenuItem>
                            <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                        New Project
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={2} mt={4} sx={{ width: "100%" }}>
                {projects.map((p) => {
                    const chip = statusChipProps(p.status);
                    const pct  = Math.round(progress[p.id] ?? 0);
                    const isArchived = p.status === "ARCHIVED";

                    return (
                        <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card sx={{ borderRadius: 3, p: 1, transition: "all .15s ease", "&:hover": { boxShadow: 4, transform: "translateY(-1px)" } }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                        <Typography variant="h6">{p.title}</Typography>
                                        <Chip size="small" {...chip} />
                                    </Stack>

                                    {p.description && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            title={p.description}
                                            sx={{
                                                mb: 1.5,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {p.description}
                                        </Typography>
                                    )}

                                    <Stack gap={0.5}>
                                        <LinearProgress variant="determinate" value={pct} />
                                        <Typography variant="caption">{pct}% complete</Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="flex-end" gap={1} mt={1.5}>
                                        {isArchived ? (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{backgroundColor: "grey.200"}}
                                                onClick={() =>
                                                    askConfirm(
                                                        `Restore "${p.title}" to ACTIVE?`,
                                                        async () => { await updateProject(p.id, { status: "ACTIVE" }); await refresh(statusFilter); }
                                                    )
                                                }
                                            >
                                                Restore
                                            </Button>
                                        ) : (
                                            <>
                                                <IconButton onClick={() => openEdit(p)}><EditIcon /></IconButton>
                                                <IconButton color="error" onClick={() => onDelete(p)}><DeleteIcon /></IconButton>
                                            </>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {!projects.length && <Typography color="text.secondary" mt={2}>No projects yet.</Typography>}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editProject ? "Edit Project" : "New Project"}</DialogTitle>
                <DialogContent>
                    <Stack gap={2} mt={1} mb={2}>
                        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
                        <TextField label="Description" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Stack>
                    {editProject && (
                        <FormControl size="small" fullWidth>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                            >
                                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                <MenuItem value="PAUSED">PAUSED</MenuItem>
                                <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={onSubmit}>{editProject ? "Save" : "Create"}</Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={confirmOpen}
                message={confirmMsg}
                onClose={async (ok) => {
                    setConfirmOpen(false);
                    if (ok && onConfirm) { await onConfirm(); }
                    setOnConfirm(null);
                }}
            />
        </Box>
    );
}
