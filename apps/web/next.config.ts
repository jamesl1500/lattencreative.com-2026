import path from "node:path";
import dotenv from "dotenv";
import type { NextConfig } from "next";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
