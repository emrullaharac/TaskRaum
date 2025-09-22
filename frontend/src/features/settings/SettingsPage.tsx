import { useEffect, useMemo, useState } from "react";
import {
    Box, Typography, Card, CardContent, CardHeader, Stack, TextField, Button, Alert,
    Divider, Avatar, Snackbar, useMediaQuery
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { updateProfile, changePassword } from "./api.ts";
import PasswordField from "../auth/components/PasswordField";
import { PASSWORD_RULE } from "../auth/validation";

type ProfileInput = { name: string; surname: string };
const profileSchema = z.object({
    name: z.string().min(2, "Min. 2 characters"),
    surname: z.string().min(2, "Min. 2 characters"),
});

type PasswordInput = { currentPassword: string; newPassword: string; confirmNewPassword: string };
const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().regex(PASSWORD_RULE, "Min 8, 1 uppercase, 1 number"),
    confirmNewPassword: z.string(),
})
    .refine(v => v.newPassword === v.confirmNewPassword, {
        message: "Passwords do not match", path: ["confirmNewPassword"],
    })
    .refine(v => v.newPassword !== v.currentPassword, {
        message: "New password must be different from current password",
        path: ["newPassword"],
    });

export default function SettingsPage() {
    const { user, fetchUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const isDesktop = useMediaQuery("(min-width:900px)");

    const [msg, setMsg] = useState<string | null>(null);
    const [pwMsg, setPwMsg] = useState<string | null>(null);
    const [pwChanged, setPwChanged] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);

    const {
        control: controlProfile, handleSubmit: submitProfile,
        formState: { isSubmitting: sub1 }, reset: resetProfile,
    } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: "", surname: "" },
    });

    const {
        control: controlPw, handleSubmit: submitPw,
        formState: { isSubmitting: sub2 }, reset: resetPw,
    } = useForm<PasswordInput>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
    });

    useEffect(() => {
        if (user) resetProfile({ name: user.name ?? "", surname: user.surname ?? "" });
    }, [user, resetProfile]);

    const initials = useMemo(() => {
        const n = user?.name?.[0] ?? ""; const s = user?.surname?.[0] ?? "";
        return (n + s).toUpperCase() || "U";
    }, [user]);

    const onProfile = submitProfile(async (values) => {
        setMsg(null);
        await updateProfile(values);
        await fetchUser();
        setMsg("Profile updated.");
        setSnackOpen(true);
    });

    const onPassword = submitPw(async (values) => {
        setPwMsg(null);
        await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
        resetPw();
        setPwMsg("Password changed. Redirecting to login…");
        setPwChanged(true);
        setSnackOpen(true);
        setTimeout(async () => { await logout(); navigate("/login"); }, 1200);
    });

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={2}>Settings</Typography>

            <Snackbar
                open={snackOpen}
                autoHideDuration={2500}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                {(msg || pwMsg) ? (
                    <Alert severity="success" onClose={() => setSnackOpen(false)} sx={{ width: "100%" }}>
                        {pwChanged ? "Password changed. Redirecting to login…" : (pwMsg ?? msg)}
                    </Alert>
                ) : <></>}
            </Snackbar>

            <Box
                sx={{
                    display: "flex",
                    gap: { xs: 2, md: 3 },
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                }}
            >
                <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 300px" } }}>
                    <Box sx={isDesktop ? { position: "sticky", top: 24 } : undefined}>
                        <Card sx={{ maxWidth: { xs: "100%", md: 360 } }}>
                            <CardHeader
                                avatar={<Avatar sx={{ bgcolor: "primary.main" }}>{initials}</Avatar>}
                                title="Account Overview"
                                subheader="Your basic account details"
                            />
                            <Divider />
                            <CardContent>
                                <Stack gap={1.5}>
                                    <TextField
                                        label="Email"
                                        value={user?.email ?? ""}
                                        slotProps={{ input: { readOnly: true } }}
                                        helperText="For login only—contact support to change."
                                        fullWidth
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 0" }, minWidth: 0 }}>
                    <Stack gap={{ xs: 2, md: 3 }}>
                        <Card sx={{ maxWidth: { xs: "100%", lg: 640 }, mx: { xs: 0, lg: "auto" }, width: "100%" }}>
                            <CardHeader title="Profile" subheader="Update your personal details" />
                            <Divider />
                            <CardContent>
                                {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
                                <form onSubmit={onProfile} noValidate>
                                    <Stack gap={1.5} sx={{ maxWidth: { xs: "100%", lg: 560 } }}>
                                        <Controller
                                            control={controlProfile}
                                            name="name"
                                            render={({ field, fieldState }) => (
                                                <TextField {...field} label="Name" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                                            )}
                                        />
                                        <Controller
                                            control={controlProfile}
                                            name="surname"
                                            render={({ field, fieldState }) => (
                                                <TextField {...field} label="Surname" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                                            )}
                                        />
                                        <Box display="flex" justifyContent={{ xs: "stretch", md: "flex-end" }}>
                                            <Button variant="contained" type="submit" disabled={sub1} sx={{ width: { xs: 1, md: "auto" } }}>
                                                Save changes
                                            </Button>
                                        </Box>
                                    </Stack>
                                </form>
                            </CardContent>
                        </Card>

                        <Card sx={{ maxWidth: { xs: "100%", lg: 640 }, mx: { xs: 0, lg: "auto" }, width: "100%" }}>
                            <CardHeader title="Security" subheader="Change your password" />
                            <Divider />
                            <CardContent>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    Password must be at least 8 characters, include one uppercase letter and one number.
                                </Alert>
                                {pwMsg && <Alert severity={pwChanged ? "success" : "info"} sx={{ mb: 2 }}>{pwMsg}</Alert>}
                                <form onSubmit={onPassword} noValidate>
                                    <Stack gap={1.5} sx={{ maxWidth: { xs: "100%", lg: 560 } }}>
                                        <PasswordField<PasswordInput>
                                            control={controlPw} name="currentPassword" label="Current password" autoComplete="current-password" autoFocus
                                        />
                                        <PasswordField<PasswordInput>
                                            control={controlPw} name="newPassword" label="New password" autoComplete="new-password"
                                        />
                                        <PasswordField<PasswordInput>
                                            control={controlPw} name="confirmNewPassword" label="Confirm new password" autoComplete="new-password"
                                        />
                                        <Box display="flex" justifyContent={{ xs: "stretch", md: "flex-end" }}>
                                            <Button variant="contained" type="submit" disabled={sub2} sx={{ width: { xs: 1, md: "auto" } }}>
                                                Update password
                                            </Button>
                                        </Box>
                                    </Stack>
                                </form>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}
