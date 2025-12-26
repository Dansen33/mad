"use client";

import { create } from "zustand";

type CasePreviewState = {
  caseImages: Record<string, string | null>;
  setCaseImage: (slug: string, imageUrl: string | null) => void;
};

export const useCasePreviewStore = create<CasePreviewState>((set) => ({
  caseImages: {},
  setCaseImage: (slug, imageUrl) =>
    set((state) => ({
      caseImages: {
        ...state.caseImages,
        [slug]: imageUrl,
      },
    })),
}));
