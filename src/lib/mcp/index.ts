import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import searchProductsTool from "./tools/search-products";
import { getAdsDaily, getAttribution, getFunnel, getOrders, getSalesSummary } from "./tools/private-tools";

// Build the Supabase OAuth issuer from the project ref. Vite inlines this at
// build time, so the entry stays import-safe (no runtime env read). The
// fallback keeps the URL well-formed during the manifest-extract eval.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "senseglow-mcp",
  title: "SenseGlow Shop",
  version: "0.3.0",
  instructions:
    "Read-only access to SenseGlow. Catalog tools (`list_products`, `search_products`, `get_product`) work for any signed-in account. Business tools (`get_orders`, `get_sales_summary`, `get_funnel`, `get_attribution`, `get_ads_daily`) only work for the admin account, take date_from/date_to (YYYY-MM-DD, max 90 days) and never return personal data.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProductsTool, getProductTool, searchProductsTool, getOrders, getSalesSummary, getFunnel, getAttribution, getAdsDaily],
});
