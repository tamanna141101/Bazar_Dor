# 🛒 বাজার দর | BazarDor

**আজকের বাজারদর, এক নজরে।**

BazarDor is a responsive Bangla web application that helps users explore the prices of everyday essentials in Bangladesh. It displays price changes, organizes products by category, and provides market-wise price comparisons to make everyday shopping decisions easier.

## ✨ Key Features

- 📈 **Price Ticker:** View product prices and price-change indicators.
- 🔺 **Price Risers and Fallers:** Explore products whose prices have increased or decreased.
- 🛍️ **Product Listing:** Browse everyday essentials in a responsive product grid.
- 🗂️ **Category Filtering:** Explore products by category.
- ↕️ **Price Sorting:** Sort category products from low to high or high to low.
- 🏪 **Market-wise Price Comparison:** View minimum, maximum, and average prices with market details.
- 🔐 **Authentication:** Email/password sign-up and sign-in using Better Auth.
- 👤 **User Profile:** View account information and update the profile name.
- 🔔 **Toast Notifications:** Receive feedback for authentication and profile actions.
- 📱 **Responsive Design:** Browse the application on mobile, tablet, and desktop.
- 🚫 **Custom 404 Page:** Get a friendly message when a page cannot be found.
- ⏳ **Loading UI:** Display loading indicators while content is being loaded.

> Google and GitHub sign-in require valid OAuth credentials and environment configuration before they can be used.

## 🛠️ Technologies Used

- **Next.js** — App Router and page navigation
- **React** — UI components
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Styling and responsive layouts
- **Better Auth** — Authentication and session management
- **MongoDB** — Database for authentication data
- **REST API** — Product and market data
- **React Hot Toast** — Toast notifications
- **Lucide React** — Icons

## 📡 API

Product information is fetched from the BazarDor API.

Base URL: `https://api.api-store.workers.dev/api/bazardor`

Main endpoints:

- `/products` — Retrieve products
- `/products?category=chal` — Filter products by category
- `/products/1` — Retrieve a product by ID
- `/categories` — Retrieve categories
- `/categories/chal` — Retrieve a category

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- A MongoDB Atlas database or another MongoDB connection
- OAuth credentials if Google/GitHub sign-in is required

### 1. Clone the repository

```bash
git clone https://github.com/tamanna141101/Bazar_Dor.git
cd Bazar_Dor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the required values:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000

AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
```

Replace the placeholder values with your own credentials. Configure Google and GitHub OAuth applications if you want to enable social sign-in.

**Never commit `.env.local` or expose database passwords and OAuth secrets.**

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build the application

```bash
npm run build
```

## 🌐 Deployment

The application can be deployed to Vercel or another platform that supports Next.js.

Before deployment:

- Configure all required environment variables.
- Allow the deployment environment to connect to MongoDB.
- Configure OAuth callback URLs for the production domain.
- Test authentication, protected product details, page refreshes, and responsive layouts.

**Live Demo:** Add your deployed application URL here.

## 📦 Repository

[GitHub Repository — Bazar_Dor](https://github.com/tamanna141101/Bazar_Dor)

---

Built with Next.js, TypeScript, Tailwind CSS, Better Auth, and MongoDB.
