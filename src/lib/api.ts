import { categories as fallbackCategories, products as fallbackProducts, type Category, type Product } from "./mock-data";

const createError = (message: string, status = 500) => {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
};

async function apiFetch<T>(url: string, opts?: RequestInit, fallback?: T): Promise<T> {
  try {
    const response = await fetch(url, opts);
    if (!response.ok) {
      const body = await response.text();
      throw createError(body || `${response.status} ${response.statusText}`, response.status);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/api/categories", undefined, fallbackCategories);
}

export async function getProducts(options?: {
  category?: string;
  sort?: string;
  minRating?: number;
  maxPrice?: number;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (options?.category && options.category !== "all") params.set("category", options.category);
  if (options?.sort) params.set("sort", options.sort);
  if (options?.minRating !== undefined) params.set("minRating", String(options.minRating));
  if (options?.maxPrice !== undefined) params.set("maxPrice", String(options.maxPrice));
  const url = `/api/products?${params.toString()}`;
  return apiFetch<Product[]>(url, undefined, fallbackProducts);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const fallbackProduct = fallbackProducts.find((product) => product.slug === slug);
  if (fallbackProduct) {
    return apiFetch<Product>(`/api/products/${slug}`, undefined, fallbackProduct);
  }
  return apiFetch<Product>(`/api/products/${slug}`);
}

export interface OrderItem {
  productId: string;
  qty: number;
  shade?: string;
  unitPrice: number;
  name: string;
}

export interface OrderPayload {
  name: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pin: string;
  delivery: "standard" | "express" | "ritual";
  payment: "upi" | "card" | "wallet" | "cod";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export async function submitOrder(payload: OrderPayload): Promise<{ orderId: string }> {
  return apiFetch<{ orderId: string }>("/api/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}
