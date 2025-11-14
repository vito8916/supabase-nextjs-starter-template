'use server'

import {passwordFormSchema, PasswordFormValues} from "@/lib/validations-schemas/settings";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";

export async function updatePasswordAction(values: PasswordFormValues) {
    const supabase = await createClient();
    // Get the current user
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
        throw new Error('User not authenticated');
    }

    const parsed = passwordFormSchema.safeParse(values);

    if (!parsed.success) {
        return { error: parsed.error.message };
    }

    const { error } = await supabase.auth.updateUser({
        password: parsed.data.newPassword,
    });

    if (error) {
        return { error: error.message };
    }

    // Revalidate the path to update the UI
    revalidatePath("/settings");
    return { success: "Password updated successfully" };
}