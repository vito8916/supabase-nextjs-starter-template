'use server'

import {cache} from "react";
import {createClient} from "@/lib/supabase/server";
import {ProfileDTO} from "@/types/profile"
import {ProfileFormValues, profileSchema} from "@/lib/validations-schemas/settings";
import {revalidatePath} from "next/cache";

export const getUserProfile = cache(async (): Promise<ProfileDTO | null> => {
    const supabase = await createClient();

    // Ensure there is an authenticated session.
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Query the profile row for the current user.
    const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.sub)
        .single();

    if (error) {
        throw new Error(`Error fetching user profile: ${error.message}`);
    }

    return {
        id: profileData.id,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        bio: profileData.bio,
        status: profileData.status,
        email: profileData.email,
        phone: profileData.phone,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
    };
});

export async function updateProfileAction(values: ProfileFormValues) {
    const supabase = await createClient();
    // Get the current user
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
        throw new Error('User not authenticated');
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
        .eq("id", user.sub)
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