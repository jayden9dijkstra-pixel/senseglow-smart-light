import { defineTool } from "@lovable.dev/mcp-js";
import { listEnabledProducts } from "../shopify-client";

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List all SenseGlow products currently sold on senseglow.shop, with price range, description, and product page URL.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const products = await listEnabledProducts();
    return {
      content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
      structuredContent: { products },
    };
  },
});
