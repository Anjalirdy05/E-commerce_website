# AR Shop – E-commerce Website

A modern, responsive e‑commerce frontend built with React and TailwindCSS. It includes product browsing, detailed pages, cart, checkout (demo), orders, wishlist, admin analytics, and a simple local-storage data layer.

## Demo Features
- Product listing with search and categories
- Product detail with gallery, rating, quantity stepper, Add to Cart and Buy Now
- Cart with quantity updates and totals
- Checkout form (demo payment) with order creation
- Orders listing with statuses
- Wishlist with local persistence
- Admin dashboard (analytics + product table)
- INR currency formatting across the app

## Tech Stack
- React + Vite
- TailwindCSS for styling
- lucide-react icons
- sonner toasts
- LocalStorage as a mock backend

## Project Structure
```
frontend/
  public/            # static assets and products.json
  src/
    components/      # Navbar, Footer, ProductCard, UI primitives
    pages/           # Home, Products, ProductDetail, Cart, Checkout, Orders, Wishlist, Admin
    services/        # data loader
  tailwind.config.js

tools/              # image utilities (optional for asset management)
```

## Getting Started
1. Install dependencies
   ```bash
   cd frontend
   npm install
   ```
2. Start dev server
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

## Data & Images
- Product data lives in `frontend/public/products.json`.
- Images are served from `frontend/public/images/`.
- Optional helper scripts in `tools/` assist with image setup.

## Buy Now Flow
- Available on product cards and product detail.
- Adds item to cart and navigates to Checkout directly.

## Notes
- This is a frontend-only demo. No real payments.
- LocalStorage is used for cart, wishlist, and orders.

## License
MIT
