import { Stack, TextField, Link } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../../features/auth/validation";
import { login } from "../../features/auth/api";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import AuthLayout from "../../features/auth/components/AuthLayout.tsx";
import FormErrorAlert from "../../features/auth/components/FormErrorAlert.tsx";
import PasswordField from "../../features/auth/components/PasswordField.tsx";
import axios from "axios";

function getApiMessage(err: unknown): string {
    if (axios.isAxiosError(err) && err.response?.data) {
        const d = err.response.data;
        return d.message || d.error || d.detail || "Login failed";
    }
    return err instanceof Error ? err.message : "Login failed";
}

export default function LoginPage() {
    const navigate = useNavigate();
    const fetchUser = useAuthStore(s => s.fetchUser);
    const [formError, setFormError] = useState<string | null>(null);

    const { control, handleSubmit, formState: { isSubmitting } } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginInput) => {
        setFormError(null);
        try {
            await login(data.email, data.password);
            await fetchUser();
            navigate("/app", { replace: true });
        } catch (e) {
            setFormError(getApiMessage(e));
        }
    };

    return (
        <AuthLayout title="Login" subtitle="Enter your credentials to continue.">
            <FormErrorAlert message={formError} />
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2}>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Email"
                                type="email"
                                autoComplete="email"
                                autoFocus
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                fullWidth
                            />
                        )}
                    />
                    <PasswordField<LoginInput>
                        control={control}
                        name="password"
                        autoComplete="current-password"
                    />
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Sign in
                    </LoadingButton>
                </Stack>
            </form>

            <Stack direction="row" spacing={1} mt={2} justifyContent="center">
                <span>No account?</span>
                <Link component={RouterLink} to="/register">Create one</Link>
            </Stack>
        </AuthLayout>
    );
}