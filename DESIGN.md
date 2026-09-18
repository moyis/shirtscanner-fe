---
name: ShirtScanner
description: One search across every Chinese sports-clothing store.
colors:
  pitch-white: oklch(0.995 0.002 260)
  kit-navy: oklch(0.23 0.04 263)
  stadium-ink: oklch(0.34 0.055 265)
  slate-mist: oklch(0.96 0.012 260)
  slate-line: oklch(0.9 0.022 260)
  noir: oklch(0.24 0.02 263)
  noir-deep: oklch(0.19 0.02 263)
  volt: oklch(0.87 0.2 138)
  volt-deep: oklch(0.82 0.19 138)
  volt-ink: oklch(0.24 0.04 265)
  crest-gold: oklch(0.78 0.13 88)
typography:
  display:
    fontFamily: 'Archivo, "Geist", ui-sans-serif, system-ui, sans-serif'
    fontSize: "clamp(2.5rem, 11vw, 4.5rem)"
    fontWeight: 900
    fontStretch: "115% - 120%"
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    textTransform: uppercase
  title:
    fontFamily: '"Geist", ui-sans-serif, system-ui, sans-serif'
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: '"Geist", ui-sans-serif, system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"Geist", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.volt}"
    textColor: "{colors.volt-ink}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    typography: "{typography.label}"
  search-input:
    backgroundColor: "{colors.pitch-white}"
    textColor: "{colors.kit-navy}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  count-chip:
    backgroundColor: "{colors.volt}"
    textColor: "{colors.volt-ink}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
    typography: "{typography.label}"
  status-up:
    backgroundColor: "{colors.noir}"
    textColor: "{colors.pitch-white}"
    rounded: "{rounded.full}"
    padding: "3px 10px"
    typography: "{typography.label}"
  status-down:
    backgroundColor: "{colors.volt}"
    textColor: "{colors.volt-ink}"
    rounded: "{rounded.full}"
    padding: "3px 10px"
    typography: "{typography.label}"
  hero-panel:
    backgroundColor: "{colors.pitch-white}"
    textColor: "{colors.kit-navy}"
  scan-band:
    backgroundColor: "{colors.noir}"
    textColor: "{colors.pitch-white}"
  product-card:
    backgroundColor: "{colors.pitch-white}"
    rounded: "{rounded.md}"
  card-media:
    rounded: "{rounded.md}"
---

# Design System: ShirtScanner

## 1. Overview

**Creative North Star: "The Kit-Bag Scraper"**

ShirtScanner is a tool first and a poster second: one query, streamed across a wall of Chinese marketplace stores, results arriving like a live score feed. The system is built to feel like rifling through a kit bag before a match: everything visible, nothing ornamental, and every piece earns its place.

The phone is the primary canvas. Most use happens one-handed, mid-transit, outdoors, so every composition is built small-first: single column, thumb reach at the bottom of the screen, 44px touch targets, no hover-only affordances, white that stays readable in sunlight. Desktop is an enhancement, never the baseline.

Color follows the retro kit. The surface is a clean, cool white with the blue undertow of the brand hue, so the header and search sit like a freshly pressed home shirt. Noir drives the heavy surfaces — hero panels and ink — and Volt is the single loud accent: every action, every count, every live signal. The relationship between the two leading colors is always *blocks*, never gradients or stripes.

Typography is two voices: Archivo for the display — an expanded, black-weight stadium face that gives the wordmark and page titles real presence — and Geist for everything that carries meaning: UI, body, labels. Energy comes from the contrast between the wide poster type and the tight working face, plus size, weight, and color commitment.

This system explicitly rejects corporate/SaaS polish (gradients, glassmorphism, hero-metric templates), sketchy drop-shopper trickery (urgency timers, fake discounts, clipart), and hushed editorial minimalism. It also rejects the cream/sand body backgrounds that have become the default "warm" move; warmth here is carried by the kit colors and the type, never by a parchment page.

**Key Characteristics**
- Cool white body, blue-undertow ink, two-block kit palette (noir + volt)
- Two type voices: expanded Archivo display vs. tight Geist working face
- Light hero panel with a thin noir scan-band; no giant dark slabs
- Flat surfaces: hairline borders, tonal layering, and only very soft tinted shadow on media
- Sharp, slightly-curved controls (6-12px), full-pill only for chips, the scanline, and the count band
- Dense, results-first layout; no decorative sections
- Pocket-first: single column, thumb-reachable actions, 44px touch targets, no hover-only controls

## 2. Colors: The Retro Kit Palette

**Character:** A freshly-pressed kit: cool white pitch surface, noir-sharp shoulders, an electric volt accent, and a single crest-gold detail. Cool, never warm-tinted; saturated where it commits, clean where it rests.

### Primary
- **Volt** (oklch(0.87 0.2 138)): The action color. Primary buttons, links, focus rings, the search submit, checked/selected states. Volt is light — dark text on volt clears WCAG AA, white does not. Every volt surface carries dark ink.
- **Volt Deep** (oklch(0.82 0.19 138)): Hover/focus companion for interactive volt states (buttons, links).
- **Noir** (oklch(0.24 0.02 263)): The heavy surface. Hero panels, the scanner block, dark status. White text on noir clears WCAG AA.
- **Noir Deep** (oklch(0.19 0.02 263)): Hover on noir surfaces and the neutral ink family anchor.

### Secondary — Accent of Emphasis
- **Volt Ink** (oklch(0.24 0.04 265)): Text that sits on volt surfaces and as a deep complement to noir fills. Dark enough to clear AA on both volt and pitch white.

### Tertiary
- **Crest Gold** (oklch(0.78 0.13 88)): The only third kit color, and it earns its place: price highlights and the rare "standout find" moment. Navy text on crest gold, always. If it shows up on more than one or two elements on a screen, it is overused.

### Neutral
- **Pitch White** (oklch(0.995 0.002 260)): The body and surface color. Cool, a trace of the blue hue, never cream or sand.
- **Kit Navy** (oklch(0.23 0.04 263)): The ink. Headings, body text, icons. Near-black with a clear blue undertow.
- **Stadium Ink** (oklch(0.34 0.055 265)): Muted/placeholder text. Dark enough to clear 4.5:1 on Pitch White; never the default washed-out gray.
- **Slate Mist** (oklch(0.96 0.012 260)): Muted surfaces, section tints, table striping, progress track.
- **Slate Line** (oklch(0.9 0.022 260)): Borders and dividers. A cool blue-gray hairline, never heavy.

### Named Rules
**The Pitch-White Rule.** The body is always cool white with a trace of the blue hue. No cream, sand, beige, parchment, or warm-tinted surfaces anywhere. Warmth is a kit color, not a paper color.

**The Two-Block Rule.** Volt and Noir appear as solid blocks next to each other, like a jersey. Never as a gradient between them, never as stripes, never blended. Volt surfaces carry dark text; Noir surfaces carry white text.

**The Volt-On-Volt Rule.** Volt is light: dark text on volt, always. White on volt fails AA and is never used.

**The Crest-Gold Rule.** Crest Gold is a two-touch maximum per screen. Condensed on price and standout moments only.

## 3. Typography

**Display Font:** Archivo (900, uppercase, up to 120% width axis, system fallback)
**Body/UI Font:** Geist (400/500/600/700)
**Label/Mono Font:** none; Geist carries the working system

**Character:** Two voices on purpose. Archivo is the match-day poster: expanded, black, uppercase — the wordmark and every page title. Geist is the working face: compact, legible, and quiet next to the poster type so display moments actually land.

### Hierarchy
- **Display** (Archivo 900, up to 120% stretch, clamp(2.5rem, 11vw, 4.5rem), 0.9 line-height, letter-spacing -0.03em, uppercase): Page titles and the wordmark only. Max clamp ceiling 4.5rem; never above, and never tighter than -0.03em tracking.
- **Title** (Geist 700, 1.125rem, 1.2): Provider names and row headers.
- **Body** (Geist 400, 1rem, 1.5): Descriptions and result meta. Line length capped at 75ch.
- **Label** (Geist 600, 0.875rem, 1.25): Button labels, chips, table headers, status text.

