
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const PRODUCTS_API =
  "https://openapi.programming-hero.com/api/bazardor/products";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bazardor");
    const collection = db.collection("products");

    // MongoDB empty হলে external API থেকে products আনবে
    const count = await collection.countDocuments();

    if (count === 0) {
      const response = await fetch(PRODUCTS_API, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Could not fetch products from source API");
      }

      const result: unknown = await response.json();

      let products: Record<string, unknown>[] = [];

      if (Array.isArray(result)) {
        products = result as Record<string, unknown>[];
      } else if (typeof result === "object" && result !== null) {
        const data = result as Record<string, unknown>;

        if (Array.isArray(data.data)) {
          products = data.data as Record<string, unknown>[];
        }
      }

      if (products.length > 0) {
        await collection.insertMany(products);
      }
    }

    const products = await collection
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load products" },
      { status: 500 }
    );
  }
}
