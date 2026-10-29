/**
 * Image loader for the static export (GitHub Pages has no image optimiser).
 * Serves the file as-is and adds the base path to local images.
 */
export default function staticImageLoader({ src, width }: { src: string; width: number }): string {
  if (!src.startsWith("/")) return src;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}?w=${width}`;
}
