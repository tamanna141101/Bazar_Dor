import type { Category, Product } from "../types/product";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://openapi.programming-hero.com/api/bazardor";

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${BASE_URL}/products`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Products API failed (${res.status})`);
    const data = await res.json(); return Array.isArray(data) ? data : data.products ?? data.data ?? [];
}

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE_URL}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Categories API failed (${res.status})`);
    const data = await res.json(); return Array.isArray(data) ? data : data.categories ?? data.data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    const products = await getProducts(); return products.find(p => p.slug === slug || String(p.id) === slug);
}

export function formatBn(value: number) { return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 }).format(value); }

export function unitBn(unit: string) {
    const units: Record<string, string> = {
        kg: "প্রতি কেজি",
        liter: "প্রতি লিটার",
        litre: "প্রতি লিটার",
        dozen: "প্রতি ডজন",
        piece: "প্রতি পিস",
        pcs: "প্রতি পিস"
    };
    return units[unit.toLowerCase()] || `প্রতি ${unit}`;
}
