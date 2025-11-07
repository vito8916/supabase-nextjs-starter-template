import { DeviceInfo } from "@/types/user-login";

/**
 * Parse user agent string to extract device information
 */
export function parseUserAgent(userAgent: string): DeviceInfo {
    const deviceInfo: DeviceInfo = {
        userAgent,
    };

    // Detect browser
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
        deviceInfo.browser = "Chrome";
        const match = userAgent.match(/Chrome\/(\d+)/);
        if (match) deviceInfo.browserVersion = match[1];
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
        deviceInfo.browser = "Safari";
        const match = userAgent.match(/Version\/(\d+)/);
        if (match) deviceInfo.browserVersion = match[1];
    } else if (userAgent.includes("Firefox")) {
        deviceInfo.browser = "Firefox";
        const match = userAgent.match(/Firefox\/(\d+)/);
        if (match) deviceInfo.browserVersion = match[1];
    } else if (userAgent.includes("Edg")) {
        deviceInfo.browser = "Edge";
        const match = userAgent.match(/Edg\/(\d+)/);
        if (match) deviceInfo.browserVersion = match[1];
    } else {
        deviceInfo.browser = "Unknown";
    }

    // Detect OS
    if (userAgent.includes("Windows")) {
        deviceInfo.os = "Windows";
        if (userAgent.includes("Windows NT 10.0")) deviceInfo.osVersion = "10";
        else if (userAgent.includes("Windows NT 6.3")) deviceInfo.osVersion = "8.1";
        else if (userAgent.includes("Windows NT 6.2")) deviceInfo.osVersion = "8";
    } else if (userAgent.includes("Mac OS X")) {
        deviceInfo.os = "macOS";
        const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
        if (match) deviceInfo.osVersion = match[1].replace("_", ".");
    } else if (userAgent.includes("Linux")) {
        deviceInfo.os = "Linux";
    } else if (userAgent.includes("Android")) {
        deviceInfo.os = "Android";
        const match = userAgent.match(/Android (\d+)/);
        if (match) deviceInfo.osVersion = match[1];
    } else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        deviceInfo.os = "iOS";
        const match = userAgent.match(/OS (\d+[._]\d+)/);
        if (match) deviceInfo.osVersion = match[1].replace("_", ".");
    } else {
        deviceInfo.os = "Unknown";
    }

    // Detect device type
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        deviceInfo.deviceType = "tablet";
    } else if (
        /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            userAgent
        )
    ) {
        deviceInfo.deviceType = "mobile";
    } else {
        deviceInfo.deviceType = "desktop";
    }

    return deviceInfo;
}

/**
 * Get client IP address from request headers
 * Checks common headers used by proxies and CDNs
 */
export function getClientIp(headers: Headers): string {
    // Check common headers in order of preference
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    const realIp = headers.get("x-real-ip");
    if (realIp) {
        return realIp;
    }

    const cfConnectingIp = headers.get("cf-connecting-ip"); // Cloudflare
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // Fallback
    return "0.0.0.0";
}

/**
 * Optional: Fetch geolocation data from IP address
 * You can use services like ipapi.co, ip-api.com, or MaxMind
 */
export async function getLocationFromIp(ip: string) {
    try {
        // Example using ip-api.com (free, no API key needed, but rate limited)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,lat,lon,timezone`);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.status === "success") {
            return {
                country: data.country,
                countryCode: data.countryCode,
                region: data.region,
                city: data.city,
                latitude: data.lat,
                longitude: data.lon,
                timezone: data.timezone,
            };
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch location data:", error);
        return null;
    }
}