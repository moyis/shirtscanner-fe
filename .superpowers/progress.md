# SDD ledger — plan: docs/superpowers/plans/2026-09-16-astro-migration.md

BASE=b25c659fe8321c68e0683348c7c821bde319335f

## Task Ledger
## Rulings
- R1 2026-09-16 pm: repo is bun-managed (bun.lock). Use `bun add`/`bun remove` instead of the plan's `npm` commands. Cost if wrong: none (lockfile tool differs only).
- R2 2026-09-16 tailwind: use `@tailwindcss/vite` only; do NOT install `@astrojs/tailwind` (Tailwind v4). Matches plan note + design.
- R3 2026-09-16 env: `SHIRTSCANNER_BE` → `PUBLIC_SHIRTSCANNER_BE` everywhere (client-exposed via import.meta.env / PUBLIC_ prefix). Confirmed 24 consistent occurrences in plan.
- R4 2026-09-16 providers: no stable/static provider list exists in the repo; the only source is backend GET /v1/providers. The plan/spec "bake name+URL statically" is unachievable without inventing data. Port = island fetches full list on load (decision #3), matching current behavior. Cost if wrong: providers page briefly empty offline (same as today).
