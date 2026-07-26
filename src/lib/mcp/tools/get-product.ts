import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getProductByHandle } from "../shopify-client";

export default defineTool({
  name: "get_product",
  title: "Get product",
  description: "Get full details for a single SenseGlow product by its handle (e.g. 'senseglow_wave'): description, images, variants (color/size), prices, availability, and product page URL.",
  inputSchema: {
    handle: z.string().min(1).describe("The product handle, e.g. 'senseglow_wave' or 'senseglow_ambient_motion_bar'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ handle }) => {
    const product = await getProductByHandle(handle);
    if (!product) {
      return {
        content: [{ type: "text", text: `No product found with handle '${handle}'.` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      structuredContent: { product },
    };
  },
});
