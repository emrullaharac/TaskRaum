import { Box, Typography } from "@mui/material";
import UnderConstruction from "../../components/UnderConstruction.tsx";

export default function CalendarPage() {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={2}>
                Calendar
            </Typography>
            <UnderConstruction hint="A calendar view for deadlines and planning will appear here." />
        </Box>
    );
}
