# 🏢 Society Management — Next.js Website

A complete society management web application built with **Next.js 14** (App Router).

---

## Pages Included

| Route | Description |
|---|---|
| `/` | Login page (demo: admin@sunrise.in / admin123) |
| `/dashboard` | Overview — stats, charts, announcements, meetings |
| `/tenants` | Tenant management — add, search, view profiles |
| `/maintenance` | Monthly maintenance records — mark paid, export |
| `/announcements` | Post & manage society notices — pin, filter |
| `/meetings` | Schedule & track AGMs and meetings |
| `/gallery` | Photo albums for society events |
| `/payments` | UPI/Razorpay payments — full payment history |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 3. Login
- **Email:** admin@sunrise.in  
- **Password:** admin123

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Custom CSS (globals.css) — no Tailwind needed |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | DM Sans (Google Fonts) |
| Hosting | Vercel (recommended) |

---

## Deploy to Vercel (Free)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for auto-deployments.

---

## Adding a Real Backend

Replace the mock data in `src/lib/data.js` with API calls:

```js
// Example: fetch tenants from your API
const res = await fetch('/api/tenants');
const tenants = await res.json();
```

### Recommended backend options:
- **Supabase** — PostgreSQL + Auth + Storage (free tier)
- **Firebase** — Firestore + Auth + Notifications
- **PlanetScale** — MySQL with free tier

---

## Razorpay Integration

1. Create account at [razorpay.com](https://razorpay.com)
2. Get your API keys
3. Add to `.env.local`:
```
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_SECRET=xxxx
```
4. Install: `npm install razorpay`

---

## Project Structure

```
src/
├── app/
│   ├── layout.js          # Root layout with Sidebar + TopBar
│   ├── page.js            # Login page
│   ├── dashboard/page.js  # Dashboard
│   ├── tenants/page.js    # Tenant management
│   ├── maintenance/page.js# Maintenance records
│   ├── announcements/page.js # Announcements
│   ├── meetings/page.js   # Meeting scheduler
│   ├── gallery/page.js    # Photo gallery
│   └── payments/page.js   # Payment tracking
├── lib/
│   └── data.js            # Mock data (replace with API calls)
└── styles/
    └── globals.css        # Global design system
```

---

## Customise for Your Society

Edit `src/lib/data.js`:
```js
export const SOCIETY = {
  name: "Your Society Name",
  address: "Your Address",
  totalFlats: 48,
  wings: ["A", "B", "C"],
  secretary: "Secretary Name",
  email: "secretary@yoursociety.in",
};
```

---

## Next Steps: Mobile App

Once the website is live, the same backend can power an iOS + Android app built with **React Native (Expo)**. All the screens are ready to be ported.

---

Built with ❤️ for Indian housing societies.
