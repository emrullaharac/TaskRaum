import { Box, Button, Container, Paper, Stack, Typography,
    Grid, Card, CardContent, CardMedia, Divider, } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SiteTopBar from "../../components/AppBar/SiteTopBar";
import AppFooter from "../../components/Layout/AppFooter";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LockIcon from "@mui/icons-material/Lock";
import TimelineIcon from "@mui/icons-material/Timeline";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import InsightsIcon from "@mui/icons-material/Insights";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function HomePage() {
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <SiteTopBar />
            <Box component="main" sx={{ flex: 1 }}>
                <Box
                    sx={{
                        position: "relative",
                        py: { xs: 10, md: 14 },
                        overflow: "hidden",
                        background: (t) =>
                            `linear-gradient(180deg, ${t.palette.primary.main}22, transparent 70%)`, // was 14 → 22
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            background: (t) =>
                                `radial-gradient(900px 350px at 50% -10%, ${t.palette.primary.main}33, transparent 70%)`, // was 26 → 33
                        }}
                    />
                    <Container maxWidth="md" sx={{ position: "relative", textAlign: "center" }}>
                        <Typography variant="h2" fontWeight={800} gutterBottom>
                            TaskRaum
                        </Typography>
                        <Typography variant="h3" fontWeight={800} gutterBottom>
                            Organize Projects. Manage Tasks.
                        </Typography>
                        <Typography variant="h6" color="text.primary" sx={{ mb: 3, mt: 5 }}>
                            A demo capstone project with Spring Boot REST API and a React + TypeScript UI.
                            Includes authentication, projects, tasks, and a calendar.
                        </Typography>
                        <Typography color="text.primary" sx={{ mb: 4 }}>
                            For full details and screenshots, visit the About page.
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button component={RouterLink} to="/login" variant="contained" size="large">
                                Get Started
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/about"
                                variant="outlined"
                                size="large"
                                startIcon={<InfoOutlinedIcon />}
                            >
                                About the Project
                            </Button>
                        </Stack>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ py: 6 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{ borderRadius: 3, height: "100%" }}>
                                <CardContent>
                                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                        <RocketLaunchIcon/>
                                        <Typography variant="h6" fontWeight={700}>Speed & Focus</Typography>
                                    </Stack>
                                    <Typography color="text.secondary">
                                        Minimal clicks. Clear layout. User-friendly.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{ borderRadius: 3, height: "100%" }}>
                                <CardContent>
                                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                        <LockIcon/>
                                        <Typography variant="h6" fontWeight={700}>Reliable Auth</Typography>
                                    </Stack>
                                    <Typography color="text.secondary">
                                        Stateless JWT + refresh tokens via HttpOnly cookies.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{ borderRadius: 3, height: "100%" }}>
                                <CardContent>
                                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                        <TimelineIcon/>
                                        <Typography variant="h6" fontWeight={700}>Built to Scale</Typography>
                                    </Stack>
                                    <Typography color="text.secondary">
                                        REST API, clean types, and predictable state.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 6 }} />

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}>
                                <CardContent>
                                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                        <InsightsIcon />
                                        <Typography variant="h6" fontWeight={700}>Dashboard at a glance</Typography>
                                    </Stack>
                                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                                        Metrics: Total Projects, Open Tasks, Due Soon (7d), Completion %.
                                        Lists: Upcoming Deadlines and Open Tasks (Top 5).
                                    </Typography>
                                    <CardMedia component="img" image="/assets/screenshots/Dashboard.png" alt="Dashboard"
                                               sx={{ height: 200, objectFit: "cover", borderRadius: 2, border: (t)=>`1px solid ${t.palette.divider}` }}/>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}>
                                <CardContent>
                                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                        <ViewKanbanIcon />
                                        <Typography variant="h6" fontWeight={700}>Kanban + Calendar</Typography>
                                    </Stack>
                                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                                        Drag & drop tasks across columns and reschedule on the calendar. Priorities as colored pills.
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <CardMedia component="img" image="/assets/screenshots/Tasks.png" alt="Tasks"
                                                       sx={{ height: 140, objectFit: "cover", borderRadius: 2, border: (t)=>`1px solid ${t.palette.divider}` }}/>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <CardMedia component="img" image="/assets/screenshots/Calendar.png" alt="Calendar"
                                                       sx={{ height: 140, objectFit: "cover", borderRadius: 2, border: (t)=>`1px solid ${t.palette.divider}` }}/>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 6 }} />

                    <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: (t)=>`1px solid ${t.palette.divider}` }}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                            <Typography variant="h6" fontWeight={700} textAlign="center">
                                Ready to explore more details?
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button component={RouterLink} to="/about" variant="contained">About the Project</Button>
                                <Button component={RouterLink} to="/register" variant="outlined">Create a demo Account</Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Container>
            </Box>

            <AppFooter />
        </Box>
    );
}
