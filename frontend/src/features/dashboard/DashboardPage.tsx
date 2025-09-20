import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import {useAuthStore} from "../../store/authStore.ts";

export default function DashboardPage() {
    const { user } = useAuthStore();

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Welcome {user?.name}!
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={2} mb={3}>
                {[
                    { label: "Total Projects", value: 0 },
                    { label: "Open Tasks", value: 0 },
                    { label: "Due Soon", value: 0 },
                ].map((s, i) => (
                    <Grid key={i} size={{ xs: 12, md: 4 }}>
                        <Card elevation={1}>
                            <CardContent>
                                <Typography variant="h6">{s.label}</Typography>
                                <Typography variant="h4" fontWeight="bold">{s.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Two-column area that resizes with sidebar */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ height: 260 }} elevation={1}>
                        <CardContent>
                            <Typography variant="h6" mb={1}>Recent Activity</Typography>
                            <Typography variant="body2" color="text.secondary">🚧 Coming soon...</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ height: 260 }} elevation={1}>
                        <CardContent>
                            <Typography variant="h6" mb={1}>Productivity</Typography>
                            <Typography variant="body2" color="text.secondary">📈 Charts will be added later.</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
