# Bundai — Plan

> Single source of truth for product direction + build. Pricing detail lives in `~/projects/bundaiPricing.md`.
> Supersedes the old `IMPLEMENTATION_PLAN.md` (removed — described the dead server-backed web app).

---

## 1. Strategic frame

**Bundai is a content company, not an app company.**

The evidence is in our own numbers:
- 31k followers, 6M views in 3 months — content traction competitors pay millions for.
- 10k reels done, 100k more producible for free, 3/day shipping — a content engine no app competitor has.
- 300 installs from 6M views (0.005%) — what happens when you ask *content consumers* to do an *app* thing (install → signup → pay).

Falou / Duolingo / Babbel / LingQ are software companies with generic lessons who buy distribution. **Our moat is the media→vocab→reel pipeline at a cost structure they can't match.** The product must match the distribution: sell the content where the attention already is.

The one product: **a subscription to the feed.** Sold on the web at the impulse moment. The app is the retention surface, not the paywall.

---

## 2. The product

- **A TikTok-style vertical feed of language reels from real media.** This is what the audience already proved it wants (6M views of exactly this).
- **One subscription, three cadences:** monthly / yearly / lifetime. The lifetime tier *is* the "pack" — it satisfies the one-time impulse-buy instinct inside one coherent product. No 100 SKUs.
- **"Packs" become content collections inside the one library** — Attack on Titan collection, K-drama collection, etc. They're reasons to stay subscribed, not separate products.

This is the Falou model plus one upgrade they lack: **a web surface that converts the 6M views without an install.** That difference is worth more than any app feature.

---

## 3. Surfaces & their jobs

| Surface | Role | Monetization |
|---|---|---|
| **Web (bundaiWeb)** | Acquisition + conversion. Free 5 reels → paywall → Paddle checkout. No install. PRIMARY. | Paywall after 5 reels |
| **iOS app (bundai)** | Retention. Pronunciation AI (`pronunciationScore.js` + Whisper), SRS, saved words. Free to download, gated by the same subscription + login. | Sub-gated on use |
| **Social (TikTok/Shorts/Reels)** | Top-of-funnel, stays free forever. | Free (acquisition) |
| **Extension** | Future — dual-subtitle YouTube player as a second content format (uses existing `bundaiExtension` tech). | Sub-gated |

The app is **not** given away — it's free to *download*, paid to *use*, gated by the same subscription. Its job is to reduce subscription churn (subscribers who use the app stay subscribed longer). That's where Falou's admired app/AI features earn their keep: retention, not acquisition.

---

## 4. Build phases

### Phase 0 — Web feed (this week, survival-critical)
Goal: unlock revenue from the existing 6M views/mo by killing the install step.
- [ ] Upload 10k reels to **Cloudflare R2** (decided). Bulk script (`rclone` / `wrangler r2` / S3 API).
- [ ] New route `/reels` on bundaiWeb (or make it the landing). Vertical TikTok-style feed.
- [ ] First 5 reels free, then paywall.
- [ ] Wire Paddle checkout (lib + env vars already exist). Three tiers.
- [ ] PostHog events: `reel viewed`, `paywall shown`, `checkout started`, `checkout completed`.
- No login required in Phase 0 (session/cookie entitlement is enough to ship).

### Phase 1 — Cross-surface entitlement (once cash flows)
Goal: one subscription works on web + app.
- [ ] **Server is already live** — Node/Apollo on Pi 1 (`bundai1`), MongoDB Atlas, public at `https://api.bundai.app/graphql` via Cloudflare Tunnel (see `~/projects/server/README.md`). It already has JWT auth, a `User` model with a `hasPaid` field, and a `me` query. So entitlement = add a Paddle webhook route (`POST /webhooks/paddle`, verify signature → set `hasPaid`) and expose `hasPaid` on `me` — per `bundaiExtension/PADDLE_IMPLEMENTATION_PLAN.md`. Not a new service. (An optional Go rewrite is sketched in `~/projects/server/goserver.md` — deferred unless a bottleneck appears.)
- [ ] Re-enable login in bundaiWeb + bundai app.
- [ ] App paywall checks the same entitlement (same account, same sub).
- [ ] Paddle sandbox → production cutover.

