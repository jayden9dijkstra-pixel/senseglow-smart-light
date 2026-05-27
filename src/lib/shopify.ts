import { toast } from "sonner";
import { z } from "zod";
import { ENABLED_PRODUCT_HANDLES } from "@/lib/productConfig";

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'senseglow-smart-light-5jjoq.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
// Shopify Storefront Access Tokens are designed for client-side use (read-only public access)
const SHOPIFY_STOREFRONT_TOKEN = 'd888e2f5ee17de858e6626f4c34cf9b7';

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

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id checkoutUrl totalQuantity
        cost { totalAmount { amount currencyCode } }
      }
      userErrors { field message }
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

interface CartCreateResponse {
  data?: {
    cartCreate?: {
      cart?: { checkoutUrl?: string };
      userErrors?: Array<{ message?: string }>;
    };
  };
}

/**
 * Create a Shopify cart via the Storefront API. Optionally applies one or
 * more discount codes (Shopify combines them based on shop configuration).
 */
export async function createStorefrontCheckout(
  items: CheckoutItem[],
  discountCodes: string[] = []
): Promise<string> {
  const validatedItems = checkoutItemsSchema.parse(items);

  const lines = validatedItems.map(item => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  const input: Record<string, unknown> = { lines };
  if (discountCodes.length > 0) input.discountCodes = discountCodes;

  const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, { input }) as CartCreateResponse | undefined;

  const userErrors = cartData?.data?.cartCreate?.userErrors;
  if (userErrors && userErrors.length > 0) {
    const errorMessages = userErrors.map(e => e.message || 'Unknown error').join(', ');
    throw new Error(`Cart creation failed: ${errorMessages}`);
  }

  const checkoutUrl = cartData?.data?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) throw new Error('No checkout URL returned from Shopify');

  const url = new URL(checkoutUrl);
  url.searchParams.set('channel', 'online_store');
  return url.toString();
}
