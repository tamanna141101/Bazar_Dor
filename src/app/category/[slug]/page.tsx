
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getProducts, getCategories } from "../../../lib/api";
import ProductGrid from "../../../components/ProductGrid";
import CategorySort from "../../../components/CategorySort";

import type { Product } from "../../../types/product";

type CategoryInfo = {
  title: string;
  icon: string;
  keys: string[];
};

const fallbackCats: Record<string, CategoryInfo> = {
  chal: {
    title: "চাল",
    icon: "🍚",
    keys: ["chal", "চাল"],
  },
  dal: {
    title: "ডাল",
    icon: "🫘",
    keys: ["dal", "ডাল"],
  },
  tel: {
    title: "তেল",
    icon: "🛢️",
    keys: ["tel", "তেল"],
  },
  sobji: {
    title: "সবজি",
    icon: "🥬",
    keys: ["sobji", "vegetable", "সবজি"],
  },
  mach: {
    title: "মাছ",
    icon: "🐟",
    keys: ["mach", "fish", "মাছ"],
  },
  mangsho: {
    title: "মাংস",
    icon: "🍗",
    keys: ["mangsho", "meat", "মাংস"],
  },
  "dim-dudh": {
    title: "ডিম-দুধ",
    icon: "🥚",
    keys: ["dim", "dudh", "egg", "milk", "ডিম", "দুধ"],
  },
  moshla: {
    title: "মসলা",
    icon: "🌶️",
    keys: ["moshla", "spice", "মসলা"],
  },
};

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

async function CategoryContent({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  let cat = fallbackCats[slug];

  if (!cat) {
    notFound();
  }

  try {
    const categories = await getCategories();

    const apiCategory = categories.find(
      (item) => item.slug === slug || item.id === slug
    );

    if (apiCategory) {
      cat = {
        ...cat,
        title: apiCategory.nameBn || cat.title,
        icon: apiCategory.icon || cat.icon,
      };
    }
  } catch (error) {
    console.error("Failed to load categories:", error);
  }

  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  const filteredProducts = products.filter((product) => {
    const categoryText =
      `${product.category ?? ""} ${product.categoryNameBn ?? ""}`.toLowerCase();

    return cat.keys.some((key) =>
      categoryText.includes(key.toLowerCase())
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.today) || 0;
    const priceB = Number(b.today) || 0;

    if (sort === "asc") {
      return priceA - priceB;
    }

    if (sort === "desc") {
      return priceB - priceA;
    }

    return 0;
  });

  return (
    <main className="container category-page">
      <section className="category-hero">
        <div className="category-icon" aria-hidden="true">
          {cat.icon}
        </div>

        <div>
          <h1>{cat.title}</h1>
          <p>
            {sortedProducts.length}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </section>

      <section className="category-products">
        <CategorySort />

        {sortedProducts.length > 0 ? (
          <ProductGrid products={sortedProducts} />
        ) : (
          <div className="empty-state">
            <h3>এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</h3>
            <p>অন্য ক্যাটাগরি নির্বাচন করে দেখুন।</p>

            <Link href="/" className="button">
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default function CategoryPage(props: CategoryPageProps) {
  return (
    <Suspense
      fallback={
        <main className="container category-page">
          <p>ক্যাটাগরি লোড হচ্ছে...</p>
        </main>
      }
    >
      <CategoryContent {...props} />
    </Suspense>
  );
}
