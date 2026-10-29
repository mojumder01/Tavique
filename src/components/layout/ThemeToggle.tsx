"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const read = () => (typeof document === "undefined" ? "light" : document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const listeners = new Set<() => void>();

/** Light/dark toggle for storefronts that provide a dark palette. Choice is remembered locally. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    read,
    () => "light",
  );
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("tavique-theme", next);
        } catch {}
        listeners.forEach((l) => l());
      }}
      className="inline-flex size-10 items-center justify-center rounded-full text-fg hover:bg-muted"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === "dark" ? <Sun className="size-[1.15rem]" aria-hidden /> : <Moon className="size-[1.15rem]" aria-hidden />}
    </button>
  );
}
