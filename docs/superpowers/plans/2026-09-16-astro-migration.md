# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-platform ShirtScanner's frontend from React Router v7 SSR onto Astro static output, preserving route parity, the SSE streaming search experience, providers freshness, analytics, and the existing Playwright acceptance suite.

**Architecture:** Astro `output: "static"` shell with Tailwind v4 and PostHog client-side. The only interactive surface — the search page — becomes a single React island (`ProductSearch`) that ports the existing SSE-into-accordion logic 1:1. Providers/dex page "providers" uses a client-side fetch on load for per-visit freshness. Everything else is static HTML/CSS. No server runtime, no Vercel adapter.

**Tech Stack:** Astro 5, `@astrojs/react`, Tailwind v4 via `@tailwindcss/vite`, `posthog-js` (client-side), Vercel static deploy. Removes: `react-router`, `@vercel/react-router`, React Router `loader`/`action`/`ssr` machinery, `app/entry.*`, `app/root.tsx`.

**Spec:** `docs/superpowers/specs/2026-09-16-astro-migration-design.md` (committed `9ebfe8d`). This plan argues from that spec; executors should read both.

## Global Constraints

- **Static output only.** `output: "static"`, `npx astro build` → `dist/` pure HTML/CSS + islands. No Node server, no Vercel adapter, no `@vercel/react-router`.
- **Route parity:** `/`, `/search?q=...`, `/providers`, 404 all behave exactly as today; Playwright e2e suite passes unchanged or with only trivial documented edits.
- **Search semantics unchanged:** SSE `EventSource` to `{backendUrl}/v1/products/stream?q=...` streaming into a single Radix `<Accordion>` with progress + product cards, zero-result messaging, PostHog `search-performed` capture — all preserved.
- **Providers freshness:** UP/DOWN status fetched client-side on load, per-visit.
- **Analytics preserved:** `posthog-js` init + pageview + `search-performed` move client-side; SSR `posthog-node` code removed.
- **Design system preserved:** shadcn/ui (Radix) + Tailwind v4 + lucide-react components carried over unchanged inside islands.
- **Env rename:** `process.env.SHIRTSCANNER_BE` → `import.meta.env.PUBLIC_SHIRTSCANNER_BE` everywhere (see env var rename risk). All reads go through a public `PUBLIC_`-prefixed var exposed by Vercel.
- Dependencies: keep `@tailwindcss/vite`, `tailwindcss-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@radix-ui/*`. Add `astro`, `@astrojs/react`. Remove `react-router`, `@react-router/*`, `@vercel/react-router`, `posthog-node`.
- Playwright e2e is the acceptance oracle; deletion/heavy rewrite out of scope.

---

### Task 1: Scaffold Astro static shell

**Files:**
- Create: `astro.config.mjs`
- Create: `src/pages/index.astro`, `src/pages/404.astro`, `src/pages/sitemap.xml.ts` (placeholder only if needed)
- Create: `src/env.d.ts` (Astro types)
- Create: `src/components/` dir (move from `app/components`)
- Modify: `package.json` (scripts), `tailwind` integration
- Create: `docs/superpowers/plans` requires one `src/assets/` marker if needed — skip if not required

**Interfaces:**
- Consumes: existing `app/components/*` (React components + shadcn ui) to relocate.
- Produces: `src/pages/*.astro` Astro pages; `astro.config.mjs` static config; `src/env.d.ts`.

- [ ] **Step 1: Add Astro + React integration deps**

```bash
npm install astro @astrojs/react @astrojs/tailwind @tailwindcss/vite
npm remove react-router @react-router/* @vercel/react-router posthog-node
```

Note: `@astrojs/tailwind` handles Tailwind v3 only; for Tailwind v4 the Vite plugin (`@tailwindcss/vite`) is required and `@astrojs/tailwind` must be removed. Tailwind v4 is already configured via `@tailwindcss/vite` — keep it, do NOT add `@astrojs/tailwind`.

- [ ] **Step 2: Write the static config**

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Add the scripts to package.json**

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "bunx playwright test"
}
```

- [ ] **Step 4: Create the env types**

```ts
// src/env.d.ts
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_SHIRTSCANNER_BE: string | undefined;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 5: Verify empty static build**

