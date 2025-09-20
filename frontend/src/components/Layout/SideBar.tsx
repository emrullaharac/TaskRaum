import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box, Tooltip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 240;
const MINI_WIDTH = 72;

type SidebarProps = { open: boolean; onClose?: () => void; variant?: "permanent" | "temporary" };

const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, to: "/app" },
    { label: "Projects", icon: <FolderIcon />, to: "/app/projects" },
    { label: "Tasks", icon: <CheckCircleIcon />, to: "/app/tasks" },
    { label: "Calendar", icon: <EventIcon />, to: "/app/calendar" },
    { label: "Settings", icon: <SettingsIcon />, to: "/app/settings" },
];

export default function Sidebar({ open, onClose, variant = "permanent" }: SidebarProps) {
    const location = useLocation();
    const width = open ? DRAWER_WIDTH : MINI_WIDTH;

    const content = (
        <Box sx={{ width }} role="presentation" onClick={variant === "temporary" ? onClose : undefined}>
    <Toolbar />
    <Divider />
    <List>
        {navItems.map((item) => (
                <Tooltip key={item.to} title={!open ? item.label : ""} placement="right">
    <ListItemButton
        component={Link}
    to={item.to}
    selected={location.pathname === item.to}
    sx={{
        px: open ? 2 : 1.25,
            justifyContent: open ? "flex-start" : "center",
    }}
>
    <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, justifyContent: "center" }}>
    {item.icon}
    </ListItemIcon>
    {open && <ListItemText primary={item.label} />}
    </ListItemButton>
    </Tooltip>
    ))}
    </List>
    </Box>
);

    return (
        <Drawer
            variant={variant}
    open={variant === "temporary" ? open : true}
    onClose={onClose}
    sx={{
        display: { xs: variant === "temporary" ? "block" : "none", md: "block" },
        "& .MuiDrawer-paper": {
            width,
                boxSizing: "border-box",
                transition: (t) => t.transitions.create("width", {
                easing: t.transitions.easing.sharp,
                duration: t.transitions.duration.shorter,
            }),
        },
    }}
>
    {content}
    </Drawer>
);
}
