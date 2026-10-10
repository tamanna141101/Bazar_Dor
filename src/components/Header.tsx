
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

const cats = [
  ["chal", "🍚", "চাল"],
  ["dal", "🥣", "ডাল"],
  ["tel", "🛢️", "তেল"],
  ["sobji", "🥬", "সবজি"],
  ["mach", "🐟", "মাছ"],
  ["mangsho", "🍗", "মাংস"],
  ["dim-dudh", "🥚", "ডিম-দুধ"],
  ["moshla", "🌶️", "মসলা"],
];

function HeaderContent() {
  const path = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setUser(
          JSON.parse(localStorage.getItem("bazardor-user") || "null"),
        );
      } catch {
        setUser(null);
      }
    };

    read();

    window.addEventListener("storage", read);
    window.addEventListener("bazardor-auth", read);

    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("bazardor-auth", read);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("bazardor-user");
    setUser(null);
    setMenu(false);
    toast.success("সাইন আউট সম্পন্ন");
    router.push("/");
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <Image
              src="/assets/logo-icon.png"
              alt="বাজার দর লোগো"
              width={20}
              height={20}
              priority
            />
          </span>
          <span>
            <strong>বাজার দর</strong>
            <small>প্রতিদিনের বাজার, এক নজরে</small>
          </span>
        </Link>

        <div className="auth-area">
          {user ? (
            <div className="profile-wrap">
              <button
                className="profile-button"
                onClick={() => setMenu(!menu)}
              >
                <span className="avatar">
                  {user.name?.slice(0, 1) || "👤"}
                </span>
                <span>{user.name}</span>⌄
              </button>

              {menu && (
                <div className="profile-menu">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>

                  <Link
                    href="/profile"
                    onClick={() => setMenu(false)}
                  >
                    👤 আমার প্রোফাইল
                  </Link>

                  <button onClick={logout}>↩ সাইন আউট</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="login-link" href="/signin">
                সাইন ইন
              </Link>

              <Link className="button button-small" href="/signup">
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="category-nav">
        <div className="nav-inner">
          {cats.map(([slug, icon, label]) => (
            <Link
              key={slug}
              className={`nav-link ${path === `/category/${slug}` ? "active" : ""
                }`}
              href={`/category/${slug}`}
            >
              {icon} {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="ticker">
        <div className="ticker-track">
          {[0, 1].map((n) => (
            <span className="ticker-set" key={n}>
              {[
                ["🍚", "স্বর্ণমাছি চাল", "১৪৮", "up", "২.১"],
                ["🫘", "মসুর ডাল", "১৪২", "up", "১.৯"],
                ["🫙", "সয়াবিন তেল", "১৭৮", "down", "১.২"],
                ["🥔", "আলু", "৩৮", "down", "৩.৫"],
                ["🐟", "রুই মাছ", "৩৮০", "up", "০.৮"],
              ].map(([icon, name, price, dir, pct], i) => (
                <span className="ticker-item" key={i}>
                  {icon} {name} {price} টাকা/কেজি{" "}
                  <b className={dir === "up" ? "up" : "down"}>
                    {dir === "up" ? "▲" : "▼"} {pct}%
                  </b>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<header className="site-header" />}>
      <HeaderContent />
    </Suspense>
  );
}
