import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/layout/Providers";
import { siteConfig } from "@/config/site.config";
import { categories } from "@/data/categories";
import { productSummaries } from "@/data/products";
import { fontVariables } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — Fashion, Electronics & Beauty`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: { type: "website", siteName: siteConfig.name, images: [{ url: "/images/og/tavique.jpg", width: 1200, height: 630, alt: "Tavique storefronts" }] },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f12" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Providers products={productSummaries} categories={categories}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
