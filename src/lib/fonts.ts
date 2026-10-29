import { Bodoni_Moda, Figtree, Geist, Geist_Mono, Jost, Newsreader } from "next/font/google";
import type { FontKey } from "@/types/store";

// Fonts are self-hosted by next/font at build time (no runtime requests to Google).
// Only the two or three families a page actually uses are downloaded by the browser.
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "swap", preload: false, style: ["normal", "italic"] });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap", preload: false });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap", preload: false, style: ["normal", "italic"] });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap", preload: false });

export const fontVariables = [bodoni, jost, geist, geistMono, newsreader, figtree].map((f) => f.variable).join(" ");

/** CSS font stacks, with sensible system fallbacks, for each configurable font key. */
export const fontStacks: Record<FontKey, string> = {
  bodoni: 'var(--font-bodoni), "Bodoni 72", Didot, Georgia, serif',
  jost: "var(--font-jost), Futura, ui-sans-serif, system-ui, sans-serif",
  geist: "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
  geistMono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
  newsreader: "var(--font-newsreader), Georgia, serif",
  figtree: "var(--font-figtree), ui-sans-serif, system-ui, sans-serif",
};
