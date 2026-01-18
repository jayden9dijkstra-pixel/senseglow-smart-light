import { toast } from "sonner";
import { z } from "zod";

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
  query GetProducts($first: Int!) {
    products(first: $first) {
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
    // Validate input
    const validatedLimit = limitSchema.parse(limit);
    
    const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: validatedLimit });
    const responseData = data as { data?: { products?: { edges?: ShopifyProduct[] } } } | undefined;
    const products = responseData?.data?.products?.edges || [];
    return products;
  } catch {
    return [];
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

export async function createStorefrontCheckout(items: CheckoutItem[]): Promise<string> {
  // Validate input
  const validatedItems = checkoutItemsSchema.parse(items);
  
  const lines = validatedItems.map(item => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: {
      lines,
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
