import { describe, it, expect } from "vitest";
import { funnelBreakdown } from "./funnel-breakdown";

describe("funnelBreakdown", () => {
  const events = [
    { session_id: "a", event_type: "page_view", path: "/trapverlichting", referrer: "www.google.com", country: "NL", device: "mobile" },
    { session_id: "a", event_type: "view_item", path: "/product/x", referrer: "www.senseglow.shop", country: "NL", device: "mobile" },
    { session_id: "a", event_type: "add_to_cart", path: "/product/x", referrer: null, country: "NL", device: "mobile" },
    { session_id: "b", event_type: "page_view", path: "/trapverlichting", referrer: "www.google.com", country: "NL", device: "desktop" },
    { session_id: "b", event_type: "engaged", path: "/trapverlichting", referrer: "www.google.com", country: "NL", device: "desktop" },
    { session_id: "c", event_type: "page_view", path: "/", referrer: null, country: "US", device: "desktop" },
    { session_id: "c", event_type: "view_item", path: "/product/y", referrer: null, country: "US", device: "desktop" },
  ];
  it("telt per sessie de eerste pagina, verwijzer en het eerste land", () => {
    const r = funnelBreakdown(events);
    expect(r.by_landing_page[0]).toEqual({ key: "/trapverlichting", sessions: 2, engaged: 1, view_item: 1, add_to_cart: 1, begin_checkout: 0 });
    expect(r.by_landing_page[1]).toEqual({ key: "/", sessions: 1, engaged: 0, view_item: 1, add_to_cart: 0, begin_checkout: 0 });
    expect(r.by_referrer.map((x) => [x.key, x.sessions])).toEqual([["www.google.com", 2], ["(direct)", 1]]);
    expect(r.by_country.map((x) => [x.key, x.sessions])).toEqual([["NL", 2], ["US", 1]]);
    expect(r.by_device.find((x) => x.key === "mobile")?.add_to_cart).toBe(1);
  });
  it("kapt af op de limiet", () => {
    expect(funnelBreakdown(events, 1).by_landing_page).toHaveLength(1);
  });
});
