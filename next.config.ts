import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "/tmp/next-dist",
  turbopack: {
    root: process.cwd(),
  },
  reactCompiler: true,
};

export default nextConfig;
