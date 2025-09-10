import { Container, Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <Container maxWidth="sm">
            <Box py={20} textAlign="center">
                <Typography variant="h3" fontWeight={800} gutterBottom>Page not found!</Typography>
                <Typography color="text.secondary" mb={3} fontSize={18}>
                    The page you’re looking for doesn’t exist.
                </Typography>
                <Button component={RouterLink} to="/" variant="contained">Go Home</Button>
            </Box>
        </Container>
    );
}