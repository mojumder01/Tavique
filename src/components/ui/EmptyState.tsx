import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({ icon, title, body, children, className }: { icon?: ReactNode; title: string; body?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center", className)}>
      {icon && <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-muted text-fg-muted [&_svg]:size-6">{icon}</div>}
      <h2 className="heading text-2xl md:text-3xl">{title}</h2>
      {body && <div className="mt-3 text-[0.9375rem] leading-relaxed text-fg-muted">{body}</div>}
      {children && <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
