"use client";

import Image from "next/image";
import { useState } from "react";

type Img = { url: string; alt?: string | null };
type UpgradeOption = { label: string; deltaHuf: number };
type CaseOption = { label: string; deltaHuf: number; image?: string | null };

type Props = {
  images: Img[];
  pcSlug: string;
  pcName: string;
  basePrice: number;
  allowMemoryUpgrades?: boolean;
  memoryOptions?: UpgradeOption[];
  allowSsdUpgrades?: boolean;
  ssdOptions?: UpgradeOption[];
  allowWifiUpgrades?: boolean;
  wifiOptions?: UpgradeOption[];
  caseOptions?: CaseOption[];
  disabled?: boolean;
};

export function PcImageUpgrades({
  images,
  pcName,
}: Props) {
  const primaryImage = images[0] || { url: "", alt: pcName };
  const [mainImage, setMainImage] = useState<Img>(primaryImage);

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="relative w-full overflow-hidden rounded-2xl border border-border min-h-[710px]">
          {mainImage?.url ? (
            <Image
              fill
              src={mainImage.url}
              alt={mainImage.alt || pcName}
              className="object-contain bg-white"
              sizes="(min-width: 1024px) 50vw, 100vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Nincs kép</div>
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-3 gap-3">
            {images.slice(1).map((img) => (
              <button
                type="button"
                key={img.url}
                className="relative h-24 overflow-hidden rounded-xl border border-border bg-white"
                onClick={() => setMainImage(img)}
              >
                <Image fill src={img.url} alt={img.alt || pcName} className="object-contain" sizes="200px" unoptimized />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bővítő UI a jobb oldali oszlopban van */}
    </div>
  );
}
