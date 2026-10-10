
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategorySort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") || "";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    const query = params.toString();

    router.push(query ? `?${query}` : "?");
  };

  return (
    <div className="category-toolbar">
      <div className="category-sort">
        <label htmlFor="sort">দাম অনুযায়ী সাজান:</label>

        <select
          id="sort"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="">ডিফল্ট</option>
          <option value="asc">কম দাম থেকে বেশি</option>
          <option value="desc">বেশি দাম থেকে কম</option>
        </select>
      </div>
    </div>
  );
}
