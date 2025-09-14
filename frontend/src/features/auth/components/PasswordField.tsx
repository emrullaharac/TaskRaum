import { useState } from "react";
import { Controller } from "react-hook-form";
import type {Control, FieldValues, Path} from "react-hook-form";
import {
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    autoFocus?: boolean;
    autoComplete?: string;
};

export default function PasswordField<T extends FieldValues>({
                                                                 control, name, label = "Password", autoFocus, autoComplete,
                                                             }: Props<T>) {
    const [show, setShow] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    type={show ? "text" : "password"}
                    label={label}
                    autoFocus={!!autoFocus}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    slotProps={{
                        input: {
                            ...(autoComplete ? { autoComplete } : {}),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={show ? "Hide password" : "Show password"}
                                        onClick={() => setShow(s => !s)}
                                        edge="end"
                                    >
                                        {show ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            )}
        />
    );
}