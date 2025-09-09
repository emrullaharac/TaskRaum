import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import {me} from "./api";

export function RequireAuth() {
    const [status, setStatus] = useState<"loading" | "ok" | "nope">("loading");

    useEffect(() => {
        let alive = true;
        me().then((u)=> { if (alive) setStatus(u?"ok":"nope"); })
            .catch(()=> { if (alive) setStatus("nope") });
        return () => { alive = false; }
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