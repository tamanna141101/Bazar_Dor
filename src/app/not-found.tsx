import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container not-found">
      <span>🧺</span>
      <h1>পেজটি খুঁজে পাওয়া যায়নি</h1>
      <p>লিংকটি ভুল হতে পারে অথবা পেজটি সরানো হয়েছে।</p>
      <Link href="/" className="button">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
