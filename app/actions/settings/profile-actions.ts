'use server'

import {cache} from "react";
import {createClient} from "@/lib/supabase/server";
import {ProfileDTO} from "@/types/profile"
import {ProfileFormValues, profileSchema} from "@/lib/validations-schemas/settings";
import {revalidatePath} from "next/cache";

export const getUserProfile = cache(async (): Promise<ProfileDTO | null> => {
    const supabase = await createClient();

    // Ensure there is an authenticated session.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('User not authenticated');
    }

    // Query the profile row for the current user.
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        // Log and return null to avoid throwing inside server actions.
        console.error('Error fetching user:', error);
        return null;
    }

    return {
        id: data.id,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        bio: data.bio,
        status: data.status,
        email: data.email,
        phone: data.phone,
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
});

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

    // Update the profile row in the database
    const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({
            full_name: parsed.data.fullName,
            bio: parsed.data.bio,
        })
        .eq("id", user.id)
        .select("*")
        .single();

    if (updateError) {
        return { error: updateError.message };
    }

    // Update the user's auth metadata' (full_name) to sync with Profile
    const { error: authErr } = await supabase.auth.updateUser({
        data: { full_name: updatedProfile.full_name ?? "" },
    });

    if (authErr) {
        return { error: authErr.message };
    }
    // Revalidate the path to update the UI
    revalidatePath("/settings");
    return { success: "Profile updated successfully" };
}