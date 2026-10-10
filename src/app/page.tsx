import Link from "next/link";
import { getProducts } from "../lib/api";
import ProductGrid from "../components/ProductGrid";
import type { Product } from "../types/product";
import Image from "next/image";

export default async function HomePage() {
  let products: Product[] = [];
  let error = false;

  try {
    products = await getProducts();
  } catch {
    error = true;
  }

  const risers = products
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  const fallers = products
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  return (
    <div className="container home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">আজকের বাজার আপডেট</span>
          <h1>আজকের বাজারের দাম এক নজরে</h1>
          <p>
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক তথ্য,
            গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <a href="#সব-পণ্য" className="button">
            সব পণ্য দেখুন <span>→</span>
          </a>
        </div>
        <div className="hero-art">
          <Image
            src="/assets/bazar-hero.png"
            alt="বাজারের পণ্য"
            width={600}
            height={400}
            priority
            className="hero-image"
          />
        </div>
      </section>

      {error && (
        <div className="notice">
          এই মুহূর্তে API থেকে তথ্য আনা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।
        </div>
      )}

      <section className="section-block">
        <div className="section-heading">
          <h2>
            <span className="red">▲</span> আজ দাম বেড়েছে
          </h2>
          <span>সবচেয়ে বেশি বৃদ্ধি পাওয়া ৬টি পণ্য</span>
        </div>
        <ProductGrid products={risers} />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>
            <span className="green">▼</span> আজ দাম কমেছে
          </h2>
          <span>সবচেয়ে বেশি কমেছে এমন ৬টি পণ্য</span>
        </div>
        <ProductGrid products={fallers} />
      </section>

      <section className="section-block" id="সব-পণ্য">
        <div className="section-heading">
          <div>
            <h2>সব পণ্য</h2>
            <span>বাজারের নিত্যপ্রয়োজনীয় পণ্যের তালিকা</span>
          </div>
          <span>{products.length}টি পণ্য</span>
        </div>
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="empty-state">
            <h3>পণ্যের তথ্য লোড করা যায়নি</h3>
            <p>API connection যাচাই করে পেজটি refresh করুন।</p>
            <Link href="/" className="button">
              আবার চেষ্টা করুন
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
