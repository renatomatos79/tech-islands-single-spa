export type Currency = "EUR" | "USD" | "BRL";

export type Product = {
  id: string;
  sku: string;
  description: string;
  price: number;
  currency: Currency;
};

const API_URL = "http://localhost:3001/products";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to load products");
  return response.json();
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to load product");
  return response.json();
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
}

export async function updateProduct(product: Product): Promise<Product> {
  const response = await fetch(`${API_URL}/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) throw new Error("Failed to delete product");
}