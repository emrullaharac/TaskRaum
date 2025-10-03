import { useEffect, useMemo, useRef, useState, useDeferredValue } from "react";
import {
    Box, Typography, Card, CardContent, Grid, TextField, InputAdornment,
    Chip, Stack, Divider, Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import FolderIcon from "@mui/icons-material/Folder";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PercentIcon from "@mui/icons-material/Percent";
import type { ProjectDto, TaskDto, TaskPriority } from "../../types/domain";
import { listProjects } from "../projects/api";
import { listAllTasksByProject } from "../tasks/api";

const PRIO_ORDER: Record<TaskPriority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const PRIORITY_COLOR: Record<TaskPriority, "default" | "warning" | "error" | "info"> = {
    LOW: "info",
    MEDIUM: "warning",
    HIGH: "error",
};

const nowMs = () => Date.now();
const daysLeft = (ts: number) => Math.ceil((ts - nowMs()) / 86400000);
const dueLabel = (ts?: number | null) => {
    if (!ts) return "No due";
    const d = daysLeft(ts);
    return d < 0 ? `Overdue ${Math.abs(d)}d` : `in ${d}d`;
};
const dueChipVariant = (ts?: number | null) => (ts && daysLeft(ts) < 0 ? "filled" : "outlined");
const dueChipColor = (ts?: number | null) => (ts && daysLeft(ts) < 0 ? "error" : "default");

export default function DashboardPage() {
    const [projects, setProjects] = useState<ProjectDto[]>([]);
    const [tasks, setTasks] = useState<TaskDto[]>([]);
    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);

    useEffect(() => {
        (async () => {
            const prj = await listProjects();
            setProjects(prj);
            const taskArrays = await Promise.all(prj.map(p => listAllTasksByProject(p.id)));
            setTasks(taskArrays.flat());
        })();
    }, []);

    const projectMap = useMemo(() => {
        const map: Record<string, string> = {};
        projects.forEach(p => { map[p.id] = p.title; });
        return map;
    }, [projects]);

    const timer = useRef<number | null>(null);
    function setQueryDebounced(v: string) {
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setQuery(v), 200);
    }

    const normTasks = useMemo(() => (
        tasks.map(t => ({
            ...t,
            _title: t.title.toLowerCase(),
            _due: t.dueDate ? new Date(t.dueDate).getTime() : null,
        }))
    ), [tasks]);

    const filteredTasks = useMemo(() => {
        if (!deferredQuery) return normTasks;
        const q = deferredQuery.toLowerCase();
        return normTasks.filter(t => t._title.includes(q));
    }, [normTasks, deferredQuery]);

    const { totalProjects, openTasksGlobal, dueSoonGlobal, completionRate } = useMemo(() => {
        const in7 = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const open = tasks.filter(t => t.status !== "DONE");
        const dueSoon = tasks.filter(t => t.dueDate && new Date(t.dueDate).getTime() <= in7 && t.status !== "DONE");
        const done = tasks.filter(t => t.status === "DONE").length;
        const total = tasks.length || 1;
        return {
            totalProjects: projects.length,
            openTasksGlobal: open.length,
            dueSoonGlobal: dueSoon.length,
            completionRate: Math.round((done / total) * 100),
        };
    }, [projects, tasks]);

    const upcoming = useMemo(() => {
        const in7 = Date.now() + 7 * 24 * 60 * 60 * 1000;
        return filteredTasks
            .filter(t => t._due && t.status !== "DONE" && t._due <= in7)
            .sort((a, b) => (a._due ?? 0) - (b._due ?? 0))
            .slice(0, 5);
    }, [filteredTasks]);

    const openTop = useMemo(() => {
        return filteredTasks
            .filter(t => t.status !== "DONE")
            .sort((a, b) => {
                const ap = PRIO_ORDER[(a.priority || "LOW") as TaskPriority] ?? 3;
                const bp = PRIO_ORDER[(b.priority || "LOW") as TaskPriority] ?? 3;
                if (ap !== bp) return ap - bp;
                const ad = a._due ?? 8640000000000000;
                const bd = b._due ?? 8640000000000000;
                return ad - bd;
            })
            .slice(0, 5);
    }, [filteredTasks]);

    const kpis = [
        { label: "Total Projects", value: totalProjects, icon: <FolderIcon fontSize="small" />, sx: { background: "linear-gradient(135deg, #e3f2fd, #f3e5f5)" } },
        { label: "Open Tasks", value: openTasksGlobal, icon: <AssignmentTurnedInIcon fontSize="small" />, sx: { background: "linear-gradient(135deg, #e8f5e9, #fff3e0)" } },
        { label: "Due Soon (7d)", value: dueSoonGlobal, icon: <WarningAmberIcon fontSize="small" />, sx: { background: "linear-gradient(135deg, #fff8e1, #fde0dc)" } },
        { label: "Completion", value: `${completionRate}%`, icon: <PercentIcon fontSize="small" />, sx: { background: "linear-gradient(135deg, #e0f7fa, #e8eaf6)" } },
    ];

    return (
        <Box>
            <Box mb={3}>
                <TextField
                    fullWidth
                    placeholder="Search tasks… (lists only)"
                    defaultValue={query}
                    onChange={(e) => setQueryDebounced(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            <Grid container spacing={2} mb={3}>
                {kpis.map((k, i) => (
                    <Grid key={i} size={{ xs: 12, md: 3 }}>
                        <Card elevation={0} sx={{ ...k.sx, borderRadius: 3 }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ color: "rgba(0,0,0,0.7)" }}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ color: "rgba(0,0,0,0.7)" }}>{k.label}</Typography>
                                    {k.icon}
                                </Stack>
                                <Typography variant="h4" fontWeight="bold" mt={0.5} sx={{ color: "rgba(0,0,0,0.9)" }}>{k.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card elevation={1} sx={{ height: 450, display: "flex", flexDirection: "column" }}>
                        <CardContent
                            sx={{
                                flex: 1,
                                overflow: "auto",
                                pr: 1,
                                "&::-webkit-scrollbar": { width: 6 },
                            }}
                        >
                            <Typography variant="h6" mb={1}>Upcoming Deadlines (7 days)</Typography>
                            {upcoming.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">No upcoming deadlines.</Typography>
                            ) : (
                                <Stack divider={<Divider flexItem />} spacing={1}>
                                    {upcoming.map(t => (
                                        <Stack key={t.id} direction="row" alignItems="center" justifyContent="space-between" py={0.5}>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Chip
                                                    size="small"
                                                    variant="outlined"
                                                    color="secondary"
                                                    label={projectMap[t.projectId] || "Unknown Project"}
                                                    sx={{ mb: 0.25, maxWidth: 220 }}
                                                />
                                                <Tooltip title={t.title}>
                                                    <Typography variant="subtitle1" noWrap>{t.title}</Typography>
                                                </Tooltip>
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
                                            </Box>
                                            <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
                                                {t.priority && (
                                                    <Chip size="small" color={PRIORITY_COLOR[t.priority]} label={t.priority} />
                                                )}
                                                <Chip
                                                    size="small"
                                                    variant={dueChipVariant(t._due)}
                                                    color={dueChipColor(t._due)}
                                                    label={t._due ? dueLabel(t._due) : "No due"}
                                                />
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Card elevation={1} sx={{ height: 450, display: "flex", flexDirection: "column" }}>
                        <CardContent
                            sx={{
                                flex: 1,
                                overflow: "auto",
                                pr: 1,
                                "&::-webkit-scrollbar": { width: 6 },
                            }}
                        >
                            <Typography variant="h6" mb={1}>Open Tasks (Top 5)</Typography>
                            {openTop.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">Nothing open in this view.</Typography>
                            ) : (
                                <Stack divider={<Divider flexItem />} spacing={1}>
                                    {openTop.map(t => (
                                        <Stack key={t.id} direction="row" alignItems="center" justifyContent="space-between" py={0.5}>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Chip
                                                    size="small"
                                                    variant="outlined"
                                                    color="secondary"
                                                    label={projectMap[t.projectId] || "Unknown Project"}
                                                    sx={{ mb: 0.25, maxWidth: 220 }}
                                                />
                                                <Tooltip title={t.title}>
                                                    <Typography variant="subtitle1" noWrap>{t.title}</Typography>
                                                </Tooltip>
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    Status: {t.status}{t._due ? ` • Due ${dueLabel(t._due)}` : ""}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                size="small"
                                                color={PRIORITY_COLOR[(t.priority || "LOW") as TaskPriority]}
                                                label={t.priority || "LOW"}
                                            />
                                        </Stack>
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
