# ADR-001: Architecture decisions
- SPA (React/Vite) on Vercel + Firebase backend; admin code lazy-loaded.
- Sensitive logic (pricing, orders, coupons, loyalty, inventory, claims) only in Cloud Functions.
- Money = integer piasters. Orders store snapshots. Cart holds intent only.
- Contact data in orders/{id}/private/contact. Flat delivery fee (3000) in settings/public.
- Roles via Custom Claims; client guards are UX only.
- Manual order confirmation by default. Cash on delivery first.
