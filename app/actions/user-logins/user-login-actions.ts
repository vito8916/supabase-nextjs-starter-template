"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import {
    type InsertUserLogin,
    type UserLogin,
    type LoginStats,
    type RecentLoginActivity,
    type LoginStatus,
    type DeviceInfo,
    type LocationInfo,
} from "@/types/user-login";
import {
    parseUserAgent,
    getClientIp,
    getLocationFromIp,
} from "@/lib/user-login-utils";

type ActionResponse<T = void> = {
    success: boolean;
    data?: T;
    error?: string;
};

/**
 * Log a user login attempt
 */
export async function logUserLogin(
    userId: string | null,
    userName: string,
    email: string,
    status: LoginStatus,
    failureReason?: string | null,
    sessionId?: string | null
): Promise<ActionResponse<UserLogin>> {
    try {
        const supabase = await createClient();
        const headersList = await headers();

        // Get device info from user agent
        const userAgent = headersList.get("user-agent") || "Unknown";
        const deviceInfo: DeviceInfo = parseUserAgent(userAgent);

        // Get IP address
        const ipAddress = getClientIp(headersList);

        // Optionally get location (you may want to do this in background/queue)
        let location: LocationInfo | null = null;
        if (ipAddress !== "0.0.0.0") {
            location = await getLocationFromIp(ipAddress);
        }

        // Insert login record
        const loginData: InsertUserLogin = {
            user_id: userId,
            user_name: userName,
            email,
            ip_address: ipAddress,
            device_info: deviceInfo,
            status,
            failure_reason: failureReason || null,
            session_id: sessionId || null,
            location,
        };

        const { data, error } = await supabase
            .from("user_logins")
            .insert(loginData)
            .select()
            .single();

        if (error) {
            console.error("Failed to log user login:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error in logUserLogin:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get user's login history with pagination
 */
export async function getUserLoginHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
): Promise<ActionResponse<{ logins: UserLogin[]; total: number }>> {
    try {
        const supabase = await createClient();

        // Check if the requesting user is authorized
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user || user.id !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        const offset = (page - 1) * limit;

        // Get total count
        const { count, error: countError } = await supabase
            .from("user_logins")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);

        if (countError) {
            return { success: false, error: countError.message };
        }

        // Get paginated data
        const { data, error } = await supabase
            .from("user_logins")
            .select("*")
            .eq("user_id", userId)
            .order("login_time", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            return { success: false, error: error.message };
        }

        return {
            success: true,
            data: { logins: data || [], total: count || 0 },
        };
    } catch (error) {
        console.error("Error in getUserLoginHistory:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get recent login activity (last N logins)
 */
export async function getRecentLoginActivity(
    userId: string,
    limit: number = 10
): Promise<ActionResponse<RecentLoginActivity[]>> {
    try {
        const supabase = await createClient();

        // Check if the requesting user is authorized
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user || user.id !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        const { data, error } = await supabase
            .from("recent_login_activity")
            .select("*")
            .eq("user_id", userId)
            .limit(limit);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        console.error("Error in getRecentLoginActivity:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get login statistics for a user
 */
export async function getUserLoginStats(
    userId: string,
    daysBack: number = 30
): Promise<ActionResponse<LoginStats>> {
    try {
        const supabase = await createClient();

        // Check if the requesting user is authorized
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user || user.id !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        const { data, error } = await supabase.rpc("get_login_stats", {
            p_user_id: userId,
            days_back: daysBack,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data[0] };
    } catch (error) {
        console.error("Error in getUserLoginStats:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get failed login attempts for a user (security monitoring)
 */
export async function getFailedLoginAttempts(
    userId: string,
    hoursBack: number = 24
): Promise<ActionResponse<UserLogin[]>> {
    try {
        const supabase = await createClient();

        // Check if the requesting user is authorized
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user || user.id !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - hoursBack);

        const { data, error } = await supabase
            .from("user_logins")
            .select("*")
            .eq("user_id", userId)
            .in("status", ["failed", "blocked", "suspicious"])
            .gte("login_time", cutoffTime.toISOString())
            .order("login_time", { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        console.error("Error in getFailedLoginAttempts:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get unique devices used by a user
 */
export async function getUserDevices(
    userId: string
): Promise<ActionResponse<Array<{ device_info: DeviceInfo; last_used: string; login_count: number }>>> {
    try {
        const supabase = await createClient();

        // Check if the requesting user is authorized
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user || user.id !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        const { data, error } = await supabase
            .from("user_logins")
            .select("device_info, login_time")
            .eq("user_id", userId)
            .eq("status", "success")
            .order("login_time", { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        // Group by device (browser + os combination)
        const deviceMap = new Map<string, { device_info: DeviceInfo; last_used: string; login_count: number }>();

        data?.forEach((login) => {
            const deviceKey = `${login.device_info.browser}-${login.device_info.os}`;
            const existing = deviceMap.get(deviceKey);

            if (!existing) {
                deviceMap.set(deviceKey, {
                    device_info: login.device_info,
                    last_used: login.login_time,
                    login_count: 1,
                });
            } else {
                existing.login_count++;
                if (new Date(login.login_time) > new Date(existing.last_used)) {
                    existing.last_used = login.login_time;
                }
            }
        });

        return { success: true, data: Array.from(deviceMap.values()) };
    } catch (error) {
        console.error("Error in getUserDevices:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Check for suspicious login activity (e.g., multiple IPs in short time)
 */
export async function checkSuspiciousActivity(
    userId: string,
    hoursBack: number = 1
): Promise<ActionResponse<{ isSuspicious: boolean; reason?: string; recentIps: string[] }>> {
    try {
        const supabase = await createClient();

        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - hoursBack);

        const { data, error } = await supabase
            .from("user_logins")
            .select("ip_address, location")
            .eq("user_id", userId)
            .eq("status", "success")
            .gte("login_time", cutoffTime.toISOString());

        if (error) {
            return { success: false, error: error.message };
        }

        const uniqueIps = new Set(data?.map((login) => login.ip_address) || []);
        const uniqueCountries = new Set(
            data?.map((login) => (login.location as LocationInfo)?.country).filter(Boolean) || []
        );

        // Flag as suspicious if:
        // - More than 3 different IPs in the last hour
        // - More than 2 different countries in the last hour
        const isSuspicious = uniqueIps.size > 3 || uniqueCountries.size > 2;
        const reason = isSuspicious
            ? `Multiple IPs (${uniqueIps.size}) or countries (${uniqueCountries.size}) detected`
            : undefined;

        return {
            success: true,
            data: {
                isSuspicious,
                reason,
                recentIps: Array.from(uniqueIps),
            },
        };
    } catch (error) {
        console.error("Error in checkSuspiciousActivity:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}