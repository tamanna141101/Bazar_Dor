
import Link from "next/link";
import type { Product } from "../types/product";
import { formatBn, unitBn } from "../lib/api";

const CATEGORY_ICONS: Record<string, string> = {
  চাল: "🍚",
  ডাল: "🫘",
  তেল: "🛢️",
  সবজি: "🥬",
  মাছ: "🐟",
  মাংস: "🍗",
  "ডিম-দুধ": "🥚",
  মসলা: "🌶️",
};

function getProductIcon(product: Product): string {
  const category = product.categoryNameBn?.trim();

  // API image যদি emoji হয়, সেটি ব্যবহার করো।
  const image = product.image?.trim();
  if (image && /\p{Extended_Pictographic}/u.test(image)) {
    return image;
  }

  const categoryIcon = product.categoryIcon?.trim();
  if (
    categoryIcon &&
    /\p{Extended_Pictographic}/u.test(categoryIcon)
  ) {
    return categoryIcon;
  }

  return CATEGORY_ICONS[category || ""] || "🛒";
}

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const dir = product.change?.dir || "flat";
  const icon = getProductIcon(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card"
    >
      <div className="product-top">
        <span className="product-image" aria-hidden="true">
          {icon}
        </span>

        <span>
          <strong>{product.nameBn}</strong>
          <small>
            {unitBn(product.unit)} · {product.categoryNameBn}
          </small>
        </span>
      </div>

      <div className="price-bottom">
        <span>
          <small>আজকের দাম</small>
          <strong>{formatBn(product.today)} টাকা</strong>
        </span>

        <span className={`change-badge ${dir}`}>
          {dir === "up" ? "▲" : dir === "down" ? "▼" : "—"}{" "}
          {formatBn(product.change?.pct || 0)}%
        </span>
      </div>
    </Link>
  );
}
