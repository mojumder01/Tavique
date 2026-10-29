"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Scrolling strip of short messages. The motion can be paused (and stops for reduced-motion users). */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const [paused, setPaused] = useState(false);
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-10 px-5 text-xs tracking-[0.22em] whitespace-nowrap uppercase">
          {t}
          <span aria-hidden className="size-1 rounded-full bg-current opacity-50" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("relative flex items-center overflow-hidden border-y border-line py-4", className)}>
      <div className={cn("flex w-max animate-marquee", paused && "[animation-play-state:paused]")}>
        {row(false)}
        {row(true)}
      </div>
      <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play scrolling messages" : "Pause scrolling messages"} className="absolute right-2 inline-flex size-8 items-center justify-center rounded-full bg-bg/90 text-fg shadow-sm hover:bg-muted">
        {paused ? <Play className="size-3" aria-hidden /> : <Pause className="size-3" aria-hidden />}
      </button>
    </div>
  );
}
