import { useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar.tsx";
import { useAuthStore } from "../../store/authStore";

export default function AppLayout() {
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuthStore();

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
                <Toolbar>
                    {/* Mobile menu button */}
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setMobileOpen(true)}
                        sx={{ mr: 1, display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Desktop toggle button */}
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setOpen((v) => !v)}
                        sx={{ mr: 2, display: { xs: "none", md: "inline-flex" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        TaskRaum
                    </Typography>

                    {user && (
                        <>
                            <Box sx={{border: 1, borderColor: 'grey.500', borderRadius:1, mr: 2}}>
                                <Typography variant="body1" sx={{mx:1, my:0.5}}>
                                    {user.name}
                                </Typography>
                            </Box>

                            <Button
                                color="inherit"
                                    onClick={logout}
                                    sx={{border:1, ":hover": {backgroundColor: 'grey.500', color: 'primary.main'}}}>
                                Logout
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} variant="temporary" />

            {/* Desktop collapsible drawer */}
            <Sidebar open={open} variant="permanent" />

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box sx={{ width: { xs: "95%", md: "80%" }, maxWidth: "1200px" }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
