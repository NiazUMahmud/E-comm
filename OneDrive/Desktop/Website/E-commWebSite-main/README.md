# EComm — Full-Stack E-Commerce Platform

A production-ready e-commerce web application built with **React 18**, **TypeScript**, **Supabase**, **Stripe**, and **Netlify**. Supports product browsing, authenticated checkout, order tracking, and a full admin dashboard.

**Live site:** https://ecommnexora.netlify.app

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Environment Variables](#environment-variables)
6. [Local Development Setup](#local-development-setup)
7. [Supabase Setup](#supabase-setup)
8. [Stripe Setup](#stripe-setup)
9. [Netlify Deployment](#netlify-deployment)
10. [Serverless Functions](#serverless-functions)
11. [Security](#security)
12. [SEO & AI Discovery](#seo--ai-discovery)
13. [Session Management](#session-management)
14. [Pages & Routes](#pages--routes)

---

## Features

### Storefront
- Product catalog with category and subcategory navigation
- Full-text search across product name, description, and tags
- Filter by category, featured items, and sale deals
- Sort by relevance, price (low/high), rating, and newest
- Grid and list view toggle
- Product detail page with image gallery, specifications, and stock status
- Related product recommendations

### Shopping & Checkout
- Persistent shopping cart (React Context)
- Multi-step checkout: shipping address → Stripe payment
- Server-side price verification — client cannot manipulate totals
- 8% tax applied server-side in the Netlify function
- Stripe PaymentElement (card, Apple Pay, Google Pay)
- Order confirmation page with order ID

### Authentication
- Email/password sign-up and sign-in via Supabase Auth
- Email confirmation required on registration
- Role-based access control: `user` and `admin` roles
- Protected routes for checkout, profile, and admin
- 30-minute inactivity timeout with 2-minute warning modal
- 8-hour absolute maximum session length

### User Profile
- Order history with status badges
- Order detail view (items, amounts, shipping address)

### Admin Dashboard
- Stats cards: total revenue, orders, products, and customers
- Product management: create, edit, delete with multi-image upload
- Images stored in Supabase Storage (`product-images` bucket)
- Order management: view all orders, update status
- Role-protected — only users with `role = 'admin'` can access

### Payments & Webhooks
- Stripe webhook with cryptographic signature verification
- `payment_intent.succeeded` → order status set to `processing`
- `payment_intent.payment_failed` → order status set to `cancelled`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v7 |
| Icons | Lucide React |
| SEO | react-helmet-async |
| Backend / Database | Supabase (PostgreSQL + RLS) |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| Payments | Stripe (PaymentElement) |
| Serverless functions | Netlify Functions (Node.js) |
| Hosting | Netlify |

---

## Project Structure

```
E-commWebSite-main/
│
├── netlify/
│   └── functions/
│       ├── create-payment-intent.js   # Creates Stripe PaymentIntent (server-side price check)
│       └── stripe-webhook.js          # Handles Stripe events with signature verification
│
├── public/
│   ├── robots.txt                     # Crawler rules + AI bot permissions
│   ├── sitemap.xml                    # All public routes with priority weights
│   └── llms.txt                       # AI-readable site guide (GPT, Claude, Perplexity)
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx     # Wraps routes requiring auth or admin role
│   │   ├── layout/
│   │   │   ├── Header.tsx             # Nav bar, search, cart icon, admin button
│   │   │   ├── Footer.tsx             # Links, contact info, Terms/Privacy
│   │   │   └── CategoryMenu.tsx       # Dropdown category navigation
│   │   ├── products/
│   │   │   ├── ProductCard.tsx        # Product tile (grid and list variants)
│   │   │   └── ProductFilters.tsx     # Sidebar filter panel
│   │   └── ui/
│   │       └── Toaster.tsx            # Global toast notification component
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx            # Auth state, login/logout, session warning modal
│   │   └── CartContext.tsx            # Cart state, add/remove/update quantities
│   │
│   ├── hooks/
│   │   ├── useProducts.ts             # Fetch products list and single product
│   │   ├── useOrders.ts               # Fetch user orders and admin all-orders
│   │   └── useSessionTimeout.ts       # Inactivity + max-age session enforcement
│   │
│   ├── lib/
│   │   ├── supabase.ts                # Supabase client initialisation
│   │   └── database.types.ts          # Generated Supabase TypeScript types
│   │
│   ├── pages/
│   │   ├── HomePage.tsx               # Hero, featured products, categories
│   │   ├── ProductsPage.tsx           # Product listing with filters and sort
│   │   ├── ProductDetailPage.tsx      # Single product view + add to cart
│   │   ├── CartPage.tsx               # Cart review + order summary
│   │   ├── CheckoutPage.tsx           # Shipping form + Stripe PaymentElement
│   │   ├── CheckoutSuccessPage.tsx    # Post-payment confirmation
│   │   ├── ProfilePage.tsx            # Order history and account info
│   │   ├── TermsPage.tsx              # Terms of Service
│   │   ├── PrivacyPage.tsx            # Privacy Policy
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx     # Stats, product CRUD, order management
│   │   └── auth/
│   │       ├── LoginPage.tsx          # Sign-in form
│   │       └── RegisterPage.tsx       # Registration form with email confirmation
│   │
│   ├── types/
│   │   └── index.ts                   # Shared TypeScript interfaces
│   │
│   ├── data/
│   │   └── mockData.ts                # Fallback seed data (used only when DB is empty)
│   │
│   ├── App.tsx                        # Root component with router and all routes
│   ├── main.tsx                       # React entry point, HelmetProvider wrapper
│   ├── index.css                      # Tailwind directives and global styles
│   └── vite-env.d.ts                  # Vite env type declarations
│
├── supabase/
│   ├── schema.sql                     # Complete database schema + seed data
│   ├── schema_part1.sql               # Profiles, categories, subcategories
│   ├── schema_part2.sql               # Products, orders, order_items
│   └── schema_part3.sql               # Storage bucket policies
│
├── index.html                         # HTML shell with JSON-LD + og: meta tags
├── netlify.toml                       # Build config, redirects, security headers
├── tailwind.config.js                 # Tailwind theme configuration
├── vite.config.ts                     # Vite build configuration
├── tsconfig.json                      # TypeScript compiler options
├── .env.example                       # Template for required environment variables
└── package.json                       # Dependencies and scripts
```

---

## Database Schema

All tables live in the `public` schema with **Row Level Security (RLS)** enabled.

```
auth.users  (Supabase managed)
    │
    ├── profiles          id, email, name, role ('user'|'admin'), avatar_url
    │
    ├── categories        id, name, slug, icon
    │   └── subcategories id, category_id, name, slug
    │
    ├── products          id, name, description, price, original_price,
    │                     images[], category, subcategory, brand, stock,
    │                     rating, review_count, featured, tags[], specifications{}
    │
    └── orders            id, user_id, status, subtotal, tax, shipping, total,
        │                 shipping_address{}, stripe_payment_intent_id
        └── order_items   id, order_id, product_id, name, price, quantity, image
```

### RLS Summary

| Table | Public read | User write | Admin full access |
|---|---|---|---|
| `profiles` | No | Own row only | Yes |
| `categories` | Yes | No | Yes |
| `subcategories` | Yes | No | Yes |
| `products` | Yes | No | Yes |
| `orders` | No | Own rows only | Yes |
| `order_items` | No | Own order rows | Yes |

### Key Database Functions

```sql
-- SECURITY DEFINER — bypasses RLS to avoid infinite recursion
public.is_admin() → boolean

-- Trigger: auto-creates profile row on auth.users INSERT
public.handle_new_user()
```

### Storage

| Bucket | Policy |
|---|---|
| `product-images` | Public read; admin-only upload/delete |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values.

```env
# ── Supabase ──────────────────────────────────────────────────
# Project Settings → API in https://app.supabase.com
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# ── Stripe (frontend) ─────────────────────────────────────────
# https://dashboard.stripe.com/apikeys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ── Stripe + Supabase (Netlify Functions only — never in VITE_) ─
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...        # From Stripe webhook endpoint settings
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... # Project Settings → API → service_role
```

> **Never** expose `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, or `SUPABASE_SERVICE_ROLE_KEY` to the browser. Variables without the `VITE_` prefix are only available inside Netlify Functions.

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project (free tier works)
- A Stripe account (test mode)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/NiazUMahmud/E-comm.git
cd E-comm

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_STRIPE_PUBLISHABLE_KEY

# 4. Start the development server
npm run dev
# App runs at http://localhost:5173
```

To also run Netlify Functions locally (required for checkout):

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Run with functions support (port 8888)
netlify dev
```

Add the remaining server-only keys to your `.env` before running `netlify dev`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

---

## Supabase Setup

1. Create a new project at [app.supabase.com](https://app.supabase.com).
2. In **SQL Editor**, run the contents of `supabase/schema.sql` — this creates all tables, RLS policies, triggers, and seed data.
3. In **Storage**, create a bucket named `product-images` with **Public** access.
4. Add the following storage policies in the SQL Editor:

```sql
-- Allow admins to upload product images
create policy "Admins can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' AND public.is_admin());

-- Allow admins to delete product images
create policy "Admins can delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' AND public.is_admin());
```

5. To promote an account to admin, run in SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'your@email.com';
```

---

## Stripe Setup

### Test Mode Keys

1. Go to [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
2. Copy **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → `STRIPE_SECRET_KEY`

### Webhook Endpoint

1. Go to **Developers → Webhooks → Add endpoint**.
2. URL: `https://ecommnexora.netlify.app/.netlify/functions/stripe-webhook`
3. Events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### Test Cards

| Scenario | Card number |
|---|---|
| Successful payment | `4242 4242 4242 4242` |
| Card declined | `4000 0000 0000 0002` |
| Requires authentication | `4000 0025 0000 3155` |

Use any future expiry, any 3-digit CVC, and any 5-digit ZIP.

---

## Netlify Deployment

The project is configured for automatic deployment from GitHub.

### First-Time Deployment

1. Push the repository to GitHub.
2. In [app.netlify.com](https://app.netlify.com), click **Add new site → Import from Git**.
3. Select the repository.
4. Build settings are pre-configured in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
5. In **Site configuration → Environment variables**, add all six environment variables.
6. Trigger a new deploy.

### Subsequent Deployments

Every push to `main` triggers an automatic Netlify build and deploy.

---

## Serverless Functions

### `POST /.netlify/functions/create-payment-intent`

Creates a Stripe PaymentIntent. Prices are fetched server-side from Supabase — the client cannot manipulate the order total.

**Request headers:**
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

**Request body:**
```json
{
  "items": [{ "id": "<product_uuid>", "quantity": 2 }],
  "currency": "usd"
}
```

**Response:**
```json
{ "clientSecret": "pi_xxx_secret_xxx" }
```

**Server-side validations:**
- Auth token required (401 if missing)
- Product IDs verified against the database
- Quantities must be integers between 1 and 100
- Total must be between $0.50 and $99,999
- Currency must be one of: `usd`, `eur`, `gbp`, `cad`, `aud`
- Tax (8%) applied server-side only

---

### `POST /.netlify/functions/stripe-webhook`

Receives Stripe events and updates order status in Supabase using the service role key (bypasses RLS for system-level updates).

**Event handling:**

| Stripe event | Order status |
|---|---|
| `payment_intent.succeeded` | `processing` |
| `payment_intent.payment_failed` | `cancelled` |

Stripe webhook signature is verified with `stripe.webhooks.constructEvent()` before any processing occurs. Requests with invalid or missing signatures are rejected with `400`.

---

## Security

### Implemented Measures

| Area | Implementation |
|---|---|
| **Row Level Security** | All Supabase tables have RLS enabled — users can only access their own data |
| **Admin access control** | `is_admin()` SECURITY DEFINER function prevents privilege escalation via RLS recursion |
| **Price integrity** | Server-side price fetching in `create-payment-intent` — client-supplied prices are ignored entirely |
| **Webhook verification** | Stripe signature verified with `constructEvent()` before processing any event |
| **HTTP security headers** | `X-Frame-Options`, `X-Content-Type-Options`, `HSTS`, `Referrer-Policy`, `Permissions-Policy` via `netlify.toml` |
| **Content Security Policy** | Restricts scripts to `self` and `js.stripe.com`; blocks unauthorized connections |
| **Secret isolation** | `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` only exist in Netlify Functions — never bundled into the browser |
| **Session timeout** | 30-minute inactivity auto-logout; 8-hour absolute max session |
| **Auth page indexing** | Login/register/profile/cart/checkout pages are `noindex, nofollow` |

### Content Security Policy

```
default-src 'self';
script-src 'self' https://js.stripe.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https:;
font-src 'self' data:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com;
frame-src https://js.stripe.com https://hooks.stripe.com;
```

---

## SEO & AI Discovery

### Files

| File | Purpose |
|---|---|
| `public/robots.txt` | Allows all crawlers; explicitly permits GPTBot, Claude-Web, PerplexityBot; blocks `/admin`, `/checkout`, `/profile` |
| `public/sitemap.xml` | All public routes with priority weights and change frequency |
| `public/llms.txt` | Human-readable AI guide describing the site's categories, features, and page URLs |

### Per-Page Meta Tags

Every page uses `react-helmet-async` to inject:
- `<title>` — unique per page
- `<meta name="description">` — 150-character summary
- `<link rel="canonical">` — prevents duplicate content indexing
- Open Graph tags (`og:title`, `og:description`, `og:type`, `og:image`)
- `noindex, nofollow` on auth, cart, checkout, and profile pages

### JSON-LD Structured Data

| Page | Schema type |
|---|---|
| `index.html` | `Organization` + `WebSite` with `SearchAction` |
| Product detail | `Product` with `Offer` (price, availability) and `AggregateRating` |

---

## Session Management

Implemented entirely in the frontend — no Supabase Pro plan required.

**Files:** [src/hooks/useSessionTimeout.ts](src/hooks/useSessionTimeout.ts), [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)

### How It Works

Activity events tracked: `mousemove`, `mousedown`, `keydown`, `scroll`, `touchstart`, `click`

Timestamps stored in `sessionStorage` (cleared on tab close):
- `ecomm_last_active` — updated on every activity event
- `ecomm_session_start` — set once at login

A 30-second interval checks three conditions:

1. **Max session age** — if `now - session_start ≥ 8 hours` → force logout
2. **Inactivity** — if `now - last_active ≥ 30 minutes` → force logout
3. **Warning zone** — if inactive for ≥ 28 minutes → show warning modal with countdown

### Warning Modal

- Appears 2 minutes before timeout with a live `MM:SS` countdown
- **"Stay Logged In"** resets `ecomm_last_active` and dismisses the modal
- **"Log Out"** calls `supabase.auth.signOut()` immediately
- Any user activity (click, keypress, scroll, etc.) auto-dismisses the modal

---

## Pages & Routes

| Route | Page | Auth required | Admin only |
|---|---|---|---|
| `/` | Home — hero, featured products, categories | No | No |
| `/products` | Product listing with filters and sort | No | No |
| `/products/:id` | Product detail, image gallery, add to cart | No | No |
| `/cart` | Cart review and order summary | No | No |
| `/checkout` | Shipping address + Stripe payment | Yes | No |
| `/checkout/success` | Order confirmation | No | No |
| `/login` | Sign-in form | No | No |
| `/register` | Registration form | No | No |
| `/profile` | Order history and account info | Yes | No |
| `/admin/*` | Admin dashboard — products and orders | Yes | Yes |
| `/terms` | Terms of Service | No | No |
| `/privacy` | Privacy Policy | No | No |

---

## Available Scripts

```bash
npm run dev       # Start Vite dev server at http://localhost:5173
npm run build     # Production build output to /dist
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
netlify dev       # Dev server + Netlify Functions at http://localhost:8888
```

---

## License

This project is private. All rights reserved.
