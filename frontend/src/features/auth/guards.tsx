import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuthStore } from "../../store/authStore";

export function RequireAuth() {
    const { user, loading } = useAuthStore();
    const location = useLocation();

    if (loading) {
        return (
            <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}