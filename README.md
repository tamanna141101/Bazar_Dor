# বাজার দর — BazarDor

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম, পরিবর্তন ও বাজারভিত্তিক তুলনা দেখার responsive web application.

## Technologies

Next.js App Router, React, TypeScript, Tailwind CSS, REST API, react-hot-toast.

## Features

1. Animated price ticker.
2. Price risers and fallers on home page.
3. Responsive product cards and category filtering.
4. Market-wise price details, min/max/average.
5. Numeric category price sorting.
6. Demo sign-in, sign-up, profile update and logout.
7. Loading skeleton and friendly 404 page.
8. Bengali price formatting and responsive layouts.

## Run

```bash
npm install
npm run dev
```

## API

`https://api.api-store.workers.dev/api/bazardor`

## Authentication note

The included authentication is a client-side demonstration using localStorage only. It is not secure for production. Real Better Auth, Google and GitHub login require server configuration, database and provider credentials.
