# Design: Migrate ShirtScanner FE from React Router to Astro

Date: 2026-09-16
Status: Draft
Decisions locked with the user:
1. Rebuild the interactive search experience as a **single React island**.
2. Render target: **static output** (no Node/Vercel adapter runtime).
3. Providers page data: **client-side fetch at load** (per-visit freshness).

## 1. Context and Motivation

`shirtscanner-fe` is the frontend for ShirtScanner, a search engine that
aggregates sports-clothing products from multiple Chinese providers and streams
results to the client over Server-Sent Events (SSE).

The current stack is **React Router v7 (Remix-style SSR)**:

- `output: SSR`, `ssr: true` via `react-router.config.ts`
- Three routes in `app/routes/` (`_index`, `search`, `providers`), file-based
  routing via `@react-router/fs-routes`
- Server `loader` functions that read `process.env.SHIRTSCANNER_BE` and fetch
  from the backend; the search route additionally captures a PostHog event
  server-side
- Client shows a single `<Accordion>` of per-provider results fed by an SSE
  `EventSource` (`/v1/products/stream?q=`)
- shadcn/ui (Radix) + Tailwind v4 + lucide-react; PostHog browser analytics
- `@vercel/react-router` adapter; Playwright e2e deployed in CI
- Static assets including `public/sitemap-0.xml`, `robots.txt`

Client data flow (search route): the server `loader` returns the backend URL,
then a client `useEffect` opens `new EventSource(.../stream?q=)` and appends each
`ServerSearchEvent` to React state as it arrives, rendering progress and the
accordion of provider results live.

### Motivation for moving to Astro (user-confirmed: "all of the above")

- **Performance / bundle size**: ship HTML + CSS statically; only the search
  page carries a React island. Smaller JS payload and faster loads overall.
- **SEO / static content**: index, providers, 404 and sitemap become real
  static pages; better crawlability and CDN caching with no SSR runtime.
- **Simpler hydration model**: islands replace the full React Router SSR
  data/hydration machinery, reducing the SSRF-ish `SHIRTSCANNER_BE` backend URL
  exposure from a server loader to a client `import.meta.env` value.

## 2. Goals (Success Criteria)

1. **Full route parity** — `/`, `/search?q=...`, `/providers`, and the 404 page
   exist and behave as today, verified by the existing Playwright e2e suite
   passing unchanged (or with only trivial, justified edits).
2. **Search works exactly as today** — SSE streaming into the accordion,
   progress bar, per-provider product cards, "Found N results", zero-result
   messaging, all preserved.
3. **Static output only** — `astro build` produces pure HTML/CSS + islands; no
   Node server runtime, no Vercel adapter. `ssr`/loader architecture removed.
4. **Providers page stays fresh** — UP/DOWN status fetched client-side on load
   (per-visit), not baked at build time.
5. **Analytics preserved** — `search-performed` PostHog capture and pageview
   tracking continue to fire (moved to client-side).
6. **Design system preserved** — shadcn/ui + Tailwind styling/behavior
   (accordion, progress, sheet/mobile menu, tooltip, table) carries over; the
   existing visual design is unchanged.

## 3. Non-Goals

- No change to product data schema, provider names, query URLs, or search
  behavior.
- No change to the backend (`shirtscanner-be`). SSE contract `/v1/products/stream`
  and `/v1/providers` remain the source of truth.
- No visual redesign, no re-skinning, no new pages.
- No migration of the Playwright suite's intent — tests are kept (they are the
  acceptance oracle). Deletion or heavy rewrite of the suite is out of scope.
- No introduction of a server runtime just to keep SSR semantics.

## 4. Approach (Selected)

Re-platform onto **Astro with `output: "static"`**, using **one React island**
for the interactive search page and a lightweight client-side approach for
providers.

Why this over the alternatives:

