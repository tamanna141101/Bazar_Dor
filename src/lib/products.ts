
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  [key: string]: unknown;
}

const PRODUCTS_API = "/api/products";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_API, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const result: unknown = await response.json();

  if (Array.isArray(result)) {
    return result as Product[];
  }

  if (typeof result === "object" && result !== null) {
    const data = result as Record<string, unknown>;

    if (Array.isArray(data.data)) {
      return data.data as Product[];
    }
  }

  throw new Error("Unexpected product API response format.");
}
