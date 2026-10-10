"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("bazardor-users") || "[]");
    if (users.some((u: { email: string }) => u.email === email)) {
      toast.error("এই ইমেইলে অ্যাকাউন্ট আছে। সাইন ইন করুন।");
      return;
    }
    users.push({ name: name.trim(), email, password });
    localStorage.setItem("bazardor-users", JSON.stringify(users));
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এবার সাইন ইন করুন।");
    router.push("/signin");
  }
  return (
    <div className="auth-page container">
      <div className="auth-intro">
        <span className="eyebrow">নতুন শুরু</span>
        <h1>অ্যাকাউন্ট তৈরি করুন</h1>
        <p>বাজারদরের তথ্য দেখতে অ্যাকাউন্ট খুলুন।</p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <label>
          নাম
          <input
            required
            autoComplete="name"
            placeholder="আপনার নাম"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
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
            autoComplete="new-password"
            placeholder="কমপক্ষে ৬ অক্ষর"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="button button-full" type="submit">
          অ্যাকাউন্ট তৈরি করুন
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
          অ্যাকাউন্ট আছে? <Link href="/signin">সাইন ইন করুন</Link>
        </p>
      </form>
      <Link className="back-link" href="/">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
