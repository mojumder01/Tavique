"use client";

import Image from "next/image";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { BeautyHome } from "@/types/store";

type Article = BeautyHome["journal"][number];

/** Editorial tips. Articles open in an accessible dialog, so no extra routes are needed. */
export function JournalCards({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState<Article | null>(null);
  return (
    <>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {articles.map((a) => (
          <li key={a.id} className="reveal">
            <button type="button" onClick={() => setOpen(a)} className="group block w-full text-left" aria-haspopup="dialog">
              <span className="relative block aspect-[4/3] overflow-hidden rounded-card bg-muted">
                <Image src={a.image} alt={a.imageAlt} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </span>
              <span className="mt-4 block text-xs tracking-[0.16em] text-fg-muted uppercase">{a.readTime}</span>
              <span className="heading mt-2 block text-2xl group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{a.title}</span>
              <span className="mt-2 block text-sm leading-relaxed text-fg-muted">{a.excerpt}</span>
              <span className="mt-3 inline-block text-xs font-semibold tracking-[0.14em] uppercase">Read the tip</span>
            </button>
          </li>
        ))}
      </ul>
      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open?.title ?? ""} size="lg">
        {open && (
          <article>
            <div className="relative aspect-[16/8] bg-muted">
              <Image src={open.image} alt={open.imageAlt} fill sizes="672px" className="object-cover" />
            </div>
            <div className="space-y-4 px-6 py-6 text-[0.9375rem] leading-relaxed">
              <p className="text-xs tracking-[0.16em] text-fg-muted uppercase">{open.readTime}</p>
              {open.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </article>
        )}
      </Modal>
    </>
  );
}
