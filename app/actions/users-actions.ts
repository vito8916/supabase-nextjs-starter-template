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

/**
 * Fetch the current user's profile row from `profiles`.
 * Returns null if unauthenticated or on error.
 */
export const getCurrentUser = cache(async (): Promise<Profiles | null> => {
    const supabase = await createClient();

    // Ensure there is an authenticated session.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

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

    return data;
});
