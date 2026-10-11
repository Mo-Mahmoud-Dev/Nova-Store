# Nova Store

Nova Store is a frontend-only fashion e-commerce demo built with Vue. It presents a curated clothing, footwear, and accessories catalog, and lets visitors explore products and complete a simulated shopping flow.

## Live Demo

Visit the deployed store: [Nova Store Live Demo](https://mo-mahmoud-dev.github.io/Nova-Store/).

## Features

- Responsive storefront with home, product catalog, account, and informational pages.
- Catalog of 90 locally defined products across clothing, shoes, and accessories.
- Product filtering by department, new arrivals, and sale; tag filtering, title search, and sorting by price or name.
- Product quick view, with add-to-cart and wishlist actions.
- Shopping cart with quantity controls, voucher support, gift-wrap and order-note options, and an order summary.
- Checkout form with Egyptian governorates, standard or express delivery, cash-on-delivery or demo card entry, and client-side validation.
- Order confirmation, contact, privacy policy, and terms of service pages.
- Browser storage for the demo account, cart, wishlist, and most recent order.

## Technology

- [Vue 3](https://vuejs.org/) with Single-File Components
- [Vite](https://vite.dev/) for development and production builds
- [Vue Router](https://router.vuejs.org/) for client-side navigation
- [Pinia](https://pinia.vuejs.org/) for product, cart, wishlist, and order state
- SCSS for styling
- Ionicons loaded from a CDN

## Requirements

- Node.js `^22.18.0` or `>=24.12.0` (as specified in `package.json`)
- npm

## Getting Started

From the project directory, install dependencies and start the development server:

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload. |
| `npm run build` | Build the production site into `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run format` | Format files under `src/` with Prettier. |
| `npm run deploy` | Build the site and publish `dist/` using `gh-pages`. |

The Vite configuration sets the production base path to `/Nova-Store/`, which is intended for deployment to a GitHub Pages project site with that repository name.

## Project Structure

```text
src/
  assets/styles/   Global SCSS, variables, responsive rules, and popup styles
  components/      Navigation, footer, and reusable popup components
  data/            Local product catalog
  layouts/          Default storefront and authentication layouts
  router/           Route definitions and page-title handling
  stores/           Cart, wishlist, product, order, and demo-auth state
  views/             Home, catalog, cart, checkout, account, and other pages
public/              Static images and site assets
index.html           Application entry HTML
vite.config.js       Vite plugins, aliases, and deployment base path
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/products` | Product catalog |
| `/cart` | Shopping cart |
| `/wishlist` | Wishlist |
| `/checkout` | Checkout |
| `/order-confirmation` | Order confirmation |
| `/account` | Account |
| `/auth/Authentication` | Sign-in and account-creation demo |
| `/contact-us` | Contact form and store information |
| `/privacy-policy` | Privacy policy |
| `/terms-of-service` | Terms of service |

Legacy department paths (`/Man`, `/Woman`, `/Accessories`, and `/Sale`) redirect to the catalog with the corresponding filter.

## Demo Limitations

This repository contains a client-side demo and does not include a backend or external commerce service. Products are loaded from the local catalog in `src/data/products.js`. Sign-in and account creation are simulated, and checkout creates a local demo order; card details are not processed by a payment provider. Contact form submissions are not connected to a support service. Do not use real credentials or payment details with the demo.

Cart, wishlist, and demo account data are stored in the browser's `localStorage`. The most recent order is kept in `sessionStorage` for the confirmation page.
