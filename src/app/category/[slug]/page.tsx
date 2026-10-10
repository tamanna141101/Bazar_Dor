
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProducts, getCategories } from "../../../lib/api";
import ProductGrid from "../../../components/ProductGrid";
import type { Product } from "../../../types/product";

type CategoryInfo = {
  title: string;
  icon: string;
  keys: string[];
};

const fallbackCats: Record<string, CategoryInfo> = {
  chal: { title: "চাল", icon: "🍚", keys: ["chal", "চাল"] },
  dal: { title: "ডাল", icon: "🫘", keys: ["dal", "ডাল"] },
  tel: { title: "তেল", icon: "🛢️", keys: ["tel", "তেল"] },
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
        title: apiCategory.nameBn || cat.title,
        icon: apiCategory.icon || cat.icon,
        keys: cat.keys,
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
    if (sort === "asc") return a.today - b.today;
    if (sort === "desc") return b.today - a.today;
    return 0;
  });

  return (
    <main className="container category-page">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href="/">হোম</Link>
        <span> / </span>
        <span>{cat.title}</span>
      </nav>

      <section className="category-hero">
        <div className="category-icon" aria-hidden="true">
          {cat.icon}
        </div>

        <div>
          <h1>{cat.title}</h1>
          <p>আপনার পছন্দের {cat.title} পণ্যের বাজারদর দেখুন।</p>
        </div>
      </section>

      <section className="category-products">
        <div className="category-toolbar">
          <h2>{cat.title} পণ্যসমূহ</h2>

          <form method="GET">
            <label htmlFor="sort">দাম অনুযায়ী সাজান: </label>
            <select id="sort" name="sort" defaultValue={sort || ""}>
              <option value="">ডিফল্ট</option>
              <option value="asc">কম দাম থেকে বেশি</option>
              <option value="desc">বেশি দাম থেকে কম</option>
            </select>

            <button type="submit" className="button">
              সাজান
            </button>
          </form>
        </div>

        <ProductGrid products={sortedProducts} />
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
