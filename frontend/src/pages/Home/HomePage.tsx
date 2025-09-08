import { Container, Box, Typography, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function HomePage() {
    return (
        <Container maxWidth="sm">
            <Box py={10} textAlign="center">
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    TaskRaum
                </Typography>
                <Typography color="text.secondary" mb={4}>
                    Simple project & task tracking. Please log in or create an account.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button variant="contained" component={RouterLink} to="/login">
                        Login
                    </Button>
                    <Button variant="outlined" component={RouterLink} to="/register">
                        Register
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
}