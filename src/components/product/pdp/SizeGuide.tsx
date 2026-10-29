"use client";

import { Ruler } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

const apparel = {
  head: ["Size", "Chest (cm)", "Waist (cm)", "Hip (cm)", "US", "UK / EU"],
  rows: [
    ["XS", "82–86", "66–70", "88–92", "0–2 / 34", "6 / 34"],
    ["S", "87–92", "71–76", "93–98", "4–6 / 36", "8–10 / 36–38"],
    ["M", "93–99", "77–83", "99–104", "8–10 / 38–40", "12 / 40"],
    ["L", "100–106", "84–90", "105–110", "12–14 / 42", "14–16 / 42–44"],
    ["XL", "107–114", "91–98", "111–117", "16 / 44–46", "18 / 46"],
  ],
};
const footwear = {
  head: ["EU", "UK", "US (W)", "US (M)", "Foot length (cm)"],
  rows: [
    ["37", "4", "6.5", "—", "23.5"],
    ["38", "5", "7.5", "—", "24.2"],
    ["39", "6", "8.5", "6.5", "24.8"],
    ["40", "6.5", "9", "7", "25.5"],
    ["41", "7.5", "10", "8", "26.2"],
    ["42", "8", "10.5", "8.5", "26.8"],
    ["43", "9", "—", "9.5", "27.5"],
    ["44", "9.5", "—", "10", "28.2"],
    ["45", "10.5", "—", "11", "28.8"],
  ],
};

/** Size-guide button + dialog for apparel and footwear. Measurements are demo reference values. */
export function SizeGuide({ kind, fit }: { kind: "apparel" | "footwear"; fit?: string }) {
  const [open, setOpen] = useState(false);
  const table = kind === "apparel" ? apparel : footwear;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-xs underline underline-offset-4 hover:text-fg-muted" aria-haspopup="dialog">
        <Ruler className="size-3.5" aria-hidden /> Size guide
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Size guide" description={kind === "apparel" ? "Body measurements. If you're between sizes, size up for a relaxed fit." : "Measure your foot from heel to longest toe."} size="lg">
        <div className="space-y-5 p-5">
          {fit && <p className="rounded-card bg-muted p-3 text-sm">{fit}</p>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <caption className="sr-only">{kind === "apparel" ? "Apparel size chart" : "Footwear size chart"}</caption>
              <thead>
                <tr className="border-b border-line">
                  {table.head.map((h) => (
                    <th key={h} scope="col" className="py-2.5 pr-4 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r) => (
                  <tr key={r[0]} className="border-b border-line last:border-0">
                    {r.map((c, i) =>
                      i === 0 ? (
                        <th key={i} scope="row" className="py-2.5 pr-4 font-medium">
                          {c}
                        </th>
                      ) : (
                        <td key={i} className="py-2.5 pr-4 text-fg-muted tabular-nums">
                          {c}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-fg-muted">Reference chart for the demo store — replace with your own measurements.</p>
        </div>
      </Modal>
    </>
  );
}
