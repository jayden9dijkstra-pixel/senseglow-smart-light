import { describe, it, expect } from "vitest";
import { REVIEWS, reviewsFor, type Review } from "@/data/reviews";

describe("klantreviews", () => {
  it("het reviewbestand is leeg: geen voorbeeld- of nepreviews", () => {
    expect(REVIEWS).toHaveLength(0);
  });
  it("filtert reviews op product", () => {
    const r: Review = { name: "A B.", product: "x", date: "2026-11-01", stars: 5, text: "t", label: "Geverifieerde aankoop" };
    expect(reviewsFor("x", [r])).toHaveLength(1);
    expect(reviewsFor("y", [r])).toHaveLength(0);
  });
});
