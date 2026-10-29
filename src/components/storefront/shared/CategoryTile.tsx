import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  name: string;
  image: string;
  meta?: string;
  aspect?: string;
  variant?: "below" | "overlay" | "arch";
  sizes?: string;
  className?: string;
}

export function CategoryTile({ href, name, image, meta, aspect = "aspect-[3/4]", variant = "below", sizes = "(min-width: 1024px) 16vw, 45vw", className }: Props) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <span className={cn("relative block overflow-hidden bg-muted", aspect, variant === "arch" ? "rounded-t-full rounded-b-card" : "rounded-card")}>
        <Image src={image} alt="" fill sizes={sizes} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        {variant === "overlay" && (
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent p-4 text-white">
            <span className="heading text-xl">{name}</span>
            <ArrowUpRight className="size-5" aria-hidden />
          </span>
        )}
      </span>
      {variant !== "overlay" && (
        <span className={cn("mt-3 flex items-center justify-between gap-2", variant === "arch" && "justify-center")}>
          <span className={cn(variant === "arch" ? "text-xs font-medium tracking-[0.16em] uppercase" : "text-[0.9375rem]")}>{name}</span>
          {meta && <span className="text-xs text-fg-muted">{meta}</span>}
          {variant === "below" && <ArrowUpRight className="size-4 text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />}
        </span>
      )}
    </Link>
  );
}
