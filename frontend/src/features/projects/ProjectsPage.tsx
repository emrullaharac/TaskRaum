import { Box, Typography } from "@mui/material";
import UnderConstruction from "../../components/UnderConstruction.tsx";

export default function ProjectsPage() {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={2}>
                Projects
            </Typography>
            <UnderConstruction hint="Create, view, and manage your projects here." />
        </Box>
    );
}
