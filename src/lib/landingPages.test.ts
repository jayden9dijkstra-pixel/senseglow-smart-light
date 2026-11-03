import { describe, it, expect } from "vitest";
import { getLandingPage } from "./landingPages";
import { PRODUCT_HANDLE, FLEX_PRODUCT_HANDLE } from "./productConfig";

describe("nieuwe landingspagina's", () => {
  it("/kastverlichting: Ambient 30 cm, 2 lampen", () => {
    const o = getLandingPage("/kastverlichting")!.offers;
    expect(o).toHaveLength(1);
    expect(o[0]).toMatchObject({ handle: PRODUCT_HANDLE, sizeCm: 30, qty: 2 });
  });
  it("/oplaadbare-wandlamp: Flex, 1 lamp", () => {
    const o = getLandingPage("/oplaadbare-wandlamp")!.offers;
    expect(o).toHaveLength(1);
    expect(o[0]).toMatchObject({ handle: FLEX_PRODUCT_HANDLE, qty: 1 });
  });
  it("/oplaadbare-wandlamp noemt nergens 'sensor'", () => {
    const json = JSON.stringify(getLandingPage("/oplaadbare-wandlamp"));
    expect(json.toLowerCase()).not.toContain("sensor");
  });
});
