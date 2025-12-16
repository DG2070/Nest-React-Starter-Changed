import { z } from "zod";

export const UserSchema = z
  .object({
    id: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    PhoneNumber: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter (A-Z)"
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter (a-z)"
      )
      .regex(/\d/, "Password must contain at least one number (0-9)")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserFormType = z.infer<typeof UserSchema>;
