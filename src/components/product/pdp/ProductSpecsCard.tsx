import type { SpecGroup } from "@/types/catalog";

/** Specification groups laid out as a two-column card. */
export function ProductSpecsCard({ groups, title = "Specifications" }: { groups: SpecGroup[]; title?: string }) {
  return (
    <section aria-labelledby="specs-title" className="rounded-card border border-line bg-surface p-6 md:p-8">
      <h2 id="specs-title" className="heading text-2xl md:text-3xl">
        {title}
      </h2>
      <div className="mt-6 grid gap-x-10 gap-y-7 md:grid-cols-2">
        {groups.map((g) => (
          <table key={g.title} className="w-full self-start text-left text-sm">
            <caption className="mb-2 text-left text-xs font-semibold tracking-[0.12em] uppercase">{g.title}</caption>
            <tbody>
              {g.items.map((i) => (
                <tr key={i.label} className="border-b border-line last:border-0">
                  <th scope="row" className="w-2/5 py-2 pr-4 align-top font-normal text-fg-muted">
                    {i.label}
                  </th>
                  <td className="py-2">{i.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </section>
  );
}
