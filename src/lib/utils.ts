import { clsx, type ClassValue } from "clsx";

/** Joins conditional class names. */
export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const COMBINING_MARKS = /[\u0300-\u036f]/g;
const DASHES = /[\u2010-\u2015]/g;

/** Lower-cases, strips accents ("Maré" → "mare") and unifies dash characters ("Wi‑Fi" → "wi-fi"). */
export const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(COMBINING_MARKS, "").replace(DASHES, "-");

let idCounter = 0;
/** Locally unique id for client-side records (not cryptographically random). */
export const localId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(++idCounter).toString(36)}`;

export const pluralize = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
