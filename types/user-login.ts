
export type LoginStatus = "success" | "failed" | "blocked" | "suspicious";

export type DeviceInfo = {
    browser?: string;
    browserVersion?: string;
    os?: string;
    osVersion?: string;
    deviceType?: string;
    userAgent?: string;
};

export type LocationInfo = {
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
};

export type UserLogin = {
    id: string;
    user_id: string | null;
    user_name: string;
    email: string;
    ip_address: string;
    device_info: DeviceInfo;
    login_time: string;
    status: LoginStatus;
    failure_reason: string | null;
    session_id: string | null;
    location: LocationInfo | null;
    created_at: string;
    updated_at: string;
};

export type InsertUserLogin = Omit<
    UserLogin,
    "id" | "created_at" | "updated_at" | "login_time"
> & {
    login_time?: string;
};

export type LoginStats = {
    total_logins: number;
    successful_logins: number;
    failed_logins: number;
    unique_ips: number;
    last_login: string | null;
};

export type RecentLoginActivity = {
    id: string;
    user_id: string | null;
    email: string;
    ip_address: string;
    browser: string | null;
    os: string | null;
    country: string | null;
    city: string | null;
    login_time: string;
    status: LoginStatus;
    failure_reason: string | null;
};