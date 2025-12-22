"use client";

import { useEffect } from "react";
import { sendFacebookEvent } from "@/lib/client/fb-events";

type Props = {
  value?: number;
  currency?: string;
};

export function ViewContentTracker({ value, currency = "HUF" }: Props) {
  useEffect(() => {
    sendFacebookEvent({
      eventName: "ViewContent",
      value,
      currency,
    });
  }, [value, currency]);

  return null;
}
