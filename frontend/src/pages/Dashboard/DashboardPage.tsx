import { useEffect, useState } from "react";
import { Container, Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { me, logout, type UserDto } from "../../features/auth/api";
import MainAppBar from "../../components/AppBar/MainAppBar.tsx";



export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        me().then(setUser).finally(() => setLoading(false));
    }, []);

    async function handleLogout() {
        await logout();
        navigate("/", { replace: true });
    }

    if (loading) {
        return (
            <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <MainAppBar/>
            <Container maxWidth="lg">
                <Box py={6}>
                    <Typography variant="h4" fontWeight={700}>
                        Welcome{user?.name ? `, ${user.name}` : ""} 👋
                    </Typography>
                    <Typography color="text.secondary" mb={3}>
                        You’re logged in. Next: Projects & Tasks.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={() => navigate("/app")}>Dashboard</Button>
                        <Button variant="outlined" onClick={handleLogout}>Logout</Button>
                    </Stack>
                </Box>
            </Container>
        </>
    );
}