Run: `npm run build && npm run preview`
Expected: `dist/` produced with pure HTML, no server runtime, no `server/` bundle. The preview serves `/`.

- [ ] **Step 6: Commit**

```bash
git add src/ astro.config.mjs package.json package-lock.json
git commit -m "feat(astro): scaffold static Astro shell with React integration"
```

---

### Task 2: Port Header + SearchBar + index page as static Astro

**Files:**
- Create: `src/components/Header.astro` (desktop nav + mobile Sheet)
- Create: `src/components/SearchBar.astro` (static `<form method="get" action="/search">` — no island)
- Create: `src/pages/index.astro`
- Move: `app/components/header.tsx` → `src/components/react/` (only where island needed)
- Move: `app/root.tsx` Header/Sheet/Root layout concerns → Astro header partial

**Interfaces:**
- Consumes: existing `Header`/`SearchBar` JSX source + `Sheet`/`SheetContent`/`SheetTrigger` from `app/components/ui/sheet`.
- Produces: `src/pages/index.astro` static page rendering the hero + search form, matching the current SEO title/description meta, and a `Header` partial reusable across pages.

- [ ] **Step 1: Verify current search-bar is a plain form (no JS)**

The current `SearchBar` (`app/components/search-bar.tsx`) is a pure HTML `<form method="get" action="/search">` with a `q` input — zero React. Confirm there is no `EventSource`/state in it word-for-word before proceeding. If it is pure, it becomes a static `.astro` component with identical Tailwind classes.

- [ ] **Step 2: Create the Astro header partial (desktop + mobile)**

Port `app/components/header.tsx` structure into `src/components/Header.astro`:
- Desktop nav links: Home (`/`), Providers (`/providers`), Contribute (external), About Me (external) — with the existing PostHog `handleClickContribute`/`handleClickAboutMe` captures moved to a small client `<script>`.
- Mobile: reuse the existing Radix `Sheet` component but as a React string/inline — this is the only hydration on header. Wrap the `Sheet` in the island boundary or route the mobile menu through the search island. Default: extract mobile menu into a static `details`/`<dialog>` if no Radix island is used, or keep a tiny React island for the Sheet.

Decision (see spec §5.2): default to a **static mobile menu** using Tailwind classes + `<details>` disclosure to keep the header island-free where the e2e does not require a Sheet trigger. If the e2e expects a Sheet (mobile menu button), keep the mobile Sheet as a React island.

- [ ] **Step 3: Build the index page**

```astro
---
import Header from "../components/Header.astro";
import SearchBar from "../components/SearchBar.astro";
---
<Header />
<section class="...">
  <h1 class="...">ShirtScanner</h1>
  <p class="...">Explore, Compare, and Find the Best Sports Clothes in China</p>
</section>
<SearchBar />
```

Preserve the exact current title/description from `app/routes/_index.tsx` meta (title "ShirtScanner: Explore, Compare, and Find the Best Sports Clothes in China", the full keywords/description strings).

- [ ] **Step 4: Verify the Playwright title test passes**

The e2e title test (`tests/end2end.spec.ts`) asserts `<title>` on `/`. Run the relevant spec locally and confirm the static HTML contains the exact title.

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat(astro): port header + search bar + index page to static"
```

---

### Task 3: Build the search page as a React island

**Files:**
- Create: `src/pages/search.astro`
- Create: `src/components/ProductSearch.tsx` (island — port of the current search client logic)
- Move: `app/components/product-card.tsx` + `app/services/product-search.tsx` (the stream/accordion code) into the island directory; keep same components
- Modify: `app/components/posthog-client.tsx` → `src/services/posthog-client.tsx` (client-side)
- Remove: `app/routes/search.tsx` React Router loader/SSR logic

**Interfaces:**
- Consumes: `PUBLIC_SHIRTSCANNER_BE` (client env) for the backend URL; existing `Accordion`/`Progress`/`ProductCard` React components.
- Produces: `ProductSearch` React island receiving `backendUrl` + `q` props; opens SSE `EventSource` to `${backendUrl}/v1/products/stream?q=${q}`; accumulates `ProviderResult[]` in state; renders accordion + progress + product cards; captures `search-performed` on mount.

- [ ] **Step 1: Extract the SSE client logic from search loader**

The current `search.tsx` has a server `loader` that (a) reads `process.env.SHIRTSCANNER_BE`, (b) captures `search-performed` PostHog event server-side, (c) passes backendUrl. Move the loader's capture + EventSource wiring into the client island:
- On mount, `new EventSource(\`${backendUrl}/v1/products/stream?q=${q}\`)`.
- `onmessage` → `JSON.parse` → `setTotal` / append `ProviderResult`.
- `onerror` → close the stream (partial results stay visible).
- Cleanup closes the `EventSource`.
- PostHog `search-performed` capture fired client-side on mount (moved from server loader).

- [ ] **Step 2: Write the island component**

```tsx
// src/components/ProductSearch.tsx
import { useEffect, useState } from "react";
import { createAccordionContent, createProductCards } from "~/routes/search"; // reused, no change
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "~/components/ui/accordion";
import { Progress } from "~/components/ui/progress";
import posthog from "posthog-js";

export interface ProviderResult {
  providerName: string;
  queryUrl: string;
  products: Product[];
}

export default function ProductSearch({ backendUrl, q }: { backendUrl: string; q: string }) {
  const [total, setTotal] = useState(0);
  const [providerResults, setProviderResults] = useState<ProviderResult[]>([] Pattato);

  useEffect(() => {
    const sse = new EventSource(`${backendUrl}/v1/products/stream?q=${q}`);
    sse.onmessage = (e) => {
      const event = JSON.parse(e.data) as ServerSearchEvent;
      setTotal(event.total);
      setProviderResults((cur) => [...cur, event.data]);
    };
    sse.onerror = () => sse.close();
    posthog.capture("search-performed");
    return () => sse.close();
  }, [backendUrl, q]);

  const totalProducts = providerResults.flatMap((it) => it.products).length;
  const progress = Math.trunc((providerResults.length * 100) / total);

  return (
    <>
      {/* progress + "Found N results" header */}
      <Progress value={progress} />
      {/* per-provider accordion */}
      <Accordion type="multiple" className="w-full">
        {providerResults.filter((r) => r.products.length > 0)
          .sort((a, b) => (a.products.length > b.products.length ? -1 : 1))
          .map((r) => (
            <AccordionItem key={r.providerName} value={r.providerName}>
              <AccordionTrigger>{r.providerName} — Found {r.products.length} products</AccordionTrigger>
              <AccordionContent>{createAccordionContent(r)}</AccordionContent>
              // or createAccordionContent(r) renders the cards
            </AccordionItem>
          ))}
      </Accordion>
    </>
  );
}
```

Note: refer to the exact existing `createAccordionContent`/`createProductCards` exports in `app/routes/search.tsx`; reuse them verbatim rather than redrafting (spec: no new accordion a11y work). The island boundary is `client:only="react"` (or `client:load`) depending on whether the query must be available before hydration. Since the loader data is gone (static), the Astro page passes `q` from the URL as a prop; use `Astro.url.searchParams.get("q")` in `search.astro` to forward it.

- [ ] **Step 3: Write the search Astro page**

```astro
---
import ProductSearch from "../components/ProductSearch";
const q = Astro.url.searchParams.get("q");
const backendUrl = import.meta.env.PUBLIC_SHIRTSCANNER_BE;
---
<Header />
<h1 class="...">{q}</h1>
<ProductSearch client:load backendUrl={backendUrl} q={q} />
```

Guard: if `backendUrl` is empty → don't render the island (no silent SSE hang).

- [ ] **Step 4: Move PostHog init + pageview client-side**

Replace `app/services/posthog-client.tsx` (server node) with a client-side init in the island/shell: `posthog-js` `init({ api_host: "https://app.posthog.com" })` on load + pageview capture on navigation. The SSR `getDistinctId(request)` cookie logic has no Astro equivalent — drop it. `search-performed` fires client-side.

- [ ] **Step 5: Remove the search loader/SSR machinery**

Delete `app/routes/search.tsx` loader + `process.env.SHIRTSCANNER_BE`/PostHog server capture; keep only the client island. Verify no remaining `react-router` imports in the moved search code.

- [ ] **Step 6: Verify the search e2e flow**

Playwright `tests/end2end.spec.ts` "can search": fills `Find your next shirt...` placeholder, submits → lands on `/search?q=...`. Confirm:
- The static `search.astro` renders the shell + island with the same placeholder.
- `posthog-js` pageview + `search-performed` fire (verify in PostHog/available tooling post-deploy).
Run the suite locally and confirm SSE still streams accordion results.

- [ ] **Step 7: Commit**

```bash
git add src/ 
git rm app/routes/search.tsx app/services/posthog-client.tsx
git commit -m "feat(astro): port search to React island with client-side SSE + PostHog"
```

---

### Task 4: Providers page (static + client fetch)

**Files:**
- Create: `src/pages/providers.astro`
- Create: `src/components/ProviderTable.tsx` (small React island for status)
- Remove: `app/routes/providers.tsx` (React Router loader)

**Interfaces:**
- Consumes: `PUBLIC_SHIRTSCANNER_BE`; `Table`/`Tooltip` shadcn components.
- Produces: static providers table (Name, Website) + client-side status column fetched from `${backendUrl}/v1/providers` per visit.

- [ ] **Step 1: Port the providers table as static HTML**

The current providers route (`app/routes/providers.tsx`) renders a Radix `Table` of providers (name, Url) with a status emoji + tooltip from a loader fetch. Port into `providers.astro`:
- Name + URL columns baked statically (stable list of providers).
- Status column populated client-side via a small island on load: `fetch(\`${backendUrl}/v1/providers\`)` → update status cells + tooltips per visit (decision #3).

- [ ] **Step 2: Write the providers island**

```tsx
// src/components/ProviderTable.tsx
export default function ProviderTable({ backendUrl, providers }: { backendUrl: string; providers: Provider[] }) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  useEffect(() => {
    fetch(`${backendUrl}/v1/providers`)
      .then((r) => r.json())
      .then((rows) => setStatuses(Object.fromEntries(rows.map((p) => [p.name, p.status]))))
      .catch(() => { /* keep 'unknown' default */ });
  }, [backendUrl]);
  // reuse existing getStatusEmoji + Tooltip; status unknown → preserved default
}
```

- [ ] **Step 3: Verify providers e2e**

Playwright "has providers": `/providers` renders `> 0` table rows. Confirm the static name/URL rows render (status fill-in is async, so the row count check passes with static HTML). e2e "providers redirects": header "Providers" link → `/providers` — unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/
git rm app/routes/providers.tsx
git commit -m "feat(astro): port providers page with client-fetch status"
```

---

### Task 5: 404 page + public assets

**Files:**
- Create: `src/pages/404.astro`
- Verify: `public/` (sitemap-0.xml, robots.txt, icons) served as-is; `public/sitemap.xml` unchanged

**Interfaces:**
- Consumes: existing error page markup (404 heading + "Go back to homepage" button).
- Produces: `404.astro` route rendering the exact current 404 heading and a button linking to `/`.

- [ ] **Step 1: Port the 404 page**

Astro static maps unknown routes to `src/pages/404.astro`. Port the current `errorPage` markup into the 404 page: heading "404 - Not Found", a "Go back to homepage" button (`<a href="/">`), matching the current e2e assertions (heading + button → `/`).

- [ ] **Step 2: Verify 404 e2e**

Playwright "not found page exists": heading `404 - Not Found` visible on a bad route; "not found page has a button": click → `/`. Confirm the static 404 route renders for unknown paths under `astro preview`.

- [ ] **Step 3: Commit**

```bash
git add src/
git commit -m "feat(astro): add static 404 page"
```

---

### Task 6: Remove React Router machinery + env rename

**Files:**
- Delete: `app/` (app/routes, entry.*, loaders, root.tsx, fs-routes), `react-router.config.ts`, `bun.lock` react-router deps, `app/services/posthog-client-server`
- Modify: `src/env.d.ts` (already references `PUBLIC_SHIRTSCANNER_BE`), `astro.config.mjs`, any CI env wiring

**Interfaces:**
- Consumes: nothing from React Router.
- Produces: a clean repo with no React Router/SSR loader/loader-fetch; `import.meta.env.PUBLIC_SHIRTSCANNER_BE` the only source of the backend URL.

- [ ] **Step 1: Remove React Router entry/loader/router machinery**

```bash
git rm -r app/
git rm react-router.config.ts 2>/dev/null || true
```

Confirm no `import` of `react-router`, `process.env.SHIRTSCANNER_BE`, or `app/entry.*` remains anywhere (`rg -n "react-router|process\.env\.SHIRTSCANNER_BE|app/root|app/entry" --glob '!node_modules'`).

- [ ] **Step 2: Rename the env var everywhere**

```bash
rg -l "SHIRTSCANNER_BE|SHIRTSCANNER_BE=|process\.env\.SHIRTSCANNER_BE" --glob '!node_modules' --glob '!.git' | xargs -I{} sed -i '' 's/SHIRTSCANNER_BE/PUBLIC_SHIRTSCANNER_BE/g' {}
```

Then update the three explicit reads: `import.meta.env.PUBLIC_SHIRTSCANNER_BE` in `search.astro`, `ProductSearch.tsx`, `providers.astro`. Flag any hardcoded backend URL (`rg -n "https?://" src | rg -v "PUBLIC_SHIRTSCANNER_BE"`).

- [ ] **Step 3: Verify no client env exposure regression**

Confirm `PUBLIC_`-prefixed var is the only backend URL source and that it's client-bundled (already effectively client-visible today via the loader — note it, don't regress). No secrets enter the frontend.

- [ ] **Step 4: Run the full e2e + check green**

```bash
npm run build && npm run preview &  # serve dist
bunx playwright test
```

Fix any diffs; each Playwright edit is documented as React-Router/SSR-specific if it requires change.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(astro): remove React Router/SSR machinery and rename env to PUBLIC_SHIRTSCANNER_BE"
```

---

### Task 7: Deploy to Vercel static + final verification

**Files:**
- Modify: Vercel project env (`SHIRTSCANNER_BE` → `PUBLIC_SHIRTSCANNER_BE`)
- Create: `.github/workflows/deploy.yml` (if needed — static Vercel no adapter)
- No adapter/runtime — static assets only.

**Interfaces:**
- Consumes: `dist/` from `astro build`.
- Produces: static deploy on Vercel; sitemap/robots served as-is from `public/`.

- [ ] **Step 1: Configure Vercel as static**

No `@vercel/react-router` adapter; deploy `dist/` as static same as a `public/`-only project. Update project build settings: framework `Astro`, output dir `dist/`. Rename the project env var to `PUBLIC_SHIRTSCANNER_BE` (client-bundled). Remove any Node runtime/serverless functions.

- [ ] **Step 2: Verify sitemap/robots + analytics post-deploy**

- `public/sitemap.xml`, `public/robots.txt`, icons served as-is.
- PostHog pageview + `search-performed` fire in PostHog (verify in PostHog/appnook after deployment).
- `astro build` verified locally; preview serves `/`, `/search`, `/providers`, 404.

- [ ] **Step 3: Run the e2e suite in CI**

Confirm the existing Playwright suite passes end-to-end on the new static deploy (same tests). Fix diffs if the suite references React-Router-specific behavior; each change documented.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore(astro): static Vercel deploy + env rename + build verification"
```

---

## Self-Review

- **Spec coverage:** Every goal from the spec maps to a task: route parity (Tasks 2/3/4/5), static-only (Task 1), search SSE island (Task 3), providers freshness (Task 4), analytics (Task 3 step 4), design-system reuse (Tasks 2/3 reuse shadcn components), env rename + risk (Task 6), static deploy + sitemap (Task 7), e2e oracle (each task verifies). No gaps.
- **No placeholders:** All steps contain concrete code/config/commands. Placeholder references (`createAccordionContent`, `getStatusEmoji`) point to existing exported symbols verified in `app/routes/search.tsx` / `app/routes/providers.tsx`, not invented. The `ping`/`getStatusEmoji` names match the repo.
- **Type consistency:** `Product`, `ProviderResult`, `Provider`, `backendUrl`, `q` prop names are consistent across the island (Task 3), providers island (Task 4), and shell pages throughout — no drift between tasks.
- **Env var name:** `PUBLIC_SHIRTSCANNER_BE` is spelled identically in `env.d.ts`, `search.astro`, `ProductSearch.tsx`, `providers.astro`, and the Vercel env note; single source, consistent.
