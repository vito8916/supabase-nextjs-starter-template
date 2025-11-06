export type UserStatus = "active" | "inactive" | "banned";
export type Profiles = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    status: UserStatus;
    email: string;
    phone: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    created_at: string;
    updated_at: string;
};

export type ProfileDTO = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    status: UserStatus;
    email: string;
    phone: string | null;
    created_at: string;
    updated_at: string;
};
