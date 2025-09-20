import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import HomePage from "../../pages/Home/HomePage";
import AboutPage from "../../pages/About/AboutPage";
import LoginPage from "../../pages/Auth/LoginPage";
import RegisterPage from "../../pages/Auth/RegisterPage";
import DashboardPage from "../../features/dashboard/DashboardPage.tsx";
import AppLayout from "../../components/Layout/AppLayout.tsx";
import NotFoundPage from "../../pages/System/NotFoundPage";
import { RequireAuth } from "../../features/auth/guards";
import { useAuthStore } from "../../store/authStore";
import { Box, CircularProgress } from "@mui/material";
import ProjectsPage from "../../features/projects/ProjectsPage.tsx";
import TasksPage from "../../features/tasks/TasksPage.tsx";
import SettingsPage from "../../features/settings/SettingsPage.tsx";

function AuthGate({ children }: { children: ReactNode }) {
    const { user } = useAuthStore();
    return user ? <Navigate to="/app" replace /> : <>{children}</>;
}

export function RouterProvider() {
    const { user, loading } = useAuthStore();

    // shows spinner if loading
    if (loading) {
        return (
            <Box
                minHeight="100vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/" element={user ? <Navigate to="/app" replace /> : <HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<AuthGate><LoginPage /></AuthGate>} />
                <Route path="/register" element={<AuthGate><RegisterPage /></AuthGate>} />

                {/* Private */}
                <Route element={<RequireAuth />}>
                    <Route path="/app" element={<AppLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="projects" element={<ProjectsPage />} />
                        <Route path="tasks" element={<TasksPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}