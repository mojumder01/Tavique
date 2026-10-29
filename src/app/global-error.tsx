"use client";

/** Last-resort boundary for errors in the root layout. Must render its own <html> and <body>. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100dvh", margin: 0, background: "#f6f4f1", color: "#1d1b19" }}>
        <main style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontWeight: 500 }}>Something went wrong</h1>
          <p style={{ color: "#67615a" }}>Please refresh the page or try again.</p>
          <button type="button" onClick={reset} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 999, border: 0, background: "#1d1b19", color: "#fff", cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
