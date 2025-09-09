import { AppBar, Toolbar, Typography, Button, Stack, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Logo from "../../assets/icon_2.svg";

export default function SiteTopBar() {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={(theme) => ({
                backdropFilter: "blur(8px)",
                backgroundColor:
                    theme.palette.mode === "light"
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(0,0,0,0.6)",
                borderBottom: `2px solid ${theme.palette.divider}`,
            })}
        >
            <Toolbar
                sx={{
                    minHeight: "auto",
                    py: 1,
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", sm: "space-around" },
                }}
            >
                {/* Logo + Brand */}
                <Box
                    component={RouterLink}
                    to="/"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "primary.main",
                        fontWeight: 700,
                        minWidth: 0,
                    }}
                >
                    <Box component="img" src={Logo} alt="TaskRaum logo" sx={{ width: 28, height: 28, mr: 1 }} />
                    <Typography variant="h6" fontWeight={700} noWrap>
                        TaskRaum
                    </Typography>
                </Box>

                {/* Nav links */}
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                        flexWrap: "wrap",
                        rowGap: 0.5,
                        justifyContent: { xs: "center", sm: "flex-end" },
                        maxWidth: "100%",
                    }}
                >
                    <Button
                        component={RouterLink}
                        to="/about"
                        variant="text"
                        sx={{
                            fontWeight: 500,
                            color: "text.primary",
                            "&:hover": { textDecoration: "underline" },
                            px: { xs: 1, sm: 1.5 },
                            minWidth: "auto",
                        }}
                    >
                        About
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/login"
                        variant="text"
                        sx={{
                            fontWeight: 500,
                            color: "text.primary",
                            "&:hover": { textDecoration: "underline" },
                            px: { xs: 1, sm: 1.5 },
                            minWidth: "auto",
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/register"
                        variant="contained"
                        sx={{
                            borderRadius: "20px",
                            px: { xs: 1.75, sm: 2.5 },
                            py: { xs: 0.5, sm: 0.75 },
                            fontWeight: 600,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.25)" },
                            minWidth: "auto",
                        }}
                    >
                        Register
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
