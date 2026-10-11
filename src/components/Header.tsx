
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { UserRound, Menu, X } from "lucide-react";
import { authClient } from "../lib/auth-client";

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

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [menu, setMenu] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  async function logout() {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error("সাইন আউট করা যায়নি।");
        return;
      }

      setMenu(false);
      toast.success("সাইন আউট সম্পন্ন");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

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
            <p>
              {new Date().toLocaleDateString("bn-BD", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Dhaka",
              })}
            </p>
          </span>
        </Link>

        <div className="auth-area">
          {isPending ? (
            <span className="login-link">লোড হচ্ছে...</span>
          ) : user ? (
            <div className="profile-wrap">
              <button
                type="button"
                className="profile-button"
                onClick={() => setMenu((current) => !current)}
                aria-expanded={menu}
              >
                <span className="avatar">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    user.name?.slice(0, 1) || <UserRound size={20} />
                  )}
                </span>

                <span>{user.name || user.email}</span>
                ⌄
              </button>

              {menu && (
                <div className="profile-menu !bg-white">
                  <strong>{user.name || "ব্যবহারকারী"}</strong>
                  <small>{user.email}</small>

                  <Link
                    href="/profile"
                    onClick={() => setMenu(false)}
                  >
                    <UserRound size={18} />
                    <span>আমার প্রোফাইল</span>
                  </Link>

                  <button type="button" onClick={logout}>
                    ↩ সাইন আউট
                  </button>
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
        <div className="nav-inner relative flex items-center justify-end md:justify-center">
          {/* Desktop Category Links */}
          <div className="hidden items-center gap-5 md:flex">
            {cats.map(([slug, icon, label]) => (
              <Link
                key={slug}
                className={`nav-link ${
                  path === `/category/${slug}` ? "active" : ""
                }`}
                href={`/category/${slug}`}
              >
                {icon} {label}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="relative md:hidden">
            <button
              type="button"
              onClick={() =>
                setCategoryMenuOpen((current) => !current)
              }
              aria-label="ক্যাটাগরি মেনু"
              aria-expanded={categoryMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100"
            >
              {categoryMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

            {categoryMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 grid w-72 grid-cols-2 gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                {cats.map(([slug, icon, label]) => (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    onClick={() => setCategoryMenuOpen(false)}
                    className={`rounded-lg px-3 py-3 text-sm transition ${
                      path === `/category/${slug}`
                        ? "bg-green-50 font-semibold text-green-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {icon} {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
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
