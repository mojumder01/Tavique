import type { Category, ProductSummary } from "@/types/catalog";
import { normalize } from "./utils";

const STOP_WORDS = new Set(["the", "a", "an", "and", "for", "with", "of", "in"]);

/** Splits a query into normalised tokens, dropping simple plurals ("boots" → "boot"). */
export function tokenize(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9]+/)
    .filter((t) => t && !STOP_WORDS.has(t))
    .map((t) => (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t));
}

interface Field {
  words: string[];
  weight: number;
}

function fieldsFor(p: ProductSummary, categoryNames: Record<string, string>): Field[] {
  const words = (s: string) => normalize(s).split(/[^a-z0-9]+/).filter(Boolean);
  const optionLabels = p.variants.flatMap((g) => g.options.map((o) => o.label));
  return [
    { words: words(p.title), weight: 6 },
    { words: words(p.brand), weight: 4 },
    { words: p.categories.flatMap((c) => words(categoryNames[c] ?? c)), weight: 3 },
    { words: p.tags.flatMap(words), weight: 3 },
    { words: [...Object.values(p.attributes).flat(), ...optionLabels].flatMap(words), weight: 2 },
    { words: words(`${p.subtitle ?? ""} ${p.keySpecs.join(" ")}`), weight: 1 },
  ];
}

/** Scores how well one token matches a word list: exact > prefix > (long tokens only) substring. */
function tokenScore(token: string, words: string[]) {
  let best = 0;
  for (const w of words) {
    if (w === token || w === `${token}s`) return 1;
    if (w.startsWith(token)) best = Math.max(best, 0.8);
    else if (token.length >= 4 && w.includes(token)) best = Math.max(best, 0.5);
  }
  return best;
}

/**
 * Client-side product search. Every token must match at least one field; results are ranked by
 * weighted field matches with a small boost for popular products.
 */
export function searchProducts(query: string, items: ProductSummary[], categoryNames: Record<string, string> = {}): ProductSummary[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  const scored: { p: ProductSummary; score: number }[] = [];
  for (const p of items) {
    const fields = fieldsFor(p, categoryNames);
    let total = 0;
    let all = true;
    for (const t of tokens) {
      let best = 0;
      for (const f of fields) best = Math.max(best, tokenScore(t, f.words) * f.weight);
      if (best === 0) {
        all = false;
        break;
      }
      total += best;
    }
    if (all) scored.push({ p, score: total + Math.log10(p.reviewCount + 1) * 0.1 });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.p);
}

export interface Suggestions {
  products: ProductSummary[];
  categories: Category[];
  brands: string[];
}

export function suggest(query: string, items: ProductSummary[], categories: Category[], limit = 5): Suggestions {
  const tokens = tokenize(query);
  if (!tokens.length) return { products: [], categories: [], brands: [] };
  const names = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const products = searchProducts(query, items, names).slice(0, limit);
  const matchesAll = (s: string) => {
    const words = normalize(s).split(/[^a-z0-9]+/);
    return tokens.every((t) => tokenScore(t, words) > 0);
  };
  return {
    products,
    categories: categories.filter((c) => !c.rule && matchesAll(c.name)).slice(0, 3),
    brands: [...new Set(items.map((p) => p.brand))].filter(matchesAll).slice(0, 3),
  };
}
