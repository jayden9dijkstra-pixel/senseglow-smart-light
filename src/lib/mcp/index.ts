import { defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import searchProductsTool from "./tools/search-products";

export default defineMcp({
  name: "senseglow-mcp",
  title: "SenseGlow Shop",
  version: "0.1.0",
  instructions:
    "Read-only access to SenseGlow's public product catalog (senseglow.shop). Use `list_products` to see all products, `search_products` to find products by keyword, and `get_product` to fetch full details (variants, images, prices) for a specific product by its handle.",
  tools: [listProductsTool, getProductTool, searchProductsTool],
});
