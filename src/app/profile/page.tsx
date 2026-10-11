
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserRound } from "lucide-react";
import { authClient } from "../../lib/auth-client";

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
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/signin?callbackURL=%2Fprofile");
    }
  }, [user, isPending, router]);

  async function handleSignOut() {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error("সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সাইন আউট সফল হয়েছে");
      router.replace("/signin");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  if (isPending || !user) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
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

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="h-2 bg-green-700" />

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-green-100 bg-green-700 text-2xl font-bold text-white">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user.name || user.email || "U")
                    .slice(0, 1)
                    .toUpperCase()
                )}
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-xl font-bold text-gray-900">
                  {user.name || "ব্যবহারকারী"}
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

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              ব্যক্তিগত তথ্য
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              আপনার নাম পরিবর্তন করতে Update Information বাটনে ক্লিক করুন।
            </p>
          </div>

          <Link
            href="/profile/update"
            className="inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200"
          >
            Update Information
          </Link>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          বাজার দর — প্রতিদিনের বাজার, এক নজরে।
        </p>
      </div>
    </main>
  );
}