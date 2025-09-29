import {Container, Paper, Typography, Link, Box} from "@mui/material";
import SiteTopBar from "../../components/AppBar/SiteTopBar";
import AppFooter from "../../components/Layout/AppFooter";
import { Link as RouterLink } from "react-router-dom";

export default function PrivacyPage() {
    return (
            <Box  sx={{ minHeight: { sm: "100vh", xs: "auto" }, display: "flex", flexDirection: "column" }}>
                <SiteTopBar />
                <Box component="main" sx={{ flex: 1, mt:10 }}>
                    <Container maxWidth="md" sx={{ my: 4 }}>
                        <Paper sx={{ p: { xs: 2, sm: 4 } }}>
                            <Typography variant="h4" gutterBottom>
                                Privacy Notice
                            </Typography>

                            <Typography sx={{ mb: 2 }}>
                                This application is a demo project created for testing and learning purposes only.
                                It is not intended for real or commercial use.
                            </Typography>

                            <Typography sx={{ mb: 2 }}>
                                When registering, you may enter a name, surname, and email address.
                                This information is stored in a demo database and may be removed at any time without notice.
                            </Typography>

                            <Typography sx={{ mb: 2 }}>
                                Please do not use real personal data when creating an account. Use test information instead.
                            </Typography>

                            <Typography sx={{ mb: 2 }}>
                                The demo may be reset or deleted at any time. No data is shared or used commercially.
                            </Typography>

                            <Typography sx={{ mb: 1 }}>
                                For questions, reach out via the project{" "}
                                <Link
                                    href="https://github.com/emrullaharac/TaskRaum"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub repository
                                </Link>.
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Tip: You can review this notice anytime from the footer or registration page.
                            </Typography>

                            <Typography sx={{ mt: 3 }}>
                                <Link component={RouterLink} to="/" underline="hover">
                                    Go back home
                                </Link>
                            </Typography>
                        </Paper>
                    </Container>
                </Box>
                <AppFooter />
            </Box>
    );
}