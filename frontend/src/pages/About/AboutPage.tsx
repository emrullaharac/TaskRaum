import {Container, Box, Typography, Stack, Link} from "@mui/material";
import SiteTopBar from "../../components/AppBar/SiteTopBar";
import AppFooter from "../../components/Layout/AppFooter";
import GitHubIcon from '@mui/icons-material/GitHub';

export default function AboutPage() {
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <SiteTopBar />

            {/* MAIN */}
            <Box component="main" sx={{ flex: 1 }}>
                <Container maxWidth="md">
                    <Box sx={{ py: 20}}>
                        <Typography variant="h4" fontWeight={800} gutterBottom>
                            About TaskRaum
                        </Typography>

                        <Typography color="text.secondary">
                            TaskRaum is a personal project management app built for clarity and speed.
                            It focuses on the essentials: planning, tracking, and staying organized —
                            backed by a secure JWT-based API.
                        </Typography>

                        <Typography color="text.secondary">
                            This app was created as part of a developer bootcamp capstone and continues
                            to evolve as a practical, real-world tool.
                        </Typography>

                        <Stack direction="row" spacing={2} mt={2}>
                            <Typography color="text.secondary">Check GitHub Repo</Typography>
                            <Link
                                href="https://github.com/emrullaharac/TaskRaum"
                                underline="hover"
                                color="inherit"
                                target="_blank"
                                rel="noopener"
                                variant="body1"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <GitHubIcon fontSize="small" />
                                GitHub
                            </Link>
                            </Stack>
                    </Box>
                </Container>
            </Box>

            {/* FOOTER */}
            <AppFooter />
        </Box>
    );
}