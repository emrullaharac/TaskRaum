import { useContext, useState } from "react";
import {
    Avatar, Box, Divider, IconButton, ListItemIcon,
    Menu, MenuItem, Tooltip, Typography
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ColorModeContext } from "../../app/providers/ColorModeContext";
import { useAuthStore } from "../../store/authStore.ts";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { mode, toggleColorMode } = useContext(ColorModeContext);
    const { user, logout } = useAuthStore();
    const nav = useNavigate();

    const first = (user?.name?.trim()?.[0] ?? "").toUpperCase();
    const last = (user?.surname?.trim()?.[0] ?? "").toUpperCase();
    const initials = (first + last) || "U";
    const label = [user?.name, user?.surname].filter(Boolean).join(" ") || user?.email || "User";

    if (!user) return null;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <Box display="flex" alignItems="center" gap={1.25}>
            <Typography
                variant="body1"
                fontWeight={500}
                sx={{ display: { xs: "none", md: "block" }, opacity: 0.9 }}
            >
                {label}
            </Typography>

            <Tooltip title="Account">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    sx={{ p: 0.25 }}
                >
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {initials}
                    </Avatar>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 2,
                        sx: {
                            mt: 1.25,
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                            "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0, right: 14,
                                width: 10, height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <Box px={2} py={1}>
                    <Typography variant="subtitle2">{label}</Typography>
                    {user.email && (
                        <Typography variant="caption" color="text.secondary">
                            {user.email}
                        </Typography>
                    )}
                </Box>
                <Divider />

                <MenuItem onClick={toggleColorMode} dense>
                    <ListItemIcon>
                        {mode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </ListItemIcon>
                    Toggle {mode === "dark" ? "Light" : "Dark"} Mode
                </MenuItem>

                <MenuItem onClick={() => nav("/app/settings")} dense>
                    <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                    Profile & Settings
                </MenuItem>

                <MenuItem onClick={logout} dense sx={{ color: "error.main" }}>
                    <ListItemIcon sx={{ color: "error.main" }}>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
}
