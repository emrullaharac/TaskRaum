import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export const registerSchema = z.object({
    name: z.string().min(2, "Min. 2 characters"),
    surname: z.string().min(2, "Min. 2 characters"),
    email: z.email("Enter a valid email"),
    password: z.string().regex(PASSWORD_RULE, "Min 8, 1 uppercase, 1 number"),
    confirmPassword: z.string(),
}).refine(v => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;