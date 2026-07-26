import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { searchProducts } from "../shopify-client";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description: "Search SenseGlow products by keyword (matches title, description, tags). Returns summaries with prices and product page URLs.",
  inputSchema: {
    query: z.string().min(1).describe("Search keywords, e.g. 'wave', 'solar lantern', 'motion sensor'."),
    limit: z.number().int().min(1).max(20).default(10).describe("Maximum results to return (1-20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ query, limit }) => {
    const products = await searchProducts(query, limit);
    return {
      content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
      structuredContent: { products },
    };
  },
});
