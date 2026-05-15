import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "digenty-bucket.lon1.digitaloceanspaces.com",
      },
    ],
  },
};

export default nextConfig;
