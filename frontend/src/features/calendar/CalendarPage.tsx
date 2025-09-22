import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Dialog, DialogTitle, DialogContent, Stack, DialogActions,
    Button, TextField, MenuItem, Chip, Divider, Tooltip, } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { ProjectDto, TaskStatus, TaskPriority } from "../../types/domain";
import { listProjects } from "../projects/api";
import { listAllTasksByProject, updateTask } from "../tasks/api";

type EP = {
    projectId: string;
    status: TaskStatus;
    dueDate?: string | null;
    description?: string | null;
    priority?: TaskPriority | null;
};
type CalendarEvent = Omit<EventInput, "extendedProps"> & { extendedProps: EP };

const PRIORITY_COLOR: Record<
    Exclude<TaskPriority, undefined>
    ,
    "default" | "info" | "warning" | "error"
> = {
    LOW: "info",
    MEDIUM: "warning",
    HIGH: "error",
};

function isOverdue(iso?: string | null) {
    if (!iso) return false;
    const today = new Date().toISOString().slice(0, 10);
    return iso < today;
}
function eventColors(status: TaskStatus, dueDate?: string | null) {
    if (status === "DONE") return { backgroundColor: "#2e7d32", borderColor: "#2e7d32", opacity: 0.75 };
    if (isOverdue(dueDate)) return { backgroundColor: "#c62828", borderColor: "#c62828" };
    return { backgroundColor: "#1565c0", borderColor: "#1565c0" };
}
function fmt(iso?: string | null) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
}

export default function CalendarPage() {
    const [projectsById, setProjectsById] = useState<Record<string, ProjectDto>>({});
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [filterProjectId, setFilterProjectId] = useState<string>("");

    const [saving, setSaving] = useState(false);
    const [selected, setSelected] = useState<{
        id: string;
        title: string;
        projectId: string;
        status: TaskStatus;
        dueDate?: string | null;
        description?: string | null;
        priority?: TaskPriority | null;
    } | null>(null);

    useEffect(() => {
        (async () => {
            const prj = await listProjects();
            setProjectsById(Object.fromEntries(prj.map((p) => [p.id, p])));

            const taskLists = await Promise.all(prj.map((p) => listAllTasksByProject(p.id)));

            const all: CalendarEvent[] = [];
            prj.forEach((p, i) => {
                for (const t of taskLists[i]) {
                    if (!t.dueDate) continue;
                    const color = eventColors(t.status, t.dueDate);
                    all.push({
                        id: t.id,
                        title: t.title,
                        start: t.dueDate,
                        allDay: true,
                        extendedProps: {
                            projectId: p.id,
                            status: t.status,
                            dueDate: t.dueDate,
                            description: t.description ?? null,
                            priority: t.priority ?? null,
                        },
                        ...color,
                    });
                }
            });
            setEvents(all);
        })();
    }, []);

    const filteredEvents = useMemo(
        () => (filterProjectId ? events.filter((e) => e.extendedProps.projectId === filterProjectId) : events),
        [events, filterProjectId]
    );

    const onEventClick = (info: EventClickArg) => {
        const ep = info.event.extendedProps as EP;
        setSelected({
            id: info.event.id,
            title: info.event.title,
            projectId: ep.projectId,
            status: ep.status,
            dueDate: ep.dueDate,
            description: ep.description ?? null,
            priority: ep.priority ?? null,
        });
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Typography variant="h4" fontWeight="bold">
                    Calendar
                </Typography>
                <TextField
                    select
                    size="small"
                    label="Project"
                    sx={{ minWidth: 220 }}
                    value={filterProjectId}
                    onChange={(e) => setFilterProjectId(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    {Object.values(projectsById).map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                            {p.title}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="auto"
                events={filteredEvents}
                eventClick={onEventClick}
                editable
                eventDrop={async (info) => {
                    const id = info.event.id;
                    const newDate = info.event.startStr.slice(0, 10);
                    const currentTitle = info.event.title;
                    await updateTask(id, { dueDate: newDate, title: currentTitle });

                    setEvents((prev) =>
                        prev.map((e) => {
                            if (e.id !== id) return e;
                            const ep: EP = { ...e.extendedProps, dueDate: newDate };
                            const c = eventColors(ep.status, newDate);
                            return { ...e, start: newDate, extendedProps: ep, ...c };
                        })
                    );
                }}
            />

            <Stack direction="row" gap={1} mt={1.5} alignItems="center">
                <Box sx={{ width: 12, height: 12, bgcolor: "#c62828", borderRadius: 0.5 }} />
                <Typography variant="caption">Overdue</Typography>
                <Box sx={{ width: 12, height: 12, bgcolor: "#1565c0", borderRadius: 0.5, ml: 2 }} />
                <Typography variant="caption">Upcoming</Typography>
                <Box sx={{ width: 12, height: 12, bgcolor: "#2e7d32", borderRadius: 0.5, ml: 2, opacity: 0.75 }} />
                <Typography variant="caption">Done</Typography>
            </Stack>

            <Dialog open={!!selected} onClose={() => (saving ? null : setSelected(null))}>
                <DialogTitle>Task</DialogTitle>
                <DialogContent>
                    <Stack gap={1.25} mt={0.5} sx={{ minWidth: 320, maxWidth: 520 }}>
                        {/* Title */}
                        <Stack>
                            <Typography variant="overline" color="text.secondary">
                                Title
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={700}>
                                {selected?.title}
                            </Typography>
                        </Stack>

                        {selected?.description && (
                            <Stack>
                                <Typography variant="overline" color="text.secondary">
                                    Description
                                </Typography>
                                <Tooltip title={selected.description} placement="top-start">
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            whiteSpace: "pre-wrap",
                                        }}
                                    >
                                        {selected.description}
                                    </Typography>
                                </Tooltip>
                            </Stack>
                        )}

                        <Stack>
                            <Typography variant="overline" color="text.secondary">
                                Status
                            </Typography>
                            <Typography variant="body2">{selected?.status}</Typography>
                        </Stack>

                        {selected?.priority && (
                            <Stack>
                                <Typography variant="overline" color="text.secondary">
                                    Priority
                                </Typography>
                                <Chip
                                    size="small"
                                    label={selected.priority}
                                    color={PRIORITY_COLOR[selected.priority]}
                                    sx={{ alignSelf: "flex-start", textTransform: "capitalize" }}
                                />
                            </Stack>
                        )}

                        {selected?.dueDate && (
                            <Stack>
                                <Typography variant="overline" color="text.secondary">
                                    Due Date
                                </Typography>
                                <Typography variant="body2">{fmt(selected.dueDate)}</Typography>
                            </Stack>
                        )}

                        <Divider sx={{ mt: 0.5 }} />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button disabled={saving} onClick={() => setSelected(null)}>
                        Close
                    </Button>

                    {selected?.status !== "DONE" && (
                        <Button
                            variant="contained"
                            disabled={saving}
                            onClick={async () => {
                                if (!selected) return;
                                try {
                                    setSaving(true);
                                    await updateTask(selected.id, { status: "DONE", title: selected.title });
                                    setEvents((prev) =>
                                        prev.map((e) => {
                                            if (e.id !== selected.id) return e;
                                            const ep: EP = { ...e.extendedProps, status: "DONE" };
                                            const c = eventColors("DONE", ep.dueDate);
                                            return { ...e, extendedProps: ep, ...c };
                                        })
                                    );
                                    setSelected(null);
                                } finally {
                                    setSaving(false);
                                }
                            }}
                        >
                            Mark as Done
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}
