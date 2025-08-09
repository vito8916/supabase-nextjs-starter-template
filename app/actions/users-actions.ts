"use server";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type UserStatus = "active" | "inactive" | "banned";

export type Profiles = {
    id: string;
    full_name: string | null;
    avatar_url: string  | undefined;
    bio: string | null;
    status: UserStatus,
    email: string;
    created_at: string;
    updated_at: string;
    phone: string | null;
    stripe_customer_id: string | null
    stripe_subscription_id: string | null
};

export const getCurrentUser = cache(async (): Promise<Profiles | null> => {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    return data;
});

export async function updateUserProfilePictureUrl(userId: string, profilePicture: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from("profiles").update({
        avatar_url: profilePicture,
    }).eq("id", userId).select().single();

    if (error) {
        return { error: error, data: null };
    }

    return { error: null, data: data };
    
}