import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nutri-trace-backend.bayufadayan.my.id",
        pathname: "/qrcodes/**",
      },
    ],
  },
};

export default nextConfig;