| Alternative | Tradeoff | Verdict |
|---|---|---|
| **Static + single React island (chosen)** | Search still ships React JS, but only that page; everything else zero-JS | Best fit: one interactive page, rest static |
| Fully framework-agnostic search (vanilla TS/SSE + open details) | Re-implements accordion a11y, state, scroll regions from scratch | More new work + loses Radix a11y guarantees; not justified here |
| Islands-per-feature (multiple small React islands) | More integration points, more hydration overhead for marginal gain on a single stream UI | Over-engineering for one page |
| SSR (Astro Vercel adapter) | Closer to today but reintroduces a server runtime, contradicting goals 3/4 | Rejected |

The search page is the *only* interactive surface; everything else yields to
static rendering. A framework-agnostic rewrite would replace a working,
accessible Radix accordion with a hand-rolled one — the one place a second
framework would actively hurt. Hence: Astro shell + a single React island for
search, plus a tiny providers fetch.

## 5. Architecture

### 5.1 Rendering target and config

- `astro.config.mjs` with `output: "static"` and `@astrojs/react` for the island.
- `@tailwindcss/vite` stays (Tailwind v4) — Astro's `vite` is fully compatible.
- `@vercel/react-router` adapter, React Router `loader`/`action`/`ssr`
  machinery, `react-router.config.ts`, `vite.config.ts` and the `app/entry.*`
  files are removed.

### 5.2 Routes and page structure (`src/pages/`)

| Route | File | Content |
|---|---|---|
| `/` | `src/pages/index.astro` | Static Hero + `<SearchBar>` (plain HTML form, no island — same as current `search-bar.tsx`) |
| `/search` | `src/pages/search.astro` | Static shell + `<ProductSearch backendUrl={...} q={...} />` **React island** |
| `/providers` | `src/pages/providers.astro` | Static table (name, URL) + inline client fetch for UP/DOWN status |
| 404 | `src/pages/404.astro` | Existing error page markup (heading, "Go back to homepage" button) |

The Astro shell reads the backend URL from `import.meta.env.PUBLIC_SHIRTSCANNER_BE`
(public env var), passing it to the island as props. `posthog-js` init + pageview
moves to a global `<script>` (or `@posthog` client script) fired on load /
navigation.

### 5.3 Search island (`ProductSearch`)

Ports the current `search.tsx` client logic 1:1:

- Props: `backendUrl: string`, `q: string`.
- `useEffect` opens `new EventSource(\`${backendUrl}/v1/products/stream?q=${q}\`)`,
  `onmessage` → `JSON.parse` → `setTotal` / append `ProviderResult`; `onerror`
  closes the stream; cleanup closes the `EventSource`.
- Derived state: `totalProducts` (flattened), progress % (`providerResults.length * 100 / total`), rendered on a `<Progress/>` component.
- Renders the per-provider `<Accordion>` with product cards (existing
  `product-card.tsx` / `createProductCards`, `createAccordionContent` — same
  components, imported as React components inside the island).
- Captures the `search-performed` PostHog event on mount (moved client-side).

The island's framework remains **React** via `@astrojs/react`; no change to the
React code beyond moving it into an island boundary.

### 5.4 Providers page

