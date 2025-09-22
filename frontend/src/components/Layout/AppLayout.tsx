import { useMemo, useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import UserMenu from "../../components/AppBar/UserMenu";
import { DRAWER_WIDTH, MINI_WIDTH } from "./SideBar";

export default function AppLayout() {
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const sidebarWidth = useMemo(() => (open ? DRAWER_WIDTH : MINI_WIDTH), [open]);

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
                <Toolbar variant="dense" sx={{ minHeight: 56, gap: 1, px: { xs: 1, sm: 2 } }}>

                    <IconButton color="inherit" edge="start" onClick={() => setMobileOpen((v) => !v)} sx={{ display: { md: "none" } }}>
                        <MenuIcon />
                    </IconButton>

                    <IconButton color="inherit" edge="start" onClick={() => setOpen((v) => !v)} sx={{ display: { xs: "none", md: "inline-flex" } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, letterSpacing: 0.2 }}>TaskRaum</Typography>
                    <UserMenu />
                </Toolbar>
            </AppBar>

            <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} variant="temporary" />
            <Sidebar open={open} variant="permanent" />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: { xs: 10, md: 11 },
                    pb: 3,
                    px: { xs: 2, md: 4 },
                    ml: { xs: 0, md: `${sidebarWidth}px` },
                    transition: (t) =>
                        t.transitions.create(["margin-left", "padding-top"], {
                            duration: t.transitions.duration.shorter,
                        }),
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 1200, ml: { md: 20 } }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}