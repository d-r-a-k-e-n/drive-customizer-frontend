import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["three"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_BL0B_HOSTNAME}`,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
