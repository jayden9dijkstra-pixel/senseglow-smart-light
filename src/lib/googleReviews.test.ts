import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GoogleHomeReview, GoogleReviewLine } from "@/components/GoogleBrandReview";
import { ReviewSummary } from "@/components/product/ProductReviewsSection";
import { GOOGLE_REVIEW, googleRatingLabel, googleReviewAttribution, googleReviewText } from "./googleReviews";
import { breadcrumbSchema, organizationSchema, productSchema } from "./structuredData";
import type { ShopifyProduct } from "./shopify";

describe("Google-merkreview", () => {
  it("gebruikt overal de score mét het echte aantal reviews", () => {
    expect(GOOGLE_REVIEW).toMatchObject({ source: "Google", rating: 5, count: 1 });
    expect(GOOGLE_REVIEW).not.toHaveProperty("name");
    expect(googleRatingLabel()).toBe("5,0 op Google (1 review)");
    expect(renderToStaticMarkup(createElement(GoogleReviewLine))).toContain("5,0 op Google (1 review)");
    expect(renderToStaticMarkup(createElement(ReviewSummary))).toContain("5,0 op Google (1 review)");
    expect(renderToStaticMarkup(createElement(GoogleHomeReview))).toContain("1 review");
  });

  it("toont alleen de anonieme ondertekening in het Nederlands en Engels", () => {
    expect(googleReviewAttribution("nl")).toBe("— een klant, via Google");
    expect(googleReviewAttribution("en")).toBe("— a customer, via Google");
    expect(renderToStaticMarkup(createElement(GoogleHomeReview))).toContain("— een klant, via Google");
  });

  it("gebruikt de Engelse originele tekst op /en en de Nederlandse vertaling op /", () => {
    expect(googleReviewText("nl")).toBe(GOOGLE_REVIEW.textNl);
    expect(googleReviewText("en")).toBe(GOOGLE_REVIEW.textEn);
  });

  it("zet geen Review of aggregateRating in de JSON-LD", () => {
    const product = {
      node: {
        id: "gid://shopify/Product/1",
        title: "Testproduct",
        description: "",
        handle: "testproduct",
        priceRange: { minVariantPrice: { amount: "39.95", currencyCode: "EUR" } },
        images: { edges: [] },
        variants: { edges: [{ node: {
          id: "gid://shopify/ProductVariant/1",
          title: "Standaard",
          price: { amount: "39.95", currencyCode: "EUR" },
          availableForSale: true,
          selectedOptions: [],
        } }] },
        options: [],
      },
    } satisfies ShopifyProduct;
    const schemas = [
      organizationSchema(),
      breadcrumbSchema([{ name: "Home", path: "/" }]),
      productSchema(product, { path: "/product/testproduct", description: "Testproduct" }),
    ];
    const json = JSON.stringify(schemas);
    expect(json).not.toContain("aggregateRating");
    expect(json).not.toContain('"Review"');
  });
});
