import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../../pages/Home/HomePage";
import AboutPage from "../../pages/About/AboutPage";
import LoginPage from "../../pages/Auth/LoginPage";
import RegisterPage from "../../pages/Auth/RegisterPage";
import DashboardPage from "../../pages/Dashboard/DashboardPage";
import { RequireAuth } from "../../features/auth/guards";
import NotFoundPage from "../../pages/System/NotFoundPage";

export function RouterProvider() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Private */}
                <Route element={<RequireAuth />}>
                    <Route path="/app" element={<DashboardPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}