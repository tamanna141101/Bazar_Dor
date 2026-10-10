import Link from "next/link";
import type { Product } from "../types/product";
import { formatBn, unitBn } from "../lib/api";

export default function ProductCard({ product }: { product: Product }) {
  const dir = product.change?.dir || "flat";
  
  return (
    <Link href={`/product/${product.slug}`} className="product-card">
      <div className="product-top">
        <span className="product-image">
          {product.image || product.categoryIcon || "🛒"}
        </span>
        <span>
          <strong>{product.nameBn}</strong>
          <small>{unitBn(product.unit)} · {product.categoryNameBn}</small>
        </span>
      </div>
      <div className="price-bottom">
        <span>
          <small>আজকের দাম</small>
          <strong>{formatBn(product.today)} টাকা</strong>
        </span>
        <span className={`change-badge ${dir}`}>
          {dir === "up" ? "▲" : dir === "down" ? "▼" : "—"} {formatBn(product.change?.pct || 0)}%
        </span>
      </div>
    </Link>
  );
}