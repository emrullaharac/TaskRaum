import { useEffect, useState } from "react";
import { Container, Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

type UserDto = {
    id: string;
    name: string;
    surname?: string;
    email: string;
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        fetch("http://localhost:8080/auth/me", { credentials: "include" })
            .then(r => (r.ok ? r.json() : null))
            .then(u => { if (alive) { setUser(u); setLoading(false); }})
            .catch(() => { if (alive) { setUser(null); setLoading(false); }});
        return () => { alive = false; };
    }, []);

    async function handleLogout() {
        try {
            await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch {/* no need to send */}
        navigate("/login", { replace: true });
    }

    if (loading) {
        return (
            <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
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
    );
}