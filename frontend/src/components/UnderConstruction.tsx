import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";

type Props = { title?: string; hint?: string };

export default function UnderConstruction({ title = "This page is under construction", hint = "You will soon reach this feature." }: Props) {
    return (
        <Card sx={{ maxWidth: 720, mx: "auto", mt: 6 }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <BuildIcon />
                    <Typography variant="h5" fontWeight="bold">{title}</Typography>
                </Box>
                <Typography color="text.secondary" mb={2}>
                    {hint}
                </Typography>
                <Button variant="outlined" startIcon={<BuildIcon />} disabled>
                    Coming soon
                </Button>
            </CardContent>
        </Card>
    );
}
