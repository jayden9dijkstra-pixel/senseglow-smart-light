import { toast } from "sonner";
import { z } from "zod";
import { ENABLED_PRODUCT_HANDLES } from "@/lib/productConfig";

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'senseglow-smart-light-5jjoq.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
// Shopify Storefront Access Tokens are designed for client-side use (read-only public access)
const SHOPIFY_STOREFRONT_TOKEN = 'd888e2f5ee17de858e6626f4c34cf9b7';
// Branded checkout domain connected to the Shopify store.
const SHOPIFY_CHECKOUT_DOMAIN = 'shop.senseglow.shop';

// Input validation schemas
const limitSchema = z.number().int().min(1).max(250);
const checkoutItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
});
const checkoutItemsSchema = z.array(checkoutItemSchema).min(1).max(100);

const REQUEST_TIMEOUT_MS = 30000;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id title description handle
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 20) { edges { node { url altText } } }
          variants(first: 30) {
            edges { node {
              id title
              price { amount currencyCode }
              availableForSale
              selectedOptions { name value }
            } }
          }
          options { name values }
        }
      }
    }
  }
`;


export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {},
  attempt: number = 1
): Promise<Record<string, unknown> | undefined> {
  const controller = createTimeoutController(REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    if (response.status === 402) {
      toast.error("Shopify: Payment required", {
        description: "Shopify API access requires an active Shopify billing plan.",
      });
      return;
    }

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (data.errors) {
      const errorMessages = Array.isArray(data.errors)
        ? data.errors.map((e: { message?: string }) => e.message || 'Unknown error').join(', ')
        : 'Unknown API error';
      throw new Error(`Error calling Shopify: ${errorMessages}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      if (attempt < MAX_RETRY_ATTEMPTS) {
        await delay(RETRY_DELAY_MS);
        return storefrontApiRequest(query, variables, attempt + 1);
      }
      throw new Error('Request timed out after multiple attempts');
    }

    if (attempt < MAX_RETRY_ATTEMPTS && error instanceof Error &&
        (error.message.includes('network') || error.message.includes('HTTP error'))) {
      await delay(RETRY_DELAY_MS);
      return storefrontApiRequest(query, variables, attempt + 1);
    }

    throw error;
  }
}

export async function fetchProducts(limit: number = 10): Promise<ShopifyProduct[]> {
  try {
    const validatedLimit = limitSchema.parse(limit);
    const data = await storefrontApiRequest(STOREFRONT_QUERY, {
      first: validatedLimit,
      query: "title:SenseGlow*"
    });
    const responseData = data as { data?: { products?: { edges?: ShopifyProduct[] } } } | undefined;
    const allProducts = responseData?.data?.products?.edges || [];
    return allProducts.filter(p => ENABLED_PRODUCT_HANDLES.includes(p.node.handle));
  } catch {
    return [];
  }
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  try {
    const query = `
      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id title description handle
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 20) { edges { node { url altText } } }
          variants(first: 30) {
            edges { node {
              id title
              price { amount currencyCode }
              availableForSale
              selectedOptions { name value }
            } }
          }
          options { name values }
        }
      }
    `;
    const data = await storefrontApiRequest(query, { handle });
    const responseData = data as { data?: { productByHandle?: ShopifyProduct["node"] } } | undefined;
    const productNode = responseData?.data?.productByHandle;
    if (!productNode) return null;
    return { node: productNode };
  } catch {
    return null;
  }
}

interface CheckoutItem {
  variantId: string;
  quantity: number;
}

/**
 * Extract the numeric variant ID from a GraphQL gid
 * (e.g. gid://shopify/ProductVariant/123456789 → 123456789).
 * Passes the value through unchanged if it is already numeric.
 */
function toNumericVariantId(variantId: string): string {
  const match = variantId.match(/\/(\d+)$/);
  return match ? match[1] : variantId;
}

/**
 * Build a Shopify cart permalink on the branded checkout domain
 * (shop.senseglow.shop). Optionally applies a discount code via the
 * `discount` query parameter so bundle discounts still resolve at checkout.
 *
 * Example: https://shop.senseglow.shop/cart/123:1,456:2?discount=SG-PACK-3
 */
export async function createStorefrontCheckout(
  items: CheckoutItem[],
  discountCodes: string[] = []
): Promise<string> {
  const validatedItems = checkoutItemsSchema.parse(items);

  const cartPath = validatedItems
    .map(item => `${toNumericVariantId(item.variantId)}:${item.quantity}`)
    .join(',');

  const url = new URL(`https://${SHOPIFY_CHECKOUT_DOMAIN}/cart/${cartPath}`);
  if (discountCodes.length > 0) {
    url.searchParams.set('discount', discountCodes[0]);
  }
  return url.toString();
}

/**
 * Fetch the current Shopify price for a set of variant IDs.
 * Used to keep cart line prices in sync with what checkout will charge.
 */
export async function fetchVariantPrices(
  variantIds: string[]
): Promise<Record<string, { amount: string; currencyCode: string }>> {
  const ids = Array.from(new Set(variantIds.filter(Boolean))).slice(0, 100);
  if (ids.length === 0) return {};

  try {
    const query = `
      query VariantPrices($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on ProductVariant {
            id
            price { amount currencyCode }
          }
        }
      }
    `;
    const data = await storefrontApiRequest(query, { ids });
    const nodes =
      (data as {
        data?: {
          nodes?: Array<{ id?: string; price?: { amount: string; currencyCode: string } } | null>;
        };
      } | undefined)?.data?.nodes || [];

    const map: Record<string, { amount: string; currencyCode: string }> = {};
    for (const node of nodes) {
      if (node?.id && node.price) map[node.id] = node.price;
    }
    return map;
  } catch {
    return {};
  }
}
