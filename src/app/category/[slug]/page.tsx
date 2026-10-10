
import Link from "next/link";
import { notFound } from "next/navigation";
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
  dal: { title: "ডাল", icon: "🥣", keys: ["dal", "ডাল"] },
  tel: { title: "তেল", icon: "🛢️", keys: ["tel", "তেল"] },
  sobji: {
    title: "সবজি",
    icon: "🥬",
    keys: ["sobji", "vegetable", "সবজি"],
  },
  mach: { title: "মাছ", icon: "🐟", keys: ["mach", "fish", "মাছ"] },
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

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;

  let cat = fallbackCats[slug];

  if (!cat) notFound();

  try {
    const categories = await getCategories();
    const apiCategory = categories.find(
      (item) => item.slug === slug || item.id === slug,
    );

    if (apiCategory) {
      cat = {
        title:
          apiCategory.nameBn || fallbackCats[slug]?.title || slug,
        icon:
          apiCategory.icon || fallbackCats[slug]?.icon || "🛒",
        keys: fallbackCats[slug]?.keys || [
          slug,
          apiCategory.nameBn || slug,
        ],
      };
    }
  } catch {
    // API unavailable হলে fallback category ব্যবহার হবে
  }

  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch {
    // API unavailable হলে empty product list দেখাবে
  }

  const filtered = products.filter((p) =>
    cat.keys.some((k) =>
      `${p.category} ${p.categoryNameBn}`
        .toLowerCase()
        .includes(k.toLowerCase()),
    ),
  );

  const sorted = [...filtered].sort((a, b) =>
    sort === "asc"
      ? a.today - b.today
      : sort === "desc"
        ? b.today - a.today
        : 0,
  );

  return (
    <div className="container category-page">
      <div className="breadcrumbs">
        <Link href="/">হোম</Link>
        <span>›</span>
        <span>{cat.title}</span>
      </div>

      <section className="category-hero">
        <span className="category-hero-icon">{cat.icon}</span>

        <div>
          <h1>{cat.title}</h1>
          <p>এই বিভাগের আজকের দাম ও পরিবর্তন</p>
        </div>

        <span className="count-pill">{filtered.length}টি পণ্য</span>
      </section>

      <div className="sort-row">
        <span>পণ্যের তালিকা</span>

        <form>
          <label htmlFor="sort">সাজান</label>

          <select
            id="sort"
            name="sort"
            defaultValue={sort || "default"}
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>

          <button className="button button-small" type="submit">
            প্রয়োগ
          </button>
        </form>
      </div>

      <ProductGrid products={sorted} />
    </div>
  );
}
