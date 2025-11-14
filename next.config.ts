import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    staleTimes: {
      dynamic: 30, // Re-fetch dynamic routes after 30 seconds
      static: 180, // Re-fetch statically generated pages or prefetched links after 180 seconds
    },
  },
};

export default nextConfig;
