import { useState, useContext } from "react";
import {
    AppBar, Box, Toolbar, Typography, IconButton, Button, Stack, Drawer,
    List, ListItem, ListItemButton, ListItemText, Divider, Container, Avatar,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ColorModeContext } from "../../app/providers/ColorModeContext";
import Logo from "../../assets/icon_2.svg";

const nav = [
    { label: "About", to: "/about", external: false },
    { label: "GitHub", to: "https://github.com/emrullaharac/TaskRaum", external: true },
];

export default function SiteTopBar() {
    const [open, setOpen] = useState(false);
    const { mode, toggleColorMode } = useContext(ColorModeContext);
    const location = useLocation();
    const elevate = location.pathname === "/";

    return (
        <AppBar
            position="sticky"
            elevation={elevate ? 0 : 1}
            sx={(t) => ({
                backdropFilter: "blur(8px)",
                backgroundColor:
                    t.palette.mode === "light"
                        ? t.palette.primary.main + "14"
                        : t.palette.background.paper + "f2",
                color: t.palette.text.primary,
                borderBottom: 1,
                borderColor: "divider",
            })}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ minHeight: 64, px: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
                        <Avatar
                            src={Logo}
                            alt="TaskRaum"
                            variant="rounded"
                            sx={{ width: 28, height: 28, bgcolor: "transparent" }}
                        />
                        <Typography
                            component={RouterLink}
                            to="/"
                            variant="h6"
                            fontWeight={800}
                            color="inherit"
                            sx={{ textDecoration: "none" }}
                        >
                            TaskRaum
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ display: { xs: "none", md: "flex" } }}
                    >
                        {nav.map((n) =>
                            n.external ? (
                                <IconButton
                                    key={n.label}
                                    href={n.to}
                                    target="_blank"
                                    rel="noopener"
                                    aria-label="GitHub"
                                    color="inherit"
                                >
                                    <GitHubIcon fontSize="small" />
                                </IconButton>
                            ) : (
                                <Button
                                    key={n.label}
                                    component={RouterLink}
                                    to={n.to}
                                    color="inherit"
                                    sx={{ fontWeight: 600 }}
                                >
                                    {n.label}
                                </Button>
                            )
                        )}

                        <IconButton
                            onClick={toggleColorMode}
                            color="inherit"
                            aria-label="toggle theme"
                        >
                            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>

                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="text"
                            sx={{ fontWeight: 600 }}
                        >
                            Login
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            sx={{ fontWeight: 700 }}
                        >
                            Register
                        </Button>
                    </Stack>

                    <IconButton
                        sx={{ display: { xs: "inline-flex", md: "none" } }}
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </Container>

            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{ width: 280, p: 2 }}
                    role="presentation"
                    onClick={() => setOpen(false)}
                >
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                        TaskRaum
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {nav.map((n) => (
                            <ListItem key={n.label} disablePadding>
                                {n.external ? (
                                    <ListItemButton
                                        component="a"
                                        href={n.to}
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        <ListItemText primary={n.label} />
                                    </ListItemButton>
                                ) : (
                                    <ListItemButton component={RouterLink} to={n.to}>
                                        <ListItemText primary={n.label} />
                                    </ListItemButton>
                                )}
                            </ListItem>
                        ))}
                    </List>
                    <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                        <Button component={RouterLink} to="/login" variant="outlined" fullWidth>
                            Login
                        </Button>
                        <Button component={RouterLink} to="/register" variant="contained" fullWidth>
                            Register
                        </Button>
                    </Stack>
                    <Button
                        onClick={toggleColorMode}
                        startIcon={mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                        sx={{ mt: 2 }}
                        fullWidth
                        variant="outlined"
                    >
                        Toggle {mode === "dark" ? "Light" : "Dark"} Mode
                    </Button>
                </Box>
            </Drawer>
        </AppBar>
    );
}
