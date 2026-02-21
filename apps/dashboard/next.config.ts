import path from "node:path";
import dotenv from "dotenv";
import type { NextConfig } from "next";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
