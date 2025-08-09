"use server";

import { createClient } from "@/lib/supabase/server";
import { passwordFormSchema, PasswordFormValues, ProfileFormValues, profileSchema } from "@/lib/validations-schemas/settings";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(values: ProfileFormValues) {
    const supabase = await createClient();
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "You must be logged in to update your profile" };
    }

    const parsed = profileSchema.safeParse(values);

    if (!parsed.success) {
        return { error: parsed.error.message };
    }

    const { error } = await supabase.auth.updateUser({
        data: {
            full_name: parsed.data.fullName,
            bio: parsed.data.bio,
        },
    });

    if (error) {
        return { error: error.message };
    }
    // Revalidate the path to update the UI
    revalidatePath("/settings");
    return { success: "Profile updated successfully" };
}

export async function updatePasswordAction(values: PasswordFormValues) {
    const supabase = await createClient();
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "You must be logged in to update your password" };
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
