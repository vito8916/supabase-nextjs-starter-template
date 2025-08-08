"use server";

import { createClient } from "@/lib/supabase/server";
import { forgotPasswordSchema, signInSchema, signUpSchema, updatePasswordSchema } from "@/lib/validations-schemas/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getAuthUser = cache(async () => {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user) return null;

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return user;
  });

export async function signUpAction(formData: FormData) {
    const supabase = await createClient();
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;

    const validatedFields = signUpSchema.safeParse({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { fullName, email, password } = validatedFields.data;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${origin}/dashboard`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { data };
}

export async function signInAction(formData: FormData) {
    const supabase = await createClient();

    const validatedFields = signInSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            error: "Invalid fields",
        };
    }

    const { email, password } = validatedFields.data;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return {
            error: error.message,
        };
    }

    return { data };
}

export async function signOutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function forgotPasswordAction(formData: FormData) {
    const supabase = await createClient();
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;

    const validatedFields = forgotPasswordSchema.safeParse({
        email: formData.get("email"),
    });

    if (!validatedFields.success) {
        return {
            error: "Invalid fields",
        };
    }

    const { email } = validatedFields.data;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/update-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return { data };
}

export async function updatePasswordAction(formData: FormData) {
    const supabase = await createClient();

    const validatedFields = updatePasswordSchema.safeParse({
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { password, confirmPassword } = validatedFields.data;

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    const { data, error } = await supabase.auth.updateUser({
        password: password as string,
    });

    if (error) {
        return { error: error.message };
    }

    return { data };
}
