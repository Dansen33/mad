# wellcomp Webshop (Next.js + Sanity + Stripe)

## Mi ez?
Teljes stack alapok a használt laptop webshophoz: Next.js (App Router) + Tailwind, TanStack Query, Sanity CMS (termékek/hero/blog), Stripe Checkout, NextAuth (email/Google/Apple), kosár cookie alapján.

## Fő stack
- Next.js 16 (App Router, TS)
- Tailwind CSS
- TanStack Query (client data fetching)
- Sanity CMS (tartalom + termékek)
- Stripe Checkout
- NextAuth (email + Google/Apple)
- Seedelt Sanity tartalmak

## Mappastruktúra (fontosabbak)
- `src/app/page.tsx` – landing/prod oldal UI (jelenleg statikus mock, API-ra köthető)
- `src/app/api/cms/products` – Sanity termékek (szűrés, q keresés)
- `src/app/api/cms/products/[slug]` – Sanity termék részletes
- `src/app/api/cms/blog` – blog lista (Sanity)
- `src/app/api/cms/blog/[slug]` – blog részletes (Sanity)
- `src/app/api/cms/hero` – hero + featured termék (Sanity siteSettings)
- `src/app/api/stripe/*` – checkout és webhook
- `src/app/api/auth/[...nextauth]` – NextAuth
- `src/app/api/user/address` – címkezelés
- `src/app/api/orders` – rendelés Sanity-be
- `src/app/layout.tsx` – globális layout + TanStack Query provider
- `.env` – Sanity/Stripe/NextAuth kulcsok

## Setup és futtatás
```bash
cd /Users/danielszalai/Desktop/webshop/app
npm install
npm run dev                          # fejlesztői szerver
```

## API endpointok (most)
- `GET /api/cms/products?q=&category=&limit=` – lista képekkel, opcionális kereséssel (case-insensitive).
- `GET /api/cms/products/[slug]` – termék részletesen.
- `GET /api/cms/blog` + `/api/cms/blog/[slug]` – blog lista/részletes.
- `GET /api/cms/hero` – hero slide-ok + featured termék.
- `POST /api/stripe/checkout` és webhook – Stripe fizetés.
- `GET/POST/PATCH /api/user/address` – címek kezelése.
- `GET/POST /api/orders` – rendelések Sanity-be.

## Következő lépések (ajánlás)
1) Sanity-ben tartsd karban a `siteSettings` (heroSlides, featuredProduct), termékeket, blogot.
2) Stripe élesítés: éles kulcsok, webhook a prod domainre.
3) Auth: Google/Apple OAuth cred beállítása a NextAuth-ban.
4) Végleges mobil UX teszt (nav, szűrők, checkout).

## Következő lépések (ajánlás)
1) Frontend: `page.tsx` statikus listák helyett TanStack Query hívások az /api/products és /api/blog felé.
2) Kosár API + Zustand store: `POST /api/cart/items` stb. és drawer UI összekötése.
3) Auth (NextAuth) + sessionhez kötött kosár.
4) MySQL/Postgres átállás éles környezetre, majd fizetési integráció (Stripe/Barion).
