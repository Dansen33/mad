/* eslint-disable @next/next/no-img-element */
// Barion Base Pixel (fraud prevention). Loads the official bp.js and initeli a pixel ID-t.
"use client";

import Script from "next/script";

export function BarionPixel({ pixelId }: { pixelId?: string }) {
  if (!pixelId) return null;

  const init = `
    window["bp"] = window["bp"] || function () {(window["bp"].q = window["bp"].q || []).push(arguments);};
    window["bp"].l = 1 * new Date();
    var scriptElement = document.createElement("script");
    var firstScript = document.getElementsByTagName("script")[0];
    scriptElement.async = true;
    scriptElement.src = "https://pixel.barion.com/bp.js";
    firstScript.parentNode.insertBefore(scriptElement, firstScript);
    window["barion_pixel_id"] = "${pixelId}";
    bp("init", "addBarionPixelId", window["barion_pixel_id"]);
  `;

  const noscriptUrl = `https://pixel.barion.com/a.gif?ba_pixel_id=${encodeURIComponent(
    pixelId,
  )}&ev=contentView&noscript=1`;

  return (
    <>
      <Script id="barion-base-pixel" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: init }} />
      <noscript>
        <img height="1" width="1" style={{ display: "none" }} alt="Barion Pixel" src={noscriptUrl} />
      </noscript>
    </>
  );
}
