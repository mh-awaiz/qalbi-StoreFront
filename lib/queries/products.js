// lib/queries/products.js — all Shopify GraphQL queries

// ─── Fragments ───────────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    tags
    vendor
    productType
    availableForSale
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      maxVariantPrice { amount currencyCode }
    }
    images(first: 10) {
      edges { node { url altText } }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          priceV2: price { amount currencyCode }
          selectedOptions { name value }
        }
      }
    }
    collections(first: 5) {
      edges { node { handle title } }
    }
  }
`;

// ─── Products ────────────────────────────────────────────────────────────────

export const GET_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query GetProducts(
    $first: Int!
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $after: String
  ) {
    products(
      first: $first
      query: $query
      sortKey: $sortKey
      reverse: $reverse
      after: $after
    ) {
      pageInfo { hasNextPage endCursor }
      edges { node { ...ProductFields } }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const GET_FEATURED_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query GetFeaturedProducts($first: Int!) {
    products(first: $first, query: "tag:featured") {
      edges { node { ...ProductFields } }
    }
  }
`;

// ─── Collections ────────────────────────────────────────────────────────────

export const GET_COLLECTIONS = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image { url }
          products(first: 1) {
            edges { node { id } }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  query GetCollectionByHandle(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
      image { url }
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        pageInfo { hasNextPage endCursor }
        edges { node { ...ProductFields } }
      }
    }
  }
`;

// ─── Search ──────────────────────────────────────────────────────────────────

export const SEARCH_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges { node { ...ProductFields } }
    }
  }
`;

// ─── Cart (Shopify Storefront Cart API — used for checkout redirect) ─────────

export const CREATE_CART = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2: price { amount currencyCode }
                  product { title handle images(first: 1) { edges { node { url } } } }
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount { amount currencyCode }
          subtotalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                priceV2: price { amount currencyCode }
                product { title handle images(first: 1) { edges { node { url } } } }
              }
            }
          }
        }
      }
      estimatedCost {
        totalAmount { amount currencyCode }
        subtotalAmount { amount currencyCode }
      }
    }
  }
`;
