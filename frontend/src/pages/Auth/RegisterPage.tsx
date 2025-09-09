import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Container, Box, Typography, TextField, Button, Alert, Stack, Link
} from "@mui/material";
import { register } from "../../features/auth/api";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await register(name, surname, email, password);
            navigate("/login", { replace: true });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Registration failed";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Container maxWidth="xs">
            <Box py={8}>
                <Typography variant="h4" fontWeight={700} mb={2}>Create account</Typography>
                <Typography color="text.secondary" mb={3}>
                    It’s quick and easy.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
                        <TextField label="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} required fullWidth/>
                        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
                        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
                        <Button type="submit" variant="contained" disabled={submitting}>
                            {submitting ? "Creating..." : "Create account"}
                        </Button>
                    </Stack>
                </Box>

                <Typography mt={2}>
                    Already have an account?{" "}
                    <Link component={RouterLink} to="/login">Sign in</Link>
                </Typography>
            </Box>
        </Container>
    );
}