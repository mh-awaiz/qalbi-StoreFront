# Qalbi Couture — Shopify Storefront API Edition

A Next.js 15 e-commerce site for Qalbi Couture, fully migrated from MongoDB to **Shopify Storefront API**.

## What Changed vs Previous Version

| Feature | Before | After |
|---|---|---|
| Product data | MongoDB (Mongoose) | Shopify Storefront API |
| Collections/Categories | MongoDB Category model | Shopify Collections |
| Product management | Custom admin panel | Shopify Admin Dashboard |
| Order storage | MongoDB Order model | In-memory store (per process) |
| Image uploads | Cloudinary | Shopify CDN |

> **Note on Orders:** Orders are stored in-memory per serverless process. They persist within a session but reset on cold starts. For production persistence, replace `lib/orders.js` with Supabase, PlanetScale, or any DB. Shopify also has its own order management if you want to use Shopify Checkout instead of Razorpay.

## Stack

- **Next.js 15** (App Router, Turbopack)
- **Shopify Storefront API** (GraphQL)
- **Razorpay** (payments)
- **Delhivery** (shipping)
- **Nodemailer / Gmail SMTP** (email)
- **Tailwind CSS v4**

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SHOPIFY_DOMAIN=yourstore.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
DELHIVERY_API_TOKEN=...
EMAIL_USER=info@yourstore.com
EMAIL_PASS=your_app_password
```

### 3. Shopify Setup

#### Enable Storefront API
1. Go to **Shopify Admin → Apps → Develop apps**
2. Create or open your app → **Configure Storefront API scopes**
3. Enable: `unauthenticated_read_products`, `unauthenticated_read_collections`, `unauthenticated_read_product_tags`
4. Copy the **Storefront API access token** → set as `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`

#### Tag featured products
To show products in the Featured section, add the tag `featured` to products in Shopify Admin.

#### Collection handles
Collection handles in Shopify (e.g. `dress-materials`, `pakistani-suits`) map directly to `/collections/[handle]` routes.

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
vercel --prod
```
Set all `.env.local` variables in Vercel → Project Settings → Environment Variables.

## Project Structure

```
app/
├── api/
│   ├── collections/          # Shopify collections list + products
│   ├── products/             # Shopify product search/filter
│   ├── payment/              # Razorpay order create + verify
│   ├── shipping/             # Delhivery pincode check + create shipment
│   ├── orders/               # Order fetch + email confirmation
│   ├── track-order/          # Order tracking
│   └── contact/              # Contact form email
├── products/[handle]/        # Product detail page
├── collections/[handle]/     # Collection listing page
├── shop/                     # All products with filters
├── checkout/                 # Checkout with Razorpay
├── cart/                     # Cart page
├── track-order/              # Order tracking page
└── ...static pages
lib/
├── shopify.js                # Storefront API client + normalizers
├── orders.js                 # In-memory order store
└── queries/products.js       # All GraphQL queries
```

## Delhivery Integration

- **Pincode check**: `/api/shipping/check-pincode?pincode=110001`
- **Shipment creation**: Triggered automatically after Razorpay payment verified
- **Tracking**: Available at `/track-order` using order number + phone

## Email Flow

1. Customer pays via Razorpay
2. Payment verified → Delhivery shipment created → confirmation email sent
3. Email includes: order number, items, delivery address, Delhivery waybill + tracking link
