import { describe, it, expect } from "vitest";
import { pickDefaultVariant } from "./defaultVariant";
import type { ShopifyProduct } from "./shopify";

const v = (title: string, opts: string[], image?: string) => ({
  node: {
    id: title, title, availableForSale: true,
    price: { amount: "10", currencyCode: "EUR" },
    image: image ? { url: image, altText: null } : null,
    selectedOptions: opts.map((value, i) => ({ name: `o${i}`, value })),
  },
});
const product = (handle: string, variants: ReturnType<typeof v>[], featured = "f.png"): ShopifyProduct => ({
  node: {
    id: handle, title: handle, description: "", handle,
    priceRange: { minVariantPrice: { amount: "10", currencyCode: "EUR" } },
    featuredImage: { url: featured, altText: null },
    images: { edges: [{ node: { url: featured, altText: null } }] },
    variants: { edges: variants },
    options: [],
  },
} as unknown as ShopifyProduct);

describe("pickDefaultVariant", () => {
  it("Solar Lantern kiest Zwart, de kleur op foto 1", () => {
    const p = product("senseglow_solar_lantern", [v("Wit", ["Wit"]), v("Zwart", ["Zwart"])]);
    expect(pickDefaultVariant(p)?.title).toBe("Zwart");
  });
  it("Ambient kiest Zwart 30 cm in plaats van Zilver 30 cm", () => {
    const p = product("senseglow_ambient_motion_bar", [
      v("Zilver 20", ["Zilver 20 cm"]), v("Zilver 30", ["Zilver 30 cm"]), v("Zwart 30", ["Zwart 30 cm"]),
    ]);
    expect(pickDefaultVariant(p)?.title).toBe("Zwart 30");
  });
  it("een eigen variantfoto die gelijk is aan foto 1 gaat voor", () => {
    const p = product("senseglow_flex", [v("Wit", ["Wit"], "w.png"), v("Zwart", ["Zwart"], "f.png")]);
    expect(pickDefaultVariant(p)?.title).toBe("Zwart");
  });
});
