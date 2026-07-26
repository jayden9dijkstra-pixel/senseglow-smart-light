// Import-safe Shopify Storefront client for MCP tools.
// Uses the public storefront token (read-only, safe to expose).
// Kept isolated from src/lib/shopify.ts to avoid importing browser deps (sonner/toast) at module load.

const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_DOMAIN = "senseglow-smart-light-5jjoq.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "d888e2f5ee17de858e6626f4c34cf9b7";

export const ENABLED_PRODUCT_HANDLES = [
  "senseglow_ambient_motion_bar",
  "senseglow_wave",
  "senseglow_flex",
  "senseglow_solar_lantern",
  "senseglow_wall_lamp",
];

async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify Storefront error ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e: { message: string }) => e.message).join("; "));
  return json.data as T;
}

const PRODUCT_LIST_QUERY = `
  query ListProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
          images(first: 1) { edges { node { url altText } } }
        }
      }
    }
  }
`;

const PRODUCT_DETAIL_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      productType
      tags
      priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
      images(first: 20) { edges { node { url altText } } }
      options { name values }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

export interface ProductSummary {
  title: string;
  handle: string;
  url: string;
  description: string;
  price: { min: string; max: string; currency: string };
  image: string | null;
}

export interface ProductDetail extends ProductSummary {
  productType: string;
  tags: string[];
  images: Array<{ url: string; alt: string | null }>;
  options: Array<{ name: string; values: string[] }>;
  variants: Array<{
    id: string;
    title: string;
    availableForSale: boolean;
    price: { amount: string; currency: string };
    options: Array<{ name: string; value: string }>;
  }>;
}

function productUrl(handle: string) {
  return `https://senseglow.shop/product/${handle}`;
}

export async function listEnabledProducts(): Promise<ProductSummary[]> {
  const data = await storefront<{ products: { edges: Array<{ node: any }> } }>(PRODUCT_LIST_QUERY, {
    first: 50,
  });
  return data.products.edges
    .map(({ node }) => node)
    .filter((n: any) => ENABLED_PRODUCT_HANDLES.includes(n.handle))
    .map((n: any) => ({
      title: n.title,
      handle: n.handle,
      url: productUrl(n.handle),
      description: n.description,
      price: {
        min: n.priceRange.minVariantPrice.amount,
        max: n.priceRange.maxVariantPrice.amount,
        currency: n.priceRange.minVariantPrice.currencyCode,
      },
      image: n.images.edges[0]?.node?.url ?? null,
    }));
}

export async function searchProducts(query: string, limit: number): Promise<ProductSummary[]> {
  const data = await storefront<{ products: { edges: Array<{ node: any }> } }>(PRODUCT_LIST_QUERY, {
    first: Math.min(Math.max(limit, 1), 20),
    query,
  });
  return data.products.edges
    .map(({ node }) => node)
    .filter((n: any) => ENABLED_PRODUCT_HANDLES.includes(n.handle))
    .map((n: any) => ({
      title: n.title,
      handle: n.handle,
      url: productUrl(n.handle),
      description: n.description,
      price: {
        min: n.priceRange.minVariantPrice.amount,
        max: n.priceRange.maxVariantPrice.amount,
        currency: n.priceRange.minVariantPrice.currencyCode,
      },
      image: n.images.edges[0]?.node?.url ?? null,
    }));
}

export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  const data = await storefront<{ productByHandle: any | null }>(PRODUCT_DETAIL_QUERY, { handle });
  const n = data.productByHandle;
  if (!n) return null;
  return {
    title: n.title,
    handle: n.handle,
    url: productUrl(n.handle),
    description: n.description,
    productType: n.productType,
    tags: n.tags,
    price: {
      min: n.priceRange.minVariantPrice.amount,
      max: n.priceRange.maxVariantPrice.amount,
      currency: n.priceRange.minVariantPrice.currencyCode,
    },
    image: n.images.edges[0]?.node?.url ?? null,
    images: n.images.edges.map((e: any) => ({ url: e.node.url, alt: e.node.altText })),
    options: n.options,
    variants: n.variants.edges.map((e: any) => ({
      id: e.node.id,
      title: e.node.title,
      availableForSale: e.node.availableForSale,
      price: { amount: e.node.price.amount, currency: e.node.price.currencyCode },
      options: e.node.selectedOptions,
    })),
  };
}
