import { z } from "zod";

/** General profile schema for settings page. */
export const profileSchema = z.object({
  fullName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters").trim().toLowerCase(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
});

/** Password update schema with strength and match checks. */
export const passwordFormSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordFormSchema>;