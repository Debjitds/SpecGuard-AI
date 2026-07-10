# SpecGuard AI

> A Neo-Brutalist **PRD review workspace** that helps teams catch requirement
> gaps, reduce ambiguity, and export structured engineering-review findings
> _before_ a single line of code is written.

Built for a hackathon. Upload a PRD (or load a demo), let **Gemini AI**
analyze it, inspect findings, mark issues as **accepted / ignored / resolved**,
and export an audit report (PDF / Markdown / JSON).

---

## ✨ Features

- **Landing page** — hero, core capabilities, footer (no pricing, no fluff).
- **Auth** — email + password only (login / sign up / logout). No OAuth, no
  forgot-password.
- **Dashboard = the analysis surface.** No separate analysis page. Everything
  lives inside the dashboard:
  - Project overview + project switcher (sidebar)
  - **Upload PRD** CTA + **Load Demo Project** modal (5 demos)
  - Version timeline (`v1.0` → `v1.1` → … → current draft)
  - Summary cards: Completeness · Ambiguity · Testability · Consistency
  - Issue breakdown (critical / major / minor)
  - **What to Fix First** (prioritized critical & major findings)
  - **Analysis Workspace** — scrollable PRD viewer + Review Queue sidebar
  - **Engineering Review** panel (progress, category breakdown)
  - **Export** section (PDF / Markdown / JSON)
- **AI analysis** — Gemini identifies ambiguity, missing acceptance criteria,
  inconsistent flows, missing permissions, weak edge cases, testability risks,
  and unclear requirements.
- **Engineering review** — accept / ignore / resolve each finding.

## 🎨 Design

Neo-Brutalism: warm cream background (`#F5F2ED`), thick black borders (3–4px),
hard shadows (4–8px), bold accent colours (coral, teal, lavender, yellow,
mint), Inter 500–900. Matches the Stitch design assets in `docs/`.

## 🧰 Tech stack

| Layer    | Choice                                   |
| -------- | ---------------------------------------- |
| Build    | Vite + React + TypeScript                |
| Styling  | Tailwind CSS + shadcn-style primitives   |
| Auth/DB  | Supabase (Auth + Postgres)               |
| AI       | Google Gemini (`@google/generative-ai`)  |
| Routing  | react-router-dom                         |

## 🚀 Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

That's it — **no environment variables required.** The app runs out of the box
using a local (browser) backend and a built-in deterministic analyzer, so every
flow works for a demo.

### Optional: enable Supabase + Gemini

1. Copy `.env.example` → `.env` and fill in values.
2. Create the database by running `supabase/schema.sql` in the Supabase SQL
   editor (Project → SQL Editor → paste → Run).
3. Restart `npm run dev`.

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_GEMINI_API_KEY=...
```

When set, the app automatically switches from "Local DB / Built-in AI" to
"Supabase / Gemini" (see the chips in the dashboard sidebar).

## 🧪 Scripts

```bash
npm run dev       # start dev server
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run typecheck # tsc only
```

## 📂 Project structure

```
src/
├── components/
│   ├── dashboard/      # Sidebar, AnalysisWorkspace, ReviewItem, panels, dialogs
│   └── ui/             # button, card, dialog, input, label, tabs, chip
├── context/            # AuthContext, DashboardContext
├── data/               # 5 demo PRDs
├── lib/
│   ├── analyzer/       # Gemini + local fallback analyzer
│   ├── config.ts       # env-based feature flags
│   ├── store.ts        # Supabase + localStorage data store
│   ├── supabase.ts     # client
│   └── export.ts       # PDF / Markdown / JSON report generation
├── pages/              # LandingPage, AuthPage, DashboardPage
└── types/              # shared domain types
```

## 🎬 Demo story

1. Open the landing page → click **Get Started**.
2. Sign up (any email/password — local mode needs no confirmation).
3. On the dashboard click **Load Demo Project** → pick e.g. *Banking App*.
4. Click **Run Analysis** → findings populate the Review Queue + summary cards.
5. Inspect findings, mark some as **Accept / Ignore / Resolve**.
6. Click **Export → PDF/Markdown/JSON**.

## 📄 Docs

The `docs/` folder is the single source of truth: `prd.md` (product scope) and
the Stitch design assets (visual style, layout, components).

---

© 2026 SpecGuard AI. Built for engineers.
