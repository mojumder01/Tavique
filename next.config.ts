import type { NextConfig } from "next";

// STATIC_EXPORT=true builds plain HTML for static hosts such as GitHub Pages (see docs/DEPLOYMENT.md).
const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

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
    // No image optimiser on static hosts: serve the files as they are.
    ...(staticExport && { loader: "custom", loaderFile: "./src/lib/image-loader.ts" }),
  },
  ...(staticExport
    ? {
        output: "export",
        basePath,
        // /cart/ → cart/index.html, which every static host serves without rewrites
        trailingSlash: true,
      }
    : {
        // Static hosts can't send response headers; set them on the host instead.
        async headers() {
          return [{ source: "/(.*)", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
