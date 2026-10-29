import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Next 16.4+ writes an AGENTS.md during `next dev`; not needed in the distributed template.
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    // Add the hosts of your own product photography here (e.g. your CDN or Shopify/Cloudinary).
    // Demo artwork ships locally in /public/images, so no remote hosts are required.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
