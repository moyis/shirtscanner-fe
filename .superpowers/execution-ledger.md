
# Execution Ledger — Astro Migration (2026-09-16 astro-migration)

Worktree: `/Users/moyis/Documents/projects/personal/shirtscanner-fe/.worktrees/astro-migration`
Branch: astro-migration (based on main b25c659)
Oracle: tests/end2end.spec.ts (title / search placeholder / providers rows / 404)

Ruling   2026-09-16 env: canonical var is `SHIRTSCANNER_BE` (code + .env + Vercel/CI). Client port target: `PUBLIC_SHIRTSCANNER_BE` (PUBLIC_ = Astro client-exposed), matching approved spec + plan §6/corrected plan. No `SHIFTSCANNER_BE` (that was a typo, fixed in plan commit).