### Named Rules
**The Two-Voice Rule.** Archivo (display, stretched) and Geist (UI/body) are the only families. No third face, no mono unless a future feature produces literal code or query text. Display headings use Archivo; everything else is Geist.

**The Tracking Floor Rule.** Uppercase display never goes tighter than -0.03em letter-spacing. -0.05em and tighter looks cramped, not bold.

**The Uppercase-Only-Display Rule.** All-caps is reserved for display headings and the wordmark. Body copy, labels, and buttons never sit in all caps.

**The Tabular-Numbers Rule.** Counts, prices, and progress percentages render in tabular numerals so digits sit steady while values stream in.

## 4. Elevation

**The Flat Pitch Rule.** Depth is conveyed by hairline borders and tonal layering. Media (product images) is the one sanctioned place for a soft tinted shadow so cards read as physical objects on the shelf; interactive surfaces get a subtle press-scale instead of a shadow. Shadows are otherwise reserved for floating overlays that must separate from the page: tooltips, menus, the mobile drawer, dialogs. No shadow blur exceeds 16px.

### Shadow Vocabulary
- **Media** (`box-shadow: 0 6px 16px -8px oklch(0.23 0.04 263 / 0.25)`): Product-card images.
- **Overlay (used only on floating surfaces)** (`box-shadow: 0 4px 8px oklch(0.15 0.04 263 / 0.14)`): Tooltips, popovers, the mobile drawer.

### Texture
- A fixed, near-invisible grain overlay (SVG fractal noise at ~4.5% opacity, `pointer-events: none`) sits over the whole page. It kills the sterile flat-plain look without adding color or weight.

### Motion
- Interactive controls (buttons, chips, links) contract slightly on press (`scale 0.98`) with a 150ms ease, so a tap gives immediate proprioceptive feedback. All motion honors `prefers-reduced-motion`.

## 5. Components

### Buttons
- **Shape:** Flat, sharp-edged, 8px radius, semibold label, no shadow at rest.
- **Size:** Every control meets a 44px minimum touch height; primary actions live in the bottom thumb zone on mobile.
- **Primary:** Volt fill, Ink text, 10px 20px padding, hover to Volt Deep, rounded-md, press-scale 0.98. The search submit and every main action.
- **Secondary / Ghost:** Noir is the secondary action (emphatic), Noir Deep on hover. Ghost/link buttons are Ink text with a visible focus ring only.

### Chips
- **Style:** Full-pill (999px), tiny label, 2px 10px padding. Background and text carry meaning directly.
- **Kit Number (count chip):** Volt fill, ink text. This is the sanctioned count motif on accordion rows ("Found 14"), the single allowed numbered marker in the system.
- **Status pills:** Up = Noir fill / white "FIT"; down = Volt fill / ink "MISSED"; unknown = Slate Mist fill / navy text "CHECKING".

### Cards / Containers
- **Corner Style:** 8px radius, image corners match.
- **Background:** Pitch White.
- **Shadow Strategy:** none (see Elevation). Cards separate by a Slate Line hairline border or by spacing on Slate Mist.
- **Internal Padding:** 16px (md) scale.
- **Nested cards are prohibited.** One level of container, always.

### Inputs / Fields
- **Style:** Pitch White fill, 1px Slate Line border, 8px radius, 12px 16px padding, navy text, minimum 48px touch height.
- **Focus:** Noir 2px focus ring, no glow.
- **Error:** Noir border plus a text note at 4.5:1; never border-color alone.

### Navigation
- **Style:** Sticky header, Pitch White, hairline bottom border. Wordmark is Archivo display, uppercase black; on the home hero the wordmark sits on Pitch White with a Volt "SCANNER" block, and Noir appears only as a thin scan-band stripe at the hero's foot. The active page gets a Noir underline + navy ink. Links are navy label-weight with a Noir underline on hover and active. Mobile treatment is a right-aligned drawer (no hamburger-by-reflex; the drawer slides in and takes a Pitch White panel with a hairline edge). The drawer is the primary nav surface; link rows carry full 44px tap height.