### Phase 2 — Scale content (the big-money ramp)
- [ ] More anime packs.
- [ ] **Korean** — skip anime, go K-drama / K-pop (bigger audience, no anime dependency).
- [ ] German / French / Turkish / Chinese — movies & series.
- [ ] YouTube dual-subtitle web player as a second content format (port `bundaiExtension` tech to web).

---

## 5. Survival → big-money math

With web feed + paywall after 5 reels (conservative):

| Step | Rate | Result |
|---|---|---|
| Viewers tapping to web | 1% | ~60k visits/mo |
| Subscribe at paywall | 1.5% | ~900 subs |
| @ $5/mo | — | **~$4,500/mo** |

Even at 1/5 = ~$900/mo (survival). The asymmetry is the whole story: views are huge, current conversion is ~0, so any funnel fix is material. The web feed *is* the funnel fix.

- $500/mo (survival) ≈ 100 subs @ $5.
- $10k/mo (target) ≈ 2,000 subs @ $5 — reachable as the audience + content scale.

---

## 6. Naming

**Do not rename now.** 31k followers + 6M views is brand equity in the Japanese niche; renaming throws it away mid-survival, and "soundlearning" is generic/forgettable. When expanding to Korean etc., keep Bundai as the Japanese vertical and launch sister brands; create a neutral umbrella parent *then*, not now.

## 7. Funding

**Do not raise now.** Survival mode + no revenue = worst leverage. The #1 risk isn't capital, it's proving the model (0.005% = unproven). Ship Phase 0 → get to $500–2k MRR → raise on leverage to fund multi-language content scale. Optional cheap lottery ticket: apply to a top accelerator (YC-style) in parallel — don't depend on it.

---

## 8. Open decisions

1. **Price anchor** — low ($5/mo) maximizes conversion of the 6M views (survival); higher (~$10/mo, Falou-level) maximizes revenue/user. Start low, raise later. → see `bundaiPricing.md`.
2. **Free reel count on web** — recommend **5** (urgency). Keep the 1000 as the free "sample" on social, not the web feed.
3. **Lifetime price** — recommend $79–99 (functions as the pack).

---

## 9. Changelog — bundaiWeb

### 2026-08-10 — Static → Server reconnection + JLPT data split

**Re-enabled server-backed features:**
- Reconnected Apollo Client to `api.bundai.app/graphql`
- Added `ApolloProvider` to `main.jsx`
- Re-enabled all 20+ dashboard routes in `App.jsx` (lazy-loaded)
- Re-enabled auth pages: login, signup, forgot password
- Re-enabled DashboardLayout + Sidebar with auth gate
- Added login/signup nav links to landing page (desktop + mobile)
- Fixed login/signup/forgot password CSS to use COLORS theme

**JLPT data split (6 MB → per-level lazy loading):**
- Split `src/util/jlptArray.js` (250K lines, 6 MB) into per-level JSON files
- Created `src/util/jlpt/` directory with `n1.json`–`n5.json` + async loader
- Removed dead code: `provideTopWordsData`, `getTopWords`, `provideData`, lodash dependency
- Updated `srs.screen.jsx` to load data async via `loadLevelsUpTo()`
- Updated `localQuiz.screen.jsx` to load data async via `loadLevel()`, removed strokes/grades tabs
- Removed `similars.screen.jsx`, `similarDetail.screen.jsx` (Kanji Trap — removed from UI)
- Removed `kanjiSwap.screen.jsx`, `kanjiSwapDetail.screen.jsx` (Kanji Swap — removed)
- Removed `lodash` from `package.json`

**Bundle size impact:**
- Landing page main bundle: 29 KB (unchanged)
- SRS page for N5 student: ~500 KB instead of 6 MB
- Quiz page for N5 student: ~500 KB instead of 6 MB
- Each JLPT level loads independently on demand

## 10. Deprecated / superseded

- `IMPLEMENTATION_PLAN.md` — **removed.** Described the dead server-backed web app (login/signup/dashboard + kanji-server work).
- `posthog-setup-report.md` — **removed.** Insights (PostHog project 371511, integration facts, skill folder) folded into `README.md` → Analytics. The report's event table was partly aspirational; the README now carries the code-verified list.
