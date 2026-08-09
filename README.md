# Bundai Web

Static, server-less marketing site for [Bundai](https://bundai.app) — the Japanese-learning iOS app. It is frontend-only: no backend, no API, no auth. It exists to convert visitors into App Store downloads and drive Paddle subscriptions.

Part of the Bundai ecosystem (`~/projects/bundai` iOS app, `~/projects/server` legacy backend, `~/projects/bundaiExtension`). Like the iOS app, this site has no link to `api.bundai.app`.

## Stack

- React 19 + Vite 6
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router v7
- PostHog analytics (`src/lib/posthog.js`)
- Paddle checkout for subscriptions (`src/lib/paddle.js`, `src/components/PricingPlans.jsx`)
- No Apollo / GraphQL usage in the live app

## Routes

| Path | Page |
|------|------|
| `/` | Landing page (hero, App Store CTA, mobile preview, footer) |
| `/pricing` | Pricing plans + Paddle checkout |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/refund` | Refund Policy |

All routes are defined in `src/App.jsx`. Unknown paths fall back to the landing page.

## Getting Started

```bash
yarn install   # or npm install
yarn dev       # http://localhost:5173
```

### Environment

Copy `.env.example` to `.env`. The live app needs:

| Variable | Purpose |
|----------|---------|
| `VITE_PADDLE_ENV` | Paddle environment (`sandbox` / `production`) |
| `VITE_PADDLE_CLIENT_TOKEN` | Paddle client-side token |
| `VITE_PADDLE_MONTHLY_PRICE_ID` | Monthly plan price ID |
| `VITE_PADDLE_YEARLY_PRICE_ID` | Yearly plan price ID |
| `VITE_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `VITE_PUBLIC_POSTHOG_HOST` | PostHog API host |

`VITE_SKIP_AUTH_REDIRECTS` and `VITE_GRAPHQL_URL` are legacy leftovers from the old server-backed app and are not used by the current routes.

## Scripts

```bash
yarn dev       # start dev server
yarn build     # production build to dist/
yarn preview   # preview the production build
yarn lint      # eslint
```

## Deployment

Deployed to Netlify (`netlify.toml`): builds `npm run build`, publishes `dist/`, SPA redirect `/*` → `/index.html`.

## Analytics

PostHog events fired by the live app:

- `site entry viewed`
- `landing page viewed`
- `landing cta clicked` (with `destination` property)
- Paddle checkout events (`checkout started`, `checkout completed`) in `PricingPlans.jsx`

## Notes

`src/pages/`, `src/graphql/`, `src/lib/apolloClient.js`, `src/lib/auth.js`, `src/layouts/DashboardLayout.jsx`, and `src/components/Sidebar.jsx` contain legacy dashboard/kanji/SRS code from the old server-backed version. They are **not referenced** by `src/App.jsx` and are safe to delete.
