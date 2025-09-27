import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Don’t fail the build on ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;