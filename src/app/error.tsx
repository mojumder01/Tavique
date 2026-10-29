"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Route-level error boundary. Keeps the message calm and offers a retry. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="page flex min-h-[70dvh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="heading mt-4 text-4xl md:text-5xl">We couldn&apos;t load this page</h1>
      <p className="mt-4 max-w-md text-[0.9375rem] text-fg-muted">Please try again. If the problem continues, return to the home page.</p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={reset} className="btn-type inline-flex h-11 items-center rounded-btn bg-primary px-6 text-primary-fg">
          Try again
        </button>
        <Link href="/" className="btn-type inline-flex h-11 items-center rounded-btn border border-fg/70 px-6">
          Home
        </Link>
      </div>
    </main>
  );
}
