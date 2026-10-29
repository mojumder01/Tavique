"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * next/image with a graceful fallback: if a remote image fails to load, a neutral
 * placeholder with the alt text is shown instead of a broken-image icon.
 */
export function SmartImage({ className, alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span role="img" aria-label={alt} className={cn("absolute inset-0 flex items-center justify-center bg-muted p-4 text-center text-xs text-fg-muted", className)}>
        <svg aria-hidden viewBox="0 0 24 24" className="size-6 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 16l5-5 4 4 3-3 6 6" />
        </svg>
      </span>
    );
  }
  return <Image alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
