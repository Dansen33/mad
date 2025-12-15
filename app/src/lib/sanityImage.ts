import type { ImageLoaderProps } from "next/image";

export function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  // Sanity CDN képeknél méretezést kérünk, egyébként hagyjuk érintetlenül.
  if (src.startsWith("https://cdn.sanity.io")) {
    const params = new URLSearchParams({
      w: String(width),
      auto: "format",
      q: String(quality || 80),
    });
    return `${src}?${params.toString()}`;
  }
  return src;
}
