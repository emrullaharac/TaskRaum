import { Alert } from "@mui/material";

export default function FormErrorAlert({ message }: { message: string | null }) {
    if (!message) return null;
    return <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>;
}