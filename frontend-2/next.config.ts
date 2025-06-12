import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
      },
    ],
  },
  experimental: {
    scrollRestoration: false,
    serverComponentsExternalPackages: ["axios"], // Ensure this is false to reset scroll position
  },
};

export default nextConfig;
