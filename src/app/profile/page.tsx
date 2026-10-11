
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type User = {
  name: string;
  email: string;
};

function LogOutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("bazardor-user") || "null"
      ) as User | null;

      if (!savedUser) {
        toast.error("প্রোফাইল দেখতে সাইন ইন করুন");
        router.replace("/signin");
        return;
      }

      setUser(savedUser);
      setName(savedUser.name);
    } catch {
      toast.error("প্রোফাইল লোড করা যায়নি। আবার সাইন ইন করুন।");
      router.replace("/signin");
    } finally {
      setLoading(false);
    }
  }, [router]);

  function update(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    const updatedUser = { ...user, name: trimmedName };

    try {
      localStorage.setItem(
        "bazardor-user",
        JSON.stringify(updatedUser)
      );

      const users = JSON.parse(
        localStorage.getItem("bazardor-users") || "[]"
      ).map((u: User) =>
        u.email.toLowerCase() === user.email.toLowerCase()
          ? { ...u, name: trimmedName }
          : u
      );

      localStorage.setItem("bazardor-users", JSON.stringify(users));

      setUser(updatedUser);
      setName(trimmedName);

      window.dispatchEvent(new Event("bazardor-auth"));
      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে");
    } catch {
      toast.error("প্রোফাইল আপডেট করা যায়নি");
    }
  }

  function handleSignOut() {
    localStorage.removeItem("bazardor-user");
    window.dispatchEvent(new Event("bazardor-auth"));

    toast.success("সাইন আউট সফল হয়েছে");
    router.push("/signin");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-green-700 transition hover:text-green-800"
          >
            <span aria-hidden="true">←</span>
            হোম পেজে ফিরে যান
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            আমার প্রোফাইল
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            আপনার ব্যক্তিগত তথ্য দেখুন এবং প্রয়োজনে আপডেট করুন।
          </p>
        </div>

        {/* Profile Card */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="h-2 bg-green-700" />

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-green-100 bg-green-700 text-2xl font-bold text-white">
                {user.name.slice(0, 1).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-xl font-bold text-gray-900">
                  {user.name}
                </h2>

                <p className="mt-1 break-all text-sm text-gray-500">
                  {user.email}
                </p>

                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                  সক্রিয় অ্যাকাউন্ট
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
            >
              <LogOutIcon />
              সাইন আউট
            </button>
          </div>
        </section>

        {/* Update Form */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 border-b border-gray-100 pb-5">
            <h2 className="text-xl font-bold text-gray-900">
              ব্যক্তিগত তথ্য
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              আপনার নাম পরিবর্তন করতে নিচের ফর্মটি ব্যবহার করুন।
            </p>
          </div>

          <form onSubmit={update} className="space-y-5">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                আপনার নাম
              </label>

              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                ইমেইল ঠিকানা
              </label>

              <input
                id="profile-email"
                type="email"
                value={user.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 outline-none"
              />

              <p className="mt-2 text-xs text-gray-500">
                ইমেইল ঠিকানা পরিবর্তন করা যাবে না।
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 sm:w-auto sm:min-w-40"
            >
              পরিবর্তন সংরক্ষণ করুন
            </button>
          </form>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          বাজার দর — প্রতিদিনের বাজার, এক নজরে।
        </p>
      </div>
    </main>
  );
}
