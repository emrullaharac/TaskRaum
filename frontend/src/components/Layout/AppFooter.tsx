import { Box, Container, Typography, Stack, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function AppFooter() {
    return (
        <Box
            component="footer" sx={{
            minHeight: 56, display: "flex", alignItems: "center",
            borderTop: "1px solid", borderColor: "divider",
            bgcolor: (t) =>
                t.palette.mode === "light"
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.18)",
            backdropFilter: "blur(6px)",
        }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex", flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", rowGap: 1, columnGap: 2,
                    py: { xs: 1.5, sm: 1 }, px: 2,
                }}
            >
                <Typography
                    variant="body2"
                    sx={{ minWidth: 0, flexShrink: 1, textAlign: { xs: "center", sm: "left" } }}
                    noWrap={false}
                >
                    © {new Date().getFullYear()} TaskRaum — Developed by Emrullah Arac
                </Typography>

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        flexWrap: "wrap",
                        rowGap: 0.5,
                        justifyContent: { xs: "center", sm: "flex-end" },
                        alignItems: "center",
                    }}
                >
                    <Link
                        component={RouterLink}
                        to="/"
                        underline="hover"
                        color="inherit"
                        variant="body2"
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        Home
                    </Link>

                    <Typography variant="body2" color="text.secondary">·</Typography>

                    <Link
                        component={RouterLink}
                        to="/about"
                        underline="hover"
                        color="inherit"
                        variant="body2"
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        About
                    </Link>

                    <Typography variant="body2" color="text.secondary">·</Typography>

                    <Link
                        component={RouterLink}
                        to="/privacy"
                        underline="hover"
                        color="inherit"
                        variant="body2"
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        Privacy
                    </Link>

                    <Typography variant="body2" color="text.secondary">·</Typography>

                    <Link
                        href="https://github.com/emrullaharac/TaskRaum"
                        underline="hover"
                        color="inherit"
                        target="_blank"
                        rel="noopener"
                        variant="body2"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            whiteSpace: "nowrap",
                            fontWeight:500
                        }}
                    >
                        <GitHubIcon fontSize="small" />
                        GitHub
                    </Link>
                </Stack>
            </Container>
        </Box>
    );
}