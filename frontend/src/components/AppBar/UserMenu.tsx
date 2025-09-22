import { useMemo, useState } from "react";
import {
    Avatar, Box, IconButton, Menu, MenuItem, ListItemIcon,
    ListItemText, Tooltip, Typography, Divider
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import type { UserDto } from "../../types/domain";

function initials(u: UserDto) {
    const a = (u.name?.trim()?.[0] ?? "").toUpperCase();
    const b = (u.surname?.trim()?.[0] ?? "").toUpperCase();
    return (a + b) || "U";
}
function fullName(u: UserDto) {
    return [u.name, u.surname ?? ""].filter(Boolean).join(" ");
}

export default function UserMenu() {
    const { user, logout } = useAuthStore();
    const nav = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const label = useMemo(() => {
        if (!user) return "User";
        return fullName(user) || user.email || "User";
    }, [user]);

    if (!user) return null;

    return (
        <Box display="flex" alignItems="center" gap={1.25}>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, opacity: 0.9 }}>
                {label}
            </Typography>

            <Tooltip title="Account">
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ p: 0.25 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {initials(user)}
                    </Avatar>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <Box px={2} py={1}>
                    <Typography variant="subtitle2">{label}</Typography>
                    {user.email && <Typography variant="caption" color="text.secondary">{user.email}</Typography>}
                </Box>
                <Divider />
                <MenuItem onClick={() => nav("/app/settings")}>
                    <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Profile & Settings" />
                </MenuItem>
                <MenuItem onClick={logout}>
                    <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </MenuItem>
            </Menu>
        </Box>
    );
}