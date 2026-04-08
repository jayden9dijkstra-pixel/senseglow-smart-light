import { toast } from "sonner";
import { z } from "zod";
import { bundlePricing, incVatPrices, SizeVariant, ENABLED_PRODUCT_HANDLES } from "@/lib/productConfig";

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
          variants(first: 10) {
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
    
    // Only fetch SenseGlow products
    const data = await storefrontApiRequest(STOREFRONT_QUERY, { 
      first: validatedLimit,
      query: "title:SenseGlow*"
    });
    const responseData = data as { data?: { products?: { edges?: ShopifyProduct[] } } } | undefined;
    return responseData?.data?.products?.edges || [];
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
          variants(first: 10) {
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
  bundleSize: string; // e.g. "20cm", "30cm", "40cm"
  quantity: number;   // e.g. 2, 3, 5
}

/**
 * Calculate the optimal bundle discount for a given quantity of one size,
 * using a greedy algorithm: 5-packs first, then 3-packs, then 2-packs.
 */
export function calcSizeDiscount(sizeCm: string, qty: number): number {
  const sizeKey = `${sizeCm}cm` as SizeVariant;
  const unitPrice = parseFloat(incVatPrices[sizeKey] || "0");
  const pricing = bundlePricing[sizeKey];
  if (!pricing || qty < 2 || unitPrice === 0) return 0;

  const tiers = [
    { n: 4, save: 4 * unitPrice - parseFloat(pricing.four.price) },
    { n: 3, save: 3 * unitPrice - parseFloat(pricing.three.price) },
    { n: 2, save: 2 * unitPrice - parseFloat(pricing.two.price) },
  ];

  let remaining = qty;
  let discount = 0;
  for (const t of tiers) {
    while (remaining >= t.n) {
      discount += t.save;
      remaining -= t.n;
    }
  }
  return Math.round(discount * 100) / 100;
}

/** Existing per-size code amounts (cents) mapped to a usable code name */
const PER_SIZE_CODE_AMOUNTS: Record<number, (size: string) => string> = {
  550:  () => 'SG-20CM-2PACK',
  700:  () => 'SG-30CM-2PACK',
  800:  () => 'SG-40CM-2PACK',
  1650: () => 'SG-20CM-3PACK',
  2100: () => 'SG-30CM-3PACK',
  2400: () => 'SG-40CM-3PACK',
  2750: () => 'SG-20CM-4PACK',
  3500: () => 'SG-30CM-4PACK',
  4000: () => 'SG-40CM-4PACK',
};

export async function createStorefrontCheckout(
  items: CheckoutItem[],
  bundleInfos: CheckoutBundleInfo[] = []
): Promise<string> {
  // Validate input
  const validatedItems = checkoutItemsSchema.parse(items);
  
  const lines = validatedItems.map(item => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  // Consolidate bundles by size — sum total quantities per size
  const sizeQuantities: Record<string, number> = {};
  for (const b of bundleInfos) {
    const size = b.bundleSize.replace('cm', '').trim();
    sizeQuantities[size] = (sizeQuantities[size] || 0) + b.quantity;
  }

  // Calculate per-size discounts and total
  const sizeDiscounts: Record<string, number> = {};
  let totalDiscount = 0;
  let discountSizeCount = 0;

  for (const [size, qty] of Object.entries(sizeQuantities)) {
    const d = calcSizeDiscount(size, qty);
    if (d > 0) {
      sizeDiscounts[size] = d;
      totalDiscount += d;
      discountSizeCount++;
    }
  }

  // Determine the right discount code(s)
  const discountCodes: string[] = [];

  if (discountSizeCount === 1) {
    // Single size — try to use existing per-size code
    const [size, qty] = Object.entries(sizeQuantities).find(([s]) => sizeDiscounts[s])!;
    // Standard tiers where one per-size code covers everything
    if (qty >= 2 && qty <= 6) {
      if (qty >= 4) discountCodes.push(`SG-${size}CM-4PACK`);
      else if (qty >= 3) discountCodes.push(`SG-${size}CM-3PACK`);
      else discountCodes.push(`SG-${size}CM-2PACK`);
    } else {
      // qty >= 7: needs combo code
      const cents = Math.round(totalDiscount * 100);
      discountCodes.push(`SG-COMBO-${cents}`);
    }
  } else if (discountSizeCount > 1) {
    // Multiple sizes — always use combo code
    const cents = Math.round(totalDiscount * 100);
    // Check if amount matches an existing per-size code (rare but possible)
    const firstSize = Object.keys(sizeDiscounts)[0];
    const maker = PER_SIZE_CODE_AMOUNTS[cents];
    if (maker) {
      discountCodes.push(maker(firstSize));
    } else {
      discountCodes.push(`SG-COMBO-${cents}`);
    }
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
  
  if (!checkoutUrl) {
    throw new Error('No checkout URL returned from Shopify');
  }

  const url = new URL(checkoutUrl);
  url.searchParams.set('channel', 'online_store');
  return url.toString();
}
