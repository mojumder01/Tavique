import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: { label: string; href: string };
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  titleClassName?: string;
  id?: string;
}

export function SectionHeading({ eyebrow, title, description, action, align = "left", as: Tag = "h2", className, titleClassName, id }: Props) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 md:mb-10", align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Tag id={id} className={cn("heading text-3xl md:text-[2.5rem]", titleClassName)}>
          {title}
        </Tag>
        {description && <div className="mt-3 text-[0.9375rem] leading-relaxed text-fg-muted">{description}</div>}
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline">
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
