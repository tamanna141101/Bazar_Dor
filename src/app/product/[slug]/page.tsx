
"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
import {
  getProductBySlug,
  formatBn,
  unitBn,
} from "../../../lib/api";

type Product = Awaited<ReturnType<typeof getProductBySlug>>;

function ProductDetails() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [product, setProduct] = useState<Product>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      const callbackURL = `/product/${encodeURIComponent(slug)}`;

      router.replace(
        `/signin?callbackURL=${encodeURIComponent(callbackURL)}`
      );
    }
  }, [isPending, session, slug, router]);

  useEffect(() => {
    if (isPending || !session?.user) return;

    let cancelled = false;

    async function loadProduct() {
      setLoading(true);

      try {
        const result = await getProductBySlug(slug);

        if (!cancelled) {
          setProduct(result ?? undefined);
        }
      } catch {
        if (!cancelled) {
          setProduct(undefined);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug, isPending, session]);

  if (isPending || !session?.user || loading) {
    return (
      <div className="container detail-page">
        <p>পণ্যের তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container detail-page">
        <h1>পণ্যটি খুঁজে পাওয়া যায়নি</h1>
        <Link href="/" className="back-link">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const vals = product.markets.flatMap((m) => [m.min, m.max]);

  const min = vals.length
    ? Math.min(...vals)
    : product.today;

  const max = vals.length
    ? Math.max(...vals)
    : product.today;

  const avg = vals.length
    ? vals.reduce((a, b) => a + b, 0) / vals.length
    : product.today;

  const difference =
    Number(product.today) - Number(product.yesterday);

  const changeText =
    difference > 0
      ? `দাম বেড়েছে · ${formatBn(
          Math.abs(difference)
        )} টাকা বেশি`
      : difference < 0
        ? `দাম কমেছে · ${formatBn(
            Math.abs(difference)
          )} টাকা কম`
        : "· ০ টাকা পরিবর্তন নেই";

  return (
    <div className="container detail-page">
      <div className="breadcrumbs">
        <Link href="/">হোম</Link>
        <span>›</span>
        <Link href={`/category/${product.category}`}>
          {product.categoryNameBn}
        </Link>
        <span>›</span>
        <span>{product.nameBn}</span>
      </div>

      <section className="detail-hero">
        <div className="detail-product">
          <span className="detail-emoji">{product.image}</span>

          <div>
            <h1>{product.nameBn}</h1>

            <p>
              {unitBn(product.unit)} · {product.categoryNameBn}
            </p>

            <span className="market-note">
              গতকালের তুলনায় আজ {changeText}
            </span>
          </div>
        </div>

        <div className="today-price">
          <small>আজকের দাম</small>
          <strong>{formatBn(product.today)}</strong>
          <span>টাকা / একক</span>

          <b className={`change-badge ${product.change.dir}`}>
            {product.change.dir === "up"
              ? "▲"
              : product.change.dir === "down"
                ? "▼"
                : "—"}{" "}
            {formatBn(product.change.pct)}%
          </b>
        </div>
      </section>

      <section className="panel">
        <h2>দামের সারসংক্ষেপ</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <small>সর্বনিম্ন দাম</small>
            <strong className="green">
              {formatBn(min)} টাকা
            </strong>
            <span>সবচেয়ে কম দামের বাজার</span>
          </div>

          <div className="stat-card">
            <small>সর্বাধিক দাম</small>
            <strong className="red">
              {formatBn(max)} টাকা
            </strong>
            <span>সবচেয়ে বেশি দামের বাজার</span>
          </div>

          <div className="stat-card">
            <small>গড় দাম</small>
            <strong>{formatBn(avg)} টাকা</strong>
            <span>{unitBn(product.unit)} হিসেবে</span>
          </div>
        </div>

        <h2 className="table-title">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {product.markets.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>বাজার</th>
                  <th>বিভাগ</th>
                  <th>সর্বনিম্ন</th>
                  <th>সর্বাধিক</th>
                  <th>গড়</th>
                </tr>
              </thead>

              <tbody>
                {product.markets.map((m, i) => (
                  <tr key={`${m.market}-${i}`}>
                    <td>{m.market}</td>
                    <td>{m.division}</td>
                    <td>{formatBn(m.min)} টাকা</td>
                    <td>{formatBn(m.max)} টাকা</td>
                    <td>
                      <strong>
                        {formatBn((m.min + m.max) / 2)} টাকা
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
        )}
      </section>

      <Link href="/" className="back-link">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="container detail-page">
          <p>পণ্যের তথ্য লোড হচ্ছে...</p>
        </div>
      }
    >
      <ProductDetails />
    </Suspense>
  );
}
