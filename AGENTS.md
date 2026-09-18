# Agent Instructions

## Project
ShirtScanner — Astro 7 static site + React islands, Tailwind v4 (`@tailwindcss/vite`), shadcn/ui (new-york base), lucide-react, Radix primitives, Inter, PostHog, Playwright. Backend URL: `import.meta.env.PUBLIC_SHIRTSCANNER_BE`.

## Design context
Read `/PRODUCT.md` (strategy, register, users, principles) and `/DESIGN.md` (Retro 90s kit design system: tokens, named rules, components) before any UI work. The `.impeccable/live/config.json` and `.impeccable/design.json` hold machine-readable design tokens.

The phone is the primary canvas: single column, 44px touch targets, thumb-reachable primary actions, no hover-only affordances.