import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <span>🧺</span>
        <h3>কোনো পণ্য পাওয়া যায়নি</h3>
        <p>অন্য বিভাগ বেছে নিন অথবা হোম পেজে ফিরে যান।</p>
        <a className="button" href="/">
          হোম পেজে ফিরে যান
        </a>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
