import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types/store";

interface Props {
  eyebrow?: string;
  title: string;
  body?: string;
  image: string;
  imageAlt: string;
  cta?: NavLink;
  secondaryCta?: NavLink;
  /** Text colour over the image. */
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  imageClassName?: string;
  preload?: boolean;
  as?: "h1" | "h2";
}

/** Full-bleed image banner with overlaid copy. Used for campaigns and promotions. */
export function HeroBanner({ eyebrow, title, body, image, imageAlt, cta, secondaryCta, tone = "light", align = "left", className, imageClassName, preload, as: Tag = "h2" }: Props) {
  const light = tone === "light";
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      <Image src={image} alt={imageAlt} fill preload={preload} sizes="100vw" className={cn("-z-10 object-cover", imageClassName)} />
      <div className={cn("absolute inset-0 -z-10", light ? "bg-gradient-to-r from-black/65 via-black/30 to-transparent" : "bg-gradient-to-r from-white/80 via-white/40 to-transparent")} aria-hidden />
      <div className={cn("page flex h-full flex-col justify-center py-16", align === "center" && "items-center text-center")}>
        <div className={cn("max-w-xl", light ? "text-white" : "text-fg")}>
          {eyebrow && <p className={cn("eyebrow mb-4", light && "text-white/80")}>{eyebrow}</p>}
          <Tag className="heading text-4xl md:text-6xl">{title}</Tag>
          {body && <p className={cn("mt-4 max-w-md text-base leading-relaxed", light ? "text-white/85" : "text-fg-muted")}>{body}</p>}
          {(cta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {cta && (
                <ButtonLink href={cta.href} variant={light ? "inverse" : "primary"}>
                  {cta.label}
                </ButtonLink>
              )}
              {secondaryCta && (
                <ButtonLink href={secondaryCta.href} variant="outline" className={light ? "border-white/70 text-white hover:bg-white hover:text-black" : ""}>
                  {secondaryCta.label}
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