### Provider status list / table
- **Detail:** On desktop, a flat table with hairline row borders: provider name (Title-weight navy), website link (Ink underline), status pill. On mobile the table is not shrunk; it collapses to stacked rows, one provider per row, full-width touch targets, pill always right-aligned above the link.

### Search result row / accordion
- **Detail:** One provider per row, bordered top/bottom, provider name as Title-weight navy, a Kit Number red count chip on the right, plus a chevron that rotates on open. Open rows reveal a horizontally snapping scroll of Product Cards (thumb-swipe friendly on mobile); empty providers are hidden from the accordion and surfaced as muted "no results at X" notes instead.

**The Pocket-First Rule.** Nothing on a phone screen may depend on hover, on a tablet-width layout, or on a tap target under 44px. Every action a user takes while standing with one hand must be reachable in the bottom half of the screen. When a desktop pattern cannot collapse cleanly to a phone (a table, a multi-column grid), it is replaced, not squeezed.

## 6. Do's and Don'ts

### Do:
- **Do** keep the body Pitch White, cool, with the blue undertow. Warmth comes from Noir, Volt, and the type, never from the page.
- **Do** use Volt for every primary action, every count, and down-status, and Noir for heavy panels and up-status — always as solid blocks. Dark text on volt; white text on noir.
- **Do** use Archivo (display, stretched) for page titles and the wordmark, Geist for everything else.
- **Do** cap display sizes at clamp(…, 4.5rem) and display tracking at -0.03em.
- **Do** honor WCAG 2.1 AA: 4.5:1 body text, 3:1 large text, visible focus rings, and `prefers-reduced-motion` alternates for every animation.
- **Do** surface honest signals: what was found, what was missed, which providers are up, and the direct link to check the store yourself.
- **Do** give every animation a reduced-motion fallback (crossfade or instant), and ease out with exponential curves when motion runs.
- **Do** design on a phone first: single column, 44px minimum touch targets, primary action in thumb reach, no hover-only interactions.
- **Do** reset the first render against the largest and smallest expected screens and the longest heading words; if a heading overflows, reduce the clamp or rewrite the copy.

### Don't:
- **Don't** ship any interaction that only exists on hover, or any tap target under 44px on its smallest dimension.
- **Don't** squeeze a desktop pattern onto a phone; collapse tables to stacked rows and grids to single column, or replace the pattern.
- **Don't** use gradients, gradient text, or background-clip text. Color is solid blocks, per the Two-Block Rule.
- **Don't** use glassmorphism, blur-glass cards, or 32px+ radii on cards or sections. Over-rounded is a giveaway.
- **Don't** drop onto an all-Noir hero; the home page leads with Pitch White and relegates Noir to the scan-band stripe, status pills, and ink.
- **Don't** build hero-metric templates (big number, label, supporting stats) or identical repeated card grids.
- **Don't** ship fake urgency: no countdown timers, no "only 3 left" pricing, no hype pricing, no spin-to-win.
- **Don't** use cream/sand/parchment/beige backgrounds. Ever.
- **Don't** use side-stripe borders (border-left/right > 1px as a colored accent) on cards or alerts.
- **Don't** pair a 1px border with a wide (>=16px) drop shadow on the same element. Flat at rest, media shadow only, and shadows on floating overlays.
- **Don't** use clipart-style, hand-drawn sketchy SVG illustrations, grunge filters, or repeating-diagonal stripe backgrounds.
- **Don't** put a tiny uppercase tracked eyebrow above every section ("ABOUT / PROCESS / PRICING"). The Kit-Number chip is the only sanctioned numbered motif, and only where count order means something.
- **Don't** use the streamline/empower/seamless/supercharge family of marketing words in any copy. Say what the product literally does.
- **Don't** render body copy or buttons in all caps, and don't set display tracking tighter than -0.03em.