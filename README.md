# E-Store — Modern Next.js E-Commerce App

A modern, full-stack **e-commerce platform** built with **Next.js (App Router)**, **MongoDB**, and **TypeScript**. It includes an elegant admin dashboard for managing products and a responsive storefront optimized for SEO and performance.

---

## Live Links  

- **Frontend (Vercel):** [https://ecommerce-task-12321.app](https://ecommerce-task-12321.app)   
- **GitHub Repository:** [https://github.com/Zayedmd12321/ecommerce](https://github.com/Zayedmd12321/ecommerce)

---

## Features

- **Full-Stack Next.js App** — App Router, API routes, and dynamic rendering
- **MongoDB Integration** — Real-time product and inventory management
- **Admin Dashboard** — Secure API routes for CRUD operations
- **Optimized Rendering** — Uses SSG, SSR, CSR, and ISR for the best user experience
- **Responsive UI** — Styled with Tailwind CSS and Lucide icons
- **Environment-based Configuration** — Easy setup for local and production environments

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js (LTS recommended)](https://nodejs.org/)
- npm (comes with Node.js)
- Access to a MongoDB instance (local or remote)

---

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/Zayedmd12321/ecommerce
cd ecommerce
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a file named `.env.local` in the root directory and add your environment-specific variables:

```bash
# Example .env.local content
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
ADMIN_API_KEY="your_admin_secret_key"
```

---

## Running the Project

### Start Development Server

```bash
npm run dev
```

The application will be accessible at **http://localhost:3000**

It includes **hot reloading** for faster development.

### Build for Production (optional)

```bash
npm run build
```

### Start Production Server (optional)

```bash
npm run start
```

---

## Database Setup

This project uses **MongoDB** as its primary database.

### Prerequisite
Ensure you have a running MongoDB instance.

### Connection
The app connects using the `MONGODB_URI` variable defined in `.env.local`.

### Data Seeding (optional)
If your project requires initial data, run the seeding script:

```bash
npm run seed
```

---

## Rendering Strategies

This project leverages **Next.js rendering strategies** for optimal performance and SEO.

| Page / Route         | Rendering Strategy | Rationale |
|----------------------|--------------------|------------|
| `/` (Homepage)       | **SSG (Static Site Generation)** | Static content that changes rarely — best performance and SEO |
| `/dashboard`         | **CSR (Client-Side Rendering)** | Personalized user data fetched dynamically |
| `/products/[slug]`   | **SSR (Server-Side Rendering)** | Frequently updated product data (pricing, stock, etc.) |
| `/blog`              | **ISR (Incremental Static Regeneration)** | Periodic updates (every 60s) for freshness without full rebuild |

---

## Project Structure

```
app/
 ├── api/               # API routes (server-side logic)
 ├── admin/             # Admin dashboard routes
 ├── products/          # Product detail pages
 ├── dashboard/         # Dashboard Page
 ├── layout.tsx         # Root layout and metadata
 └── page.tsx           # Homepage

lib/
 ├── data.ts            # Database interaction helpers
 └── mongodb.ts         # Connection to Db

models/
 └── Product.ts         # Mongoose schema for products

scripts/
 └── seed.ts         # Seeder function to feed sample-data to mongodb

public/
 ├── favicon.svg        # App favicon
 └── images/            # Static assets
```

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **MongoDB + Mongoose**
- **Lucide React Icons**
- **Vercel Hosting (optional)**

---

### Author

**Md Zayed Ghanchi**
🖥️ GitHub: [https://github.com/Zayedmd12321](https://github.com/Zayedmd12321)
📧 Email: [eagle.zayed@gmail.com](mailto:eagle.zayed@gmail.com)

---

> “Build fast. Sell smart. Scale infinitely.” — *E-Store Team*

