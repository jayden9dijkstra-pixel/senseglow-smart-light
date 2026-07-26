import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import searchProductsTool from "./tools/search-products";

// Build the Supabase OAuth issuer from the project ref. Vite inlines this at
// build time, so the entry stays import-safe (no runtime env read). The
// fallback keeps the URL well-formed during the manifest-extract eval.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "senseglow-mcp",
  title: "SenseGlow Shop",
  version: "0.2.0",
  instructions:
    "Read-only access to SenseGlow's public product catalog (senseglow.shop). Sign in with your SenseGlow account. Use `list_products` to see all products, `search_products` to find products by keyword, and `get_product` to fetch full details (variants, images, prices) for a specific product by its handle.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProductsTool, getProductTool, searchProductsTool],
});
