"use client";

import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/catalog";

interface Props {
  images: ProductImage[];
  index: number;
  onIndexChange: (i: number) => void;
  aspect: string;
  title: string;
}

/** Main image with crossfade, thumbnails, arrow/keyboard navigation and click-to-zoom detail view. */
export function ProductGallery({ images, index, onIndexChange, aspect, title }: Props) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const current = images[index] ?? images[0];
  const go = (delta: number) => {
    setZoom(false);
    onIndexChange((index + delta + images.length) % images.length);
  };
  if (!current) return null;

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4" aria-roledescription="carousel" aria-label={`${title} images`}>
      {images.length > 1 && (
        <ul className="no-scrollbar flex gap-2 overflow-x-auto md:max-h-[44rem] md:w-20 md:flex-col md:overflow-y-auto">
          {images.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => (setZoom(false), onIndexChange(i))}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index ? "true" : undefined}
                className={cn("relative block w-16 overflow-hidden rounded-[calc(var(--r-card)/1.5)] bg-muted ring-offset-2 ring-offset-bg transition md:w-20", aspect, i === index ? "ring-2 ring-fg" : "opacity-70 hover:opacity-100")}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        className={cn("group relative flex-1 overflow-hidden rounded-card bg-muted", aspect)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div key={current.src} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <button
              type="button"
              aria-label={zoom ? "Zoom out" : "Zoom in to see detail"}
              aria-pressed={zoom}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
                setZoom((z) => !z);
              }}
              onMouseMove={(e) => {
                if (!zoom) return;
                const r = e.currentTarget.getBoundingClientRect();
                setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
              }}
              className={cn("absolute inset-0 block size-full", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                preload={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 ease-out"
                style={{ transform: zoom ? "scale(2)" : "none", transformOrigin: origin }}
              />
            </button>
          </motion.div>
        </AnimatePresence>

        <span className="pointer-events-none absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full bg-bg/85 text-fg shadow-sm" aria-hidden>
          {zoom ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
        </span>
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute top-1/2 left-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/90 text-fg shadow-sm transition-opacity hover:bg-bg md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute top-1/2 right-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/90 text-fg shadow-sm transition-opacity hover:bg-bg md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100">
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-bg/85 px-2.5 py-1 text-xs tabular-nums" aria-live="polite">
              {index + 1} / {images.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
