import { clsx, type ClassValue } from "clsx";

/** Joins conditional class names. */
export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const COMBINING_MARKS = /[̀-ͯ]/g;
const DASHES = /[‐-―]/g;

/** Lower-cases, strips accents ("Maré" → "mare") and unifies dash characters ("Wi‑Fi" → "wi-fi"). */
export const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(COMBINING_MARKS, "").replace(DASHES, "-");

export const pluralize = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
