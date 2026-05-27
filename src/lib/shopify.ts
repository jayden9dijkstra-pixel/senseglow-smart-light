import { toast } from "sonner";
import { z } from "zod";
import {
  bundlePricing, incVatPrices, SizeVariant, ENABLED_PRODUCT_HANDLES,
  ProductKey, BundleTierKey, BUNDLE_TIERS, quoteBundle,
} from "@/lib/productConfig";
import { isBundleOptionValue } from "@/lib/bundleVariants";

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

// Request configuration
const REQUEST_TIMEOUT_MS = 30000; // 30 second timeout
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000; // 1 second between retries

// Helper function to create timeout signal
function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}

// Helper function for delay
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
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 20) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 30) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
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
      body: JSON.stringify({
        query,
        variables,
      }),
      signal: controller.signal,
    });

    if (response.status === 402) {
      toast.error("Shopify: Payment required", {
        description: "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade your store.",
      });
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      const errorMessages = Array.isArray(data.errors) 
        ? data.errors.map((e: { message?: string }) => e.message || 'Unknown error').join(', ')
        : 'Unknown API error';
      throw new Error(`Error calling Shopify: ${errorMessages}`);
    }

    return data;
  } catch (error) {
    // Handle timeout
    if (error instanceof Error && error.name === 'AbortError') {
      if (attempt < MAX_RETRY_ATTEMPTS) {
        await delay(RETRY_DELAY_MS);
        return storefrontApiRequest(query, variables, attempt + 1);
      }
      throw new Error('Request timed out after multiple attempts');
    }
    
    // Retry on network errors
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
    
    // Fetch all SenseGlow products from Shopify
    const data = await storefrontApiRequest(STOREFRONT_QUERY, { 
      first: validatedLimit,
      query: "title:SenseGlow*"
    });
    const responseData = data as { data?: { products?: { edges?: ShopifyProduct[] } } } | undefined;
    const allProducts = responseData?.data?.products?.edges || [];
    
    // Only return products whose handle is explicitly whitelisted
    return allProducts.filter(p => ENABLED_PRODUCT_HANDLES.includes(p.node.handle));
  } catch {
    return [];
  }
}

/**
 * Fetch a single product by its Shopify handle.
 */
export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  try {
    const query = `
      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 20) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 30) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
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
      cart?: {
        checkoutUrl?: string;
      };
      userErrors?: Array<{ message?: string }>;
    };
  };
}

export interface CheckoutBundleInfo {
  productKey: ProductKey;
  variantKey: string;
  tierKey: BundleTierKey;
  quantity: number;       // total units of this bundle line (e.g. 3 for trio)
  unitPrice: number;      // inc-VAT unit price used for the calc
}

/**
 * Build the discount code string for a given (productKey, variantKey, tierKey).
 * Codes follow the SG-* convention from the plan.
 */
function buildDiscountCode(p: ProductKey, variantKey: string, tier: BundleTierKey): string | null {
  const t = BUNDLE_TIERS[p]?.[tier];
  if (!t) return null;
  const qtySuffix = tier === "eight" ? "8" : String(t.qty);
  switch (p) {
    case "ambient": return `SG-AB-${variantKey}-${qtySuffix}`;
    case "wave":    return `SG-WAVE-${variantKey}-${qtySuffix}`;
    case "arc":     return `SG-ARC-${variantKey}-${qtySuffix}`;
    case "lantern": return `SG-SOL-${qtySuffix}`;
    case "sconce":  return `SG-SCONCE-8`;
    default: return null;
  }
}

/**
 * Greedy: collapse multiple bundle lines per (productKey, variantKey)
 * into the optimal mix of tier codes for that group.
 */
function pickCodesForGroup(p: ProductKey, variantKey: string, totalQty: number): string[] {
  const tierMap = BUNDLE_TIERS[p];
  if (!tierMap) return [];
  const tiers = (Object.entries(tierMap) as Array<[BundleTierKey, typeof tierMap[BundleTierKey]]>)
    .filter(([, v]) => !!v)
    .sort((a, b) => (b![1]!.qty - a![1]!.qty)); // largest first

  const codes: string[] = [];
  let remaining = totalQty;
  for (const [tk, t] of tiers) {
    while (remaining >= t!.qty) {
      const c = buildDiscountCode(p, variantKey, tk);
      if (c) codes.push(c);
      remaining -= t!.qty;
    }
  }
  return codes;
}

/** Legacy helper still used by CartDrawer for size-only Ambient totals. */
export function calcSizeDiscount(sizeCm: string, qty: number): number {
  const sizeKey = `${sizeCm}cm` as SizeVariant;
  const unit = parseFloat(incVatPrices[sizeKey] || "0");
  if (!unit || qty < 2) return 0;
  const tiers: Array<{ key: BundleTierKey; qty: number }> = [
    { key: "four", qty: 4 }, { key: "three", qty: 3 }, { key: "two", qty: 2 },
  ];
  let remaining = qty;
  let saved = 0;
  for (const t of tiers) {
    while (remaining >= t.qty) {
      const q = quoteBundle("ambient", t.key, unit);
      if (q) saved += parseFloat(q.save);
      remaining -= t.qty;
    }
  }
  return Math.round(saved * 100) / 100;
}

export async function createStorefrontCheckout(
  items: CheckoutItem[],
  bundleInfos: CheckoutBundleInfo[] = []
): Promise<string> {
  const validatedItems = checkoutItemsSchema.parse(items);

  const lines = validatedItems.map(item => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  // Group bundle quantities per (productKey|variantKey)
  const groups: Record<string, { p: ProductKey; vk: string; qty: number }> = {};
  for (const b of bundleInfos) {
    const key = `${b.productKey}|${b.variantKey}`;
    if (!groups[key]) groups[key] = { p: b.productKey, vk: b.variantKey, qty: 0 };
    groups[key].qty += b.quantity;
  }

  const discountCodes: string[] = [];
  for (const g of Object.values(groups)) {
    discountCodes.push(...pickCodesForGroup(g.p, g.vk, g.qty));
  }

  const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: {
      lines,
      ...(discountCodes.length > 0 ? { discountCodes } : {}),
    },
  }) as CartCreateResponse | undefined;

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

