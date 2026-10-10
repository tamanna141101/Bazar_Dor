
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
  const today = Number(product.today) || 0;
  const yesterday = Number(product.yesterday) || 0;

  const difference = today - yesterday;

  const percentage =
    yesterday > 0
      ? (Math.abs(difference) / yesterday) * 100
      : 0;

  const changeDir =
    difference > 0 ? "up" : difference < 0 ? "down" : "flat";

  const changeText =
    difference > 0
      ? `${formatBn(Math.abs(difference))} টাকা বেশি`
      : difference < 0
        ? `${formatBn(Math.abs(difference))} টাকা কম`
        : "· ০ টাকা পরিবর্তন নেই";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card"
    >
      <div className="product-top">
        <span className="product-image" aria-hidden="true">
          {getProductIcon(product)}
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
          <strong>{formatBn(today)} টাকা</strong>
        </span>

        <span className={`change-badge ${changeDir}`}>
          {difference > 0 ? "▲" : difference < 0 ? "▼" : "—"}{" "}
          {formatBn(Number(percentage.toFixed(2)))}%
        </span>
      </div>

      <small className="price-difference">
        {changeText}
      </small>
    </Link>
  );
}
