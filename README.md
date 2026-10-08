# 🍜 TOKYO / طوكيو

Production-ready restaurant web app for a real Egyptian restaurant.

## ✨ Features

### Customer
- 🍕 Categorized menu (crepes, pizza, sandwiches, pasta)
- 🛒 Cart with variants & add-ons
- 💳 Two checkout flows: Cash on delivery / Online payment
- 📱 WhatsApp auto-message with order details + tracking link
- 🔍 Real-time order tracking
- 👤 Guest checkout

### Admin
- 🔐 Custom Claims based auth
- 📊 Real-time orders dashboard (with sound notifications)
- 🛠️ Full product management (create, edit, archive)
- ⚙️ Delivery settings management
- 🏷️ Order status transitions

## 🏗️ Tech Stack
- Vite + React 18 + React Router 6
- Tailwind CSS (RTL-first)
- Firebase (Firestore + Auth)
- Framer Motion + canvas-confetti
- Vercel

## 🚀 Setup
1. `npm install`
2. Copy `.env.example` → `.env.local` (fill Firebase config)
3. `node scripts/seed-firestore.mjs --yes` (first time)
4. `npm run dev`

## 🔐 Admin Setup
```bash
set GOOGLE_APPLICATION_CREDENTIALS=C:\secure\key.json
node scripts/set-admin.mjs your@email.com --role=owner
