"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("bazardor-users") || "[]");
    const u = users.find(
      (x: { email: string; password: string }) =>
        x.email === email && x.password === password,
    );
    if (!u) {
      toast.error("ইমেইল বা পাসওয়ার্ড সঠিক নয়। আগে অ্যাকাউন্ট তৈরি করুন।");
      return;
    }
    localStorage.setItem(
      "bazardor-user",
      JSON.stringify({ name: u.name, email: u.email }),
    );
    window.dispatchEvent(new Event("bazardor-auth"));
    toast.success("সাইন ইন সফল হয়েছে");
    router.push("/");
  }
  return (
    <div className="auth-page container">
      <div className="auth-intro">
        <span className="eyebrow">স্বাগতম</span>
        <h1>সাইন ইন</h1>
        <p>বিস্তারিত দাম ও বাজার তুলনা দেখতে প্রবেশ করুন।</p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <label>
          ইমেইল
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          পাসওয়ার্ড
          <input
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            placeholder="কমপক্ষে ৬ অক্ষর"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="button button-full" type="submit">
          সাইন ইন
        </button>
        <div className="divider-text">
          <span>অথবা</span>
        </div>
        <button
          className="social-button"
          type="button"
          onClick={() =>
            toast("Google/GitHub login চালু করতে provider credentials প্রয়োজন।")
          }
        >
          🌐 Google / GitHub দিয়ে চালিয়ে যান
        </button>
        <p className="auth-bottom">
          অ্যাকাউন্ট নেই? <Link href="/signup">সাইন আপ করুন</Link>
        </p>
      </form>
      <Link className="back-link" href="/">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
