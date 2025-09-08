import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

export function RequireAuth() {
    const [status, setStatus] = useState<"loading" | "ok" | "nope">("loading");

    useEffect(() => {
        let alive = true;
        fetch("http://localhost:8080/auth/me", { credentials: "include" })
            .then(r => (r.ok ? r.json() : null))
            .then(user => { if (alive) setStatus(user ? "ok" : "nope"); })
            .catch(() => { if (alive) setStatus("nope"); });
        return () => { alive = false; };
    }, []);

    if (status === "loading") {
        return (
            <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return status === "ok" ? <Outlet /> : <Navigate to="/login" replace />;
}