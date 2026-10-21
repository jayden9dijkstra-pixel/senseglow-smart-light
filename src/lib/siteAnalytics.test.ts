import { afterEach, describe, expect, it, vi } from "vitest";
import { isInternalVisitor } from "./siteAnalytics";

vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

function browserState(search: string, marked = true) {
  let cookie = marked ? "sg_internal=1" : "";
  vi.stubGlobal("window", { location: { search } });
  vi.stubGlobal("document", {
    get cookie() { return cookie; },
    set cookie(value: string) {
      cookie = value.includes("max-age=0") ? "" : value.split(";")[0];
    },
  });
}

afterEach(() => vi.unstubAllGlobals());

describe("internal visitor marking", () => {
  it("preserves the device mark when dashboard internal traffic is included", () => {
    browserState("?exclude_internal=0");
    expect(isInternalVisitor()).toBe(true);
  });

  it("preserves the mark when the dashboard filter is restored and the visitor returns to the shop", () => {
    browserState("?exclude_internal=0");
    isInternalVisitor();
    window.location.search = "";
    expect(isInternalVisitor()).toBe(true);
  });

  it("still removes the device mark with the explicit intern=0 command", () => {
    browserState("?intern=0");
    expect(isInternalVisitor()).toBe(false);
  });

  it("still marks another device with the explicit intern=1 command", () => {
    browserState("?intern=1", false);
    expect(isInternalVisitor()).toBe(true);
  });
});