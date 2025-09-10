import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Alert, Stack, Link } from "@mui/material";
import { login } from "../../features/auth/api";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(email, password);
            navigate("/app", { replace: true });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Login failed";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Container maxWidth="xs">
            <Box py={8}>
                <Typography variant="h4" fontWeight={700} mb={2}>Login</Typography>
                <Typography color="text.secondary" mb={3}>
                    Enter your credentials to continue.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            fullWidth
                        />
                        <Button type="submit" variant="contained" disabled={submitting}>
                            {submitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </Stack>
                </Box>

                <Typography mt={2}>
                    No account?{" "}
                    <Link component={RouterLink} to="/register">Create one</Link>
                </Typography>
            </Box>
        </Container>
    );
}