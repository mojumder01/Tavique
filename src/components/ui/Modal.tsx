"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (still announced). */
  hideTitle?: boolean;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** `center` modal, or a drawer sliding in from the right/left. */
  placement?: "center" | "right" | "left";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

/**
 * Accessible dialog built on the native <dialog> element: focus is moved inside (to the element
 * marked `data-autofocus`, if any) and the page behind becomes inert while open, Escape closes,
 * and focus returns to the opener on close.
 */
export function Modal({ open, onClose, title, hideTitle, description, children, footer, placement = "center", size = "md", className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement;
      dialog.showModal();
      // showModal() focuses the first focusable element; honour an explicit target instead.
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onDialogClose = () => {
      document.documentElement.style.overflow = "";
      if (opener.current instanceof HTMLElement && opener.current.isConnected) opener.current.focus();
      onClose();
    };
    dialog.addEventListener("close", onDialogClose);
    return () => dialog.removeEventListener("close", onDialogClose);
  }, [onClose]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  const drawer = placement !== "center";
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className={cn(
        "bg-bg p-0 text-fg shadow-2xl backdrop:backdrop-blur-[2px]",
        drawer
          ? cn("drawer w-full max-w-[min(26rem,100vw)]", placement === "right" ? "mr-0 ml-auto [--drawer-from:100%]" : "mr-auto ml-0 [--drawer-from:-100%]")
          : cn("modal m-auto max-h-[min(90dvh,56rem)] w-[calc(100vw-2rem)] overflow-hidden rounded-card", widths[size]),
        className,
      )}
    >
      <div className={cn("flex min-h-0 flex-col", drawer ? "h-full" : "max-h-[inherit]")}>
        <div className={cn("flex items-start justify-between gap-4 border-b border-line px-5 py-4", hideTitle && "sr-only")}>
          <div>
            <h2 id={titleId} className="heading text-xl">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-sm text-fg-muted">
                {description}
              </p>
            )}
          </div>
          <button type="button" onClick={() => ref.current?.close()} className="-mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-muted" aria-label="Close">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        {hideTitle && (
          <button type="button" onClick={() => ref.current?.close()} className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-bg/80 hover:bg-muted" aria-label="Close">
            <X className="size-5" aria-hidden />
          </button>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </dialog>
  );
}
