# Carlos Vásquez — Portfolio

> Personal portfolio built with Next.js 16 (App Router) — projects, stack, and a contact form with real email delivery, no `mailto:` fallback.

![Hero](docs/screenshots/hero.png)

![Projects](docs/screenshots/proyectos.png)

[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://cfvasquez.dev)

---

## 🧩 Problem / Context

Personal portfolio to showcase experience as a Fullstack Developer (.NET, React/Next.js) with a focus on DevOps and applied AI. Replaces the static résumé with real case studies, production metrics (SOC, migrations, operational efficiency), and a contact channel that actually sends the message.

---

## 🛠️ Stack

| Layer           | Technology                                |
|-----------------|--------------------------------------------|
| Frontend        | Next.js 16 (App Router), React 19, TypeScript |
| Styling         | Tailwind CSS v4, Framer Motion            |
| Icons           | simple-icons, lucide-react                |
| Contact         | Resend (Route Handler, real email delivery) |
| Analytics       | Vercel Analytics + Speed Insights          |
| Deploy / Infra  | Vercel                                    |
| Package manager | pnpm                                      |

---

## 🏗️ Architecture

- App Router — one section per component in `components/`, assembled in `app/page.tsx`.
- The contact form doesn't use `mailto:` — it posts to `app/api/contact/route.ts`, which validates the data server-side and sends the actual email via Resend.
- Content (projects, experience, stack) lives as typed arrays inside each component — no CMS, no external fetch; it's a personal portfolio, updated via PR.

---

## 🧠 Technical challenges and decisions

- **Problem:** several stack icons (C#, Java) don't exist in `simple-icons`. → **Solution:** fall back to a 2-letter tag when `icon` is `null`. → **Why:** avoids breaking the build or showing an incorrect generic icon.
- **Problem:** Next.js 16 deprecated the `priority` prop on `next/image` in favor of `loading`/`preload`. → **Solution:** project cards use `loading="eager"` only on the featured card and the full-width one (the actual LCP candidates). → **Why:** this Next.js version ships breaking changes relative to the standard docs — you have to check `node_modules/next/dist/docs` before assuming behavior.
- **Problem:** the contact form needed to actually send the message, not depend on the visitor having a mail client configured. → **Solution:** a dedicated Route Handler + Resend, with server-side email and message-length validation. → **Why:** a `mailto:` as the only channel has a poor conversion rate.
- **Problem:** supporting Spanish/English without duplicating routes or per-language SEO indexing. → **Solution:** a client-side toggle with Context API + `localStorage` (no `next-intl`, no `/en` routes), and the current language travels in the body of `/api/contact` so error messages also come back in the right language. → **Why:** nobody finds a portfolio through organic search — they arrive via a direct link — so the multi-language SEO of a routed solution doesn't pay for itself.

---

## 🚀 Running it locally

```bash
git clone https://github.com/Carlou134/portfolio-nextjs.git
cd portfolio-nextjs
pnpm install
pnpm dev
```

Required environment variable (`.env.local`):

```
RESEND_API_KEY=your_resend_api_key
```

Open [http://localhost:3000](http://localhost:3000).

---

## ✅ Code quality

```bash
pnpm lint   # ESLint (next lint was removed in Next.js 16)
pnpm test   # Vitest + React Testing Library
```

Tests cover where the real logic lives, not static markup: contact form validation and submission (`app/api/contact/route.test.ts`), and the navbar's mobile menu (`components/Navbar.test.tsx`, `components/Contact.test.tsx`).
