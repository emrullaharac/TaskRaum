import { Box, Typography } from "@mui/material";
import UnderConstruction from "../../components/UnderConstruction.tsx";

export default function SettingsPage() {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={2}>
                Settings
            </Typography>
            <UnderConstruction hint="Profile and app preferences will be configurable here." />
        </Box>
    );
}
