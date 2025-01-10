import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["res.cloudinary.com"], // Add Cloudinary domain here
  },
  staticPageGenerationTimeout: 1200,
};

export default nextConfig;
