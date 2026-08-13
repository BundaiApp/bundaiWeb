# Bundai Web

Web app for [Bundai](https://bundai.app) — the Japanese-learning iOS app. Connected to the GraphQL backend at `api.bundai.app` (Node/Apollo on a Raspberry Pi, exposed via Cloudflare Tunnel). Serves as both a marketing site and a full dashboard with SRS, kanji browsing, quizzes, and anime vocabulary.

Part of the Bundai ecosystem (`~/projects/bundai` iOS app, `~/projects/server` GraphQL backend on Pi, `~/projects/bundaiExtension`).

## Stack

- React 19 + Vite 6
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router v7
- Apollo Client v4 → GraphQL API at `api.bundai.app/graphql`
- PostHog analytics (`src/lib/posthog.js`)
- Paddle checkout for subscriptions (`src/lib/paddle.js`, `src/components/PricingPlans.jsx`)

## Routes

### Public (frontend-only)
| Path | Page |
|------|------|
| `/` | Landing page (hero, App Store CTA, mobile preview, footer) |
| `/pricing` | Pricing plans + Paddle checkout |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/refund` | Refund Policy |

### Auth
| Path | Page |
|------|------|
| `/login` | Login (GraphQL mutation) |
| `/signup` | Sign up (GraphQL mutation) |
| `/forgot-password` | Forgot password (GraphQL mutation) |

### Dashboard (auth-gated, wrapped in DashboardLayout + Sidebar)
| Path | Page |
|------|------|
| `/dashboard` | Dashboard home (kanji categories, anime words) |
| `/dashboard/quiz` | Local quiz (JLPT + kana only) |
| `/dashboard/srs` | SRS study/review queues |
| `/dashboard/srs-engine` | SRS review engine |
| `/dashboard/study-engine` | Study engine |
| `/dashboard/srs-review` | SRS review |
| `/dashboard/kanji-template` | Kanji browsing (JLPT, stroke, grade) |
| `/dashboard/kanji-detail` | Kanji detail |
| `/dashboard/levels` | Level list |
| `/dashboard/level-details` | Level detail |
| `/dashboard/level-test` | Level test |
| `/dashboard/anime-list` | Anime list |
| `/dashboard/anime-words` | Anime words |
| `/dashboard/anime-detail` | Anime detail |
| `/dashboard/settings` | Settings |
| `/dashboard/delete-account` | Delete account |

All routes defined in `src/App.jsx`. Dashboard pages are lazy-loaded. Public pages are eager-loaded.

## Getting Started

```bash
yarn install
yarn dev       # http://localhost:5173
```

### Environment

Copy `.env.example` to `.env`. Required:

| Variable | Purpose |
|----------|---------|
| `VITE_GRAPHQL_URL` | GraphQL API endpoint (`https://api.bundai.app/graphql`) |
| `VITE_PADDLE_ENV` | Paddle environment (`sandbox` / `production`) |
| `VITE_PADDLE_CLIENT_TOKEN` | Paddle client-side token |
| `VITE_PADDLE_MONTHLY_PRICE_ID` | Monthly plan price ID |
| `VITE_PADDLE_YEARLY_PRICE_ID` | Yearly plan price ID |
| `VITE_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `VITE_PUBLIC_POSTHOG_HOST` | PostHog API host |
| `VITE_SKIP_AUTH_REDIRECTS` | Skip auth redirects in dev (`true` / `false`) |

## Scripts

```bash
yarn dev       # start dev server
yarn build     # production build to dist/
yarn preview   # preview the production build
yarn lint      # eslint
```

## Deployment

Deployed to Netlify (`netlify.toml`): builds `npm run build`, publishes `dist/`, SPA redirect `/*` → `/index.html`.

## Architecture

### Code splitting
All dashboard pages are lazy-loaded via `React.lazy()`. The landing page, pricing, and legal pages are eager-loaded (small).

### JLPT data (`src/util/jlpt/`)
Kanji data is split by JLPT level into separate JSON files, loaded on demand:
- `n5.json` (~492 KB, 79 kanji) — loaded first for beginners
- `n4.json` (~685 KB, 166 kanji)
- `n3.json` (~1.1 MB, 367 kanji)
- `n2.json` (~550 KB, 367 kanji)
- `n1.json` (~1.0 MB, 1,232 kanji)

Loader: `src/util/jlpt/index.js` exports `loadLevel(n)`, `loadLevelsUpTo(n)`, `loadAllLevels()`.

### Auth
- `src/lib/auth.js` — token management, localStorage helpers
- `src/lib/apolloClient.js` — Apollo Client with Bearer token injection
- Auth pages: login, signup, forgot password (use GraphQL mutations)
- DashboardLayout checks auth and redirects to `/` if not logged in

### Analytics
PostHog is integrated via `src/lib/posthog.js` — a `posthog-js` singleton initialized from `VITE_PUBLIC_POSTHOG_KEY` / `VITE_PUBLIC_POSTHOG_HOST`. `posthog.identify` runs on login + signup (distinctId = user id, with email + name); `posthog.captureException` wraps the critical catch blocks (login, signup, Android waitlist form).

Verified events in code:

| Event | File |
|---|---|
| `site entry viewed` | `src/App.jsx` (SiteEntryTracker — fires once per visit) |
| `landing page viewed` | `src/pages/landingPage.screen.jsx` |
| `landing cta clicked` | `src/pages/landingPage.screen.jsx` (with `destination`) |
| `user signed up` | `src/pages/signup.screen.jsx` |
| `user logged in` | `src/pages/login.screen.jsx` |
| `kanji category browsed` | `src/pages/dashboard.screen.jsx` |
| `review session completed` | `src/pages/srsEngine.screen.jsx` |

PostHog project: **371511** (US). A skill for PostHog server-side (Node) integration lives at `.claude/skills/integration-javascript_node/`.

> The old `posthog-setup-report.md` was removed; its useful contents (project id, integration facts) are folded in here. The report's event table was partly aspirational — the table above is the code-verified list.

## Deleted features (kept for reference)

These were removed during the static→server reconnection:
- **KanjiSwap** — kanji compound word builder with drag-and-drop
- **Kanji Trap (similars)** — visually similar kanji comparison (sidebar link removed, page files deleted)

## Legacy files

`src/graphql/`, `src/lib/apolloClient.js`, `src/lib/auth.js`, `src/layouts/DashboardLayout.jsx`, `src/components/Sidebar.jsx` were legacy files that have been re-enabled and are now active.
