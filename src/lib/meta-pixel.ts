// Meta Pixel for the POS AVC landing page.
// A single initializer prevents duplicate events during React remounts.
export const META_PIXEL_ID = "1605812854080541";

type PixelCommand = (...args: unknown[]) => void;
declare global {
  interface Window {
    fbq?: PixelCommand & { loaded?: boolean; queue?: unknown[][]; push?: PixelCommand; callMethod?: PixelCommand };
    _fbq?: PixelCommand;
    __posAvcPixelInitialized?: boolean;
    __posAvcLandingTracked?: boolean;
  }
}

export function initializeMetaPixel() {
  if (typeof window === "undefined") return;
  if (window.__posAvcPixelInitialized) return;
  window.__posAvcPixelInitialized = true;

  if (!window.fbq) {
    const pixel: NonNullable<Window["fbq"]> = function (...args: unknown[]) {
      if (pixel.callMethod) pixel.callMethod(...args);
      else (pixel.queue ??= []).push(args);
    };
    pixel.queue = [];
    pixel.loaded = true;
    window.fbq = pixel;
    window._fbq = pixel;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.id = "posavc-meta-pixel";
    document.head.appendChild(script);
  }

  window.fbq("init", META_PIXEL_ID);
  if (!window.__posAvcLandingTracked) {
    window.__posAvcLandingTracked = true;
    window.fbq("track", "PageView");
    window.fbq("track", "ViewContent", {
      content_name: "Kit Comunicação Pós-AVC",
      content_type: "product",
      content_ids: ["kit-comunicacao-pos-avc"],
      currency: "BRL",
      value: 17.90,
    });
  }
}

export function trackInitiateCheckout() {
  if (typeof window === "undefined") return;
  initializeMetaPixel();
  window.fbq?.("track", "InitiateCheckout", {
    content_name: "Kit Comunicação Pós-AVC",
    content_type: "product",
    content_ids: ["kit-comunicacao-pos-avc"],
    currency: "BRL",
    value: 17.90,
    num_items: 1,
  });
}
