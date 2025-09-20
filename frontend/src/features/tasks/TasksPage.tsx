import { Box, Typography } from "@mui/material";
import UnderConstruction from "../../components/UnderConstruction.tsx";

export default function TasksPage() {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={2}>
                Tasks
            </Typography>
            <UnderConstruction hint="Track your tasks, statuses, and due dates here." />
        </Box>
    );
}
