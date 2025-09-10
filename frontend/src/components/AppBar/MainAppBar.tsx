import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/api.ts";

export default function MainAppBar() {
    const navigate = useNavigate();

    async function handleLogout(e: React.MouseEvent) {
        e.preventDefault();
        await logout();
        navigate("/login", { replace: true });
    }

    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography component={RouterLink} to="/app" variant="h6" sx={{ textDecoration: "none" }}>
                    TaskRaum
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button component={RouterLink} to="/app">Dashboard</Button>
                    <Button component={RouterLink} to="/login" onClick={handleLogout}>Logout</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}