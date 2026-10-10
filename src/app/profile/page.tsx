"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [name, setName] = useState("");
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("bazardor-user") || "null");
      if (!u) {
        toast.error("প্রোফাইল দেখতে সাইন ইন করুন");
        router.replace("/signin");
        return;
      }
      setUser(u);
      setName(u.name);
    } catch {
      router.replace("/signin");
    }
  }, [router]);
  function update(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const next = { ...user, name: name.trim() };
    localStorage.setItem("bazardor-user", JSON.stringify(next));
    const users = JSON.parse(
      localStorage.getItem("bazardor-users") || "[]",
    ).map((u: { email: string; name: string }) =>
      u.email === user.email ? { ...u, name: next.name } : u,
    );
    localStorage.setItem("bazardor-users", JSON.stringify(users));
    setUser(next);
    window.dispatchEvent(new Event("bazardor-auth"));
    toast.success("প্রোফাইল আপডেট হয়েছে");
  }
  if (!user)
    return <div className="container loading-state">প্রোফাইল লোড হচ্ছে…</div>;
  return (
    <div className="container profile-page">
      <div className="section-heading">
        <div>
          <h1>আমার প্রোফাইল</h1>
          <span>আপনার অ্যাকাউন্টের তথ্য</span>
        </div>
      </div>
      <section className="profile-card">
        <span className="profile-avatar-large">{user.name.slice(0, 1)}</span>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </section>
      <form className="panel profile-form" onSubmit={update}>
        <h2>তথ্য আপডেট</h2>
        <label>
          নাম
          <input
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button className="button button-full" type="submit">
          আপডেট
        </button>
      </form>
      <Link className="back-link" href="/">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
