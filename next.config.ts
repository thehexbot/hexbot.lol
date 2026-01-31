import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // API routes won't work with static export - will add serverless later
};

export default nextConfig;
