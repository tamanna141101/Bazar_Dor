
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
}: {
  products: Product[];
}) {
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
    <section className="product-results">
      <p className="product-count">
        মোট <strong>{products.length}</strong>টি পণ্য পাওয়া গেছে
      </p>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