- Static columns: provider name + website link (stable, baked at build).
- Status: a small inline `<script type="module">` (or minimal island) fetches
  `${backendUrl}/v1/providers` on load and updates the status cell + tooltip
  in place, preserving per-visit freshness (decision #3).
- This is a tiny enhancement over the pure-static fallback: frame renders
  instantly (server HTML), status fills in async (client). Acceptable minimal
  JS footprint given the explicit requirement for freshness.

### 5.5 Component/asset migration

- `app/components/ui/*` (Radix: accordion, progress, sheet, table, tooltip,
  separator, scroll-area) → `src/components/` unchanged (React, used inside the
  island or for sheet/mobile menu island).
- `Header` (with mobile `Sheet` menu) → rendered where JS is needed; desktop nav
  can be static. Decide per-page: either a static `<header>` in a shared Astro
  partial or a small header island for the mobile sheet. Default: shared Astro
  `.astro` header component reusing the mobile sheet as a React island only where
  required.
- `public/` (sitemap, robots, icons) unchanged. `components.json` (shadcn)
  preserved.
- Remove `app/services/posthog-server` / SSR-only PostHog code; keep client
  `posthog-js` wiring.

## 6. Data Flows

### Search (unchanged semantics, different transport)
```
browser --GET /search?q= Argentina-->  Astro(static)  ---> HTML + <ProductSearch> island
island  --EventSource: /v1/products/stream?q=Argentina-->  backend  (SSE)
island  <--event: {total, data: ProviderResult}----------- backend
island  --React state-->  Accordion + Progress + product cards (user)
island  --posthog.capture("search-performed")--> PostHog
```

### Providers (fresh status)
```
browser --GET /providers-->  Astro(static)  --->  HTML table (name, URL) rendered
<script> --fetch /v1/providers--> backend --> status cells updated client-side
```

### Env
- Replace `process.env.SHIRTSCANNER_BE` with `import.meta.env.PUBLIC_SHIRTSCANNER_BE`
  referenced in the shell + island. CI/`set` side: Vercel env must expose a
  `PUBLIC_`-prefixed var (client-bundled). Document this rename risk in the plan.

## 7. Error Handling

- **SSE stream error** → same as today: `sse.onerror` closes the stream; partial
  results already appended stay visible (graceful degradation, no change).
- **Providers fetch failure** → keep static name/URL rows; show
  "unknown"/degraded status (existing `getStatusEmoji` default), no crash.
- **Missing `q` on `/search`** → static page without island data renders an
  empty/'no query' state; the e2e doesn't cover this, but preserve 404-style
  handling parity where reasonable.
- **Env var absent** → guard the island: render without starting SSE if
  `backendUrl` is empty (explicit, no silent hang).

## 8. Testing Strategy

- **Keep the existing Playwright e2e suite** (`tests/`), which is the acceptance
  oracle:
  - title check on `/`
  - search form → fills placeholder, submits, lands on `/search?q=...`
  - `/providers` renders rows
  - header "Providers" link → `/providers`
  - 404 heading + "Go back to homepage" → `/`
- Adjustments only if the suite references React-Router-specific behavior that
  inherently changes (e.g., URL/SSR details). Each change documented.
- Locally verify `astro build` succeeds and `astro preview` serves the routes
  before relying on CI.
- Truth gate: `bunx playwright test` passes aad-mean locally and in CI on both
  the old and new setups (during transition).

## 9. Deployment

- Static output builds `dist/`; deploy to Vercel as static assets (no adapter,
  no serverless functions). Sitemap/robots served as-is from `public/`.
- Update env: `SHIRTSCANNER_BE` → `PUBLIC_SHIRTSCANNER_BE` everywhere it's read
  (builder + runtime). Flag any hardcoded backend URL in `search.tsx`.

## 10. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| `import.meta.env` exposure of backend URL is now client-visible | Already effectively client-visible today (loader returns it to the client for `EventSource`); note it, don't regress it. No secrets enter the frontend. |
| PostHog server capture removed → event attribution changes | Move capture to client island on mount; verify event fires in PostHog/available tooling post-deploy. |
| React island still ships JS on `/search` | Accepted per decision #1; the win is that /, /providers, 404, sitemap are pure static. |
| Accordion/Sheet a11y regressions after re-platforming | Reuse existing Radix components verbatim; diff via e2e + manual check. |
| Vercel env rename breaks runtime | Plan step: update env var name + verify `import.meta.env` resolves in build. |

## 11. Open Questions (resolved)

1. Rendering target → **static output** (user-confirmed). ✅
2. Search redesign approach → **single React island** (user-confirmed). ✅
3. Providers data → **client-side fetch on load** (user-confirmed). ✅

## 12. Proposed Implementation Order (for writing-plans)

1. Scaffold Astro + `@astrojs/react` + Tailwind v4; static config; verify empty build.
2. Port `Header` + `SearchBar` + index page as static Astro.
3. Build `search.astro` + `ProductSearch` React island reusing existing components; wire SSE + PostHog.
4. Build `providers.astro` with client-fetch status.
5. Build 404 page.
6. Remove React Router entry/loader/router machinery; fix `import.meta.env`.
7. Run e2e; fix diffs; deploy static to Vercel; verify events + sitemap/robots.
