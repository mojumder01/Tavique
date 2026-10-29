import { fontStacks } from "@/lib/fonts";
import type { Palette, StoreConfig } from "@/types/store";

const clean = (v: string) => v.replace(/[<>{};]/g, "");

const paletteVars = (p: Palette) =>
  [
    ["--c-bg", p.background],
    ["--c-surface", p.surface],
    ["--c-muted", p.muted],
    ["--c-fg", p.foreground],
    ["--c-fg-muted", p.foregroundMuted],
    ["--c-border", p.border],
    ["--c-primary", p.primary],
    ["--c-primary-fg", p.primaryForeground],
    ["--c-accent", p.accent],
    ["--c-accent-fg", p.accentForeground],
    ["--c-sale", p.sale],
    ["--c-success", p.success],
    ["--c-announce-bg", p.announcementBackground],
    ["--c-announce-fg", p.announcementForeground],
  ]
    .map(([k, v]) => `${k}:${clean(v ?? "")}`)
    .join(";");

/** Converts a storefront's theme config into scoped CSS variables. */
export function storeThemeCss(config: StoreConfig): string {
  const { id, theme } = config;
  const sel = `[data-store="${id}"]`;
  const base = [
    paletteVars(theme.light),
    `--f-display:${fontStacks[theme.fonts.display]}`,
    `--f-body:${fontStacks[theme.fonts.body]}`,
    `--f-mono:${fontStacks[theme.fonts.mono ?? "geistMono"]}`,
    `--r-card:${clean(theme.radius.card)}`,
    `--r-btn:${clean(theme.radius.button)}`,
    `--r-input:${clean(theme.radius.input)}`,
    `--btn-case:${theme.button.textTransform}`,
    `--btn-tracking:${clean(theme.button.letterSpacing)}`,
    `--btn-weight:${theme.button.fontWeight}`,
    `--btn-size:${theme.button.textTransform === "uppercase" ? "0.75rem" : "0.9375rem"}`,
    `--h-weight:${theme.heading.fontWeight}`,
    `--h-tracking:${clean(theme.heading.letterSpacing)}`,
    `--h-case:${theme.heading.textTransform ?? "none"}`,
    "color-scheme:light",
  ].join(";");
  let css = `${sel}{${base}}html:has(${sel}),html:has(${sel}) body{background-color:${clean(theme.light.background)}}`;
  if (theme.dark) {
    css += `:root[data-theme="dark"] ${sel}{${paletteVars(theme.dark)};color-scheme:dark}`;
    css += `:root[data-theme="dark"]:has(${sel}),:root[data-theme="dark"]:has(${sel}) body{background-color:${clean(theme.dark.background)}}`;
  }
  return css;
}

export function StoreTheme({ config }: { config: StoreConfig }) {
  return <style dangerouslySetInnerHTML={{ __html: storeThemeCss(config) }} />;
}
