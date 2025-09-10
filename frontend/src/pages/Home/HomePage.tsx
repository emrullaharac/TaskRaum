import { Box, Button, Container, Paper, Stack, Typography, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SiteTopBar from "../../components/AppBar/SiteTopBar";
import AppFooter from "../../components/Layout/AppFooter";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SecurityIcon from "@mui/icons-material/Security";
import DesignServicesIcon from "@mui/icons-material/DesignServices";

export default function HomePage() {
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <SiteTopBar />

            {/* MAIN */}
            <Box component="main" sx={{ flex: 1 }}>
                {/* Hero */}
                <Box sx={{ py: { xs: 8, md: 12}, textAlign: "center" }}>
                    <Container maxWidth="md">
                        <Typography variant="h3" fontWeight={800} gutterBottom>
                            Organize projects. Focus on what matters.
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            TaskRaum helps you structure projects, manage tasks, and keep momentum —
                            fast, minimal, and secure with JWT-based auth.
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button component={RouterLink} to="/login" variant="contained" size="large">
                                Get Started
                            </Button>
                            <Button component={RouterLink} to="/register" variant="outlined" size="large">
                                Create Account
                            </Button>
                        </Stack>
                    </Container>
                </Box>

                {/* Features */}
                <Container maxWidth="lg" sx={{ pb: 6 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper sx={{ p: 3, borderRadius: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                    <RocketLaunchIcon />
                                    <Typography variant="h6" fontWeight={700}>Fast & Modern</Typography>
                                </Stack>
                                <Typography color="text.secondary">
                                    Easily create projects, set priorities, and keep a clean birds-eye view.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper sx={{ p: 3, borderRadius: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                    <SecurityIcon />
                                    <Typography variant="h6" fontWeight={700}>Secure backend</Typography>
                                </Stack>
                                <Typography color="text.secondary">
                                    JWT with refresh tokens via HttpOnly cookies keeps your session safe.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper sx={{ p: 3, borderRadius: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                    <DesignServicesIcon />
                                    <Typography variant="h6" fontWeight={700}>Task Management</Typography>
                                </Stack>
                                <Typography color="text.secondary">
                                    Plan, track, and complete tasks with a smooth, distraction-free UI.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* FOOTER */}
            <AppFooter />
        </Box>
    );
}