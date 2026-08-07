import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["gsap", "motion", "@react-three/drei"],
  },
};

export default nextConfig;
