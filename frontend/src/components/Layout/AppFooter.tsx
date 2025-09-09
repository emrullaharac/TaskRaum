import { Box, Container, Typography, Stack, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function AppFooter() {
    return (
        <Box
            component="footer"
            sx={(theme) => ({
                // allow height to grow when wrapping
                minHeight: 56,
                display: "flex",
                alignItems: "center",
                bgcolor: theme.palette.mode === "light" ? "grey.100" : "grey.900",
                color: theme.palette.mode === "light" ? "text.secondary" : "grey.100",
                borderTop: "1px solid",
                borderColor: "divider",
            })}
        >
            <Container
                maxWidth="lg"
                sx={{
                    // responsive row column and wrapping
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    rowGap: 1,
                    columnGap: 2,
                    py: 1,
                    px: 2,
                }}
            >
                <Typography
                    variant="body2"
                    sx={{ minWidth: 0, flexShrink: 1, textAlign: { xs: "center", sm: "left" } }}
                    noWrap={false}   // allow wrapping if it needs to
                >
                    © {new Date().getFullYear()} TaskRaum — Developed by Emrullah Arac
                </Typography>

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        flexWrap: "wrap",     // enables wrapping
                        rowGap: 0.5,
                        justifyContent: { xs: "center", sm: "flex-end" },
                        maxWidth: "100%",
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