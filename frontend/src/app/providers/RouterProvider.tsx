import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../../pages/Home/HomePage";
import AboutPage from "../../pages/About/AboutPage";
import LoginPage from "../../pages/Auth/LoginPage";
import RegisterPage from "../../pages/Auth/RegisterPage";
import DashboardPage from "../../pages/Dashboard/DashboardPage";
import { RequireAuth } from "../../features/auth/guards";

export function RouterProvider() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<RequireAuth />}>
                    <Route path="/app" element={<DashboardPage />} />
                </Route>
                <Route path="*" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
}