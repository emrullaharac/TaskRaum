import { Stack, TextField, Link, Alert, FormControlLabel, Checkbox, FormHelperText } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "../../features/auth/validation";
import { register as apiRegister } from "../../features/auth/api";
import { useState } from "react";
import AuthLayout from "../../features/auth/components/AuthLayout.tsx";
import FormErrorAlert from "../../features/auth/components/FormErrorAlert.tsx";
import PasswordField from "../../features/auth/components/PasswordField.tsx";
import axios from "axios";

function getApiMessage(err: unknown): string {
    if (axios.isAxiosError(err) && err.response?.data) {
        const d = err.response.data;
        return d.message || d.error || d.detail || "Registration failed";
    }
    return err instanceof Error ? err.message : "Registration failed";
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState<string | null>(null);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const [showPrivacyError, setShowPrivacyError] = useState(false);

    const { control, handleSubmit, formState: { isSubmitting } } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterInput) => {
        setFormError(null);
        setShowPrivacyError(false);

        if (!acceptPrivacy) {
            setShowPrivacyError(true);
            return;
        }

        try {
            await apiRegister(data.name, data.surname, data.email, data.password);
            navigate("/login", { replace: true });
        } catch (e) {
            setFormError(getApiMessage(e));
        }
    };

    return (
        <AuthLayout title="Create account" subtitle="It’s quick and easy.">
            <FormErrorAlert message={formError} />

            <Alert severity="warning" sx={{ mb: 2 }}>
                This is a demo project. Please avoid using real personal data. See our{" "}
                <Link component={RouterLink} to="/privacy">Privacy Notice</Link>.
            </Alert>

            <Alert severity="info" sx={{ mb: 2 }}>
                Password must be at least 8 characters, include one uppercase letter and one number.
            </Alert>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Name"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="surname"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Surname"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Email"
                                type="email"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                fullWidth
                            />
                        )}
                    />

                    <PasswordField<RegisterInput> control={control} name="password" label="Password" />
                    <PasswordField<RegisterInput> control={control} name="confirmPassword" label="Confirm password" />

                    <div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={acceptPrivacy}
                                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                                />
                            }
                            label={
                                <>
                                    I have read and agree to the{" "}
                                    <Link component={RouterLink} to="/privacy">Privacy Notice</Link>.
                                </>
                            }
                        />
                        {showPrivacyError && !acceptPrivacy && (
                            <FormHelperText error>
                                You must agree to the Privacy Notice to continue.
                            </FormHelperText>
                        )}
                    </div>

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        disabled={!acceptPrivacy}
                    >
                        Create account
                    </LoadingButton>
                </Stack>
            </form>

            <Stack direction="row" spacing={1} mt={2} justifyContent="center">
                <span>Already have an account?</span>
                <Link component={RouterLink} to="/login">Sign in</Link>
            </Stack>
        </AuthLayout>
    );
}
