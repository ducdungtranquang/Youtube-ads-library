---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI implementation. Searchable local data: 79 searchable styles (50 active), 192 product palettes and reasoning profiles, 74 font pairings, 119 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, and 22 stacks."
---

# UI/UX Pro Max - Design Intelligence

Searchable local UI/UX guidance: 79 searchable styles (50 active), 192 product palettes and exact reasoning profiles, 74 font pairings, 119 UX guidelines, 105 curated icons, 17 GSAP presets, 25 chart types, and 22 technology stacks.

## When to Apply

Use this Skill when the task involves **UI structure, visual design decisions, interaction patterns, or user experience quality control**: designing new pages, creating/refactoring UI components, choosing color/typography/spacing/layout systems, reviewing UI for UX/accessibility/consistency, implementing navigation/animation/responsive behavior, or improving perceived quality and usability.

Skip it for pure backend logic, API/database design, non-visual performance work, infrastructure/DevOps, or non-visual scripts — unless the task changes how something **looks, feels, moves, or is interacted with**.

## Rule Categories by Priority

*Follow priority 1→10 to decide which category to focus on first; use `--domain <Domain>` to query full details. The full rule text for every category lives in `references/quick-reference.md` — read it on demand rather than loading it every time.*

| Priority | Category | Impact | Domain | Key Checks (Must Have) | Anti-Patterns (Avoid) |
|----------|----------|--------|--------|------------------------|------------------------|
| 1 | Accessibility | CRITICAL | `ux` | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels | Removing focus rings, Icon-only buttons without labels |
| 2 | Touch & Interaction | CRITICAL | `ux` | Min size 44×44px, 8px+ spacing, Loading feedback | Reliance on hover only, Instant state changes (0ms) |
| 3 | Performance | HIGH | `ux` | WebP/AVIF, Lazy loading, Reserve space (CLS &lt; 0.1) | Layout thrashing, Cumulative Layout Shift |
| 4 | Style Selection | HIGH | `style`, `product` | Match product type, Consistency, SVG icons (no emoji) | Mixing flat & skeuomorphic randomly, Emoji as icons |
| 5 | Layout & Responsive | HIGH | `ux` | Mobile-first breakpoints, Viewport meta, No horizontal scroll | Horizontal scroll, Fixed px container widths, Disable zoom |
| 6 | Typography & Color | MEDIUM | `typography`, `color` | Base 16px, Line-height 1.5, Semantic color tokens | Text &lt; 12px body, Gray-on-gray, Raw hex in components |
| 7 | Animation | MEDIUM | `ux`, `gsap` | Context-aware timing, Motion conveys meaning, Spatial continuity | One duration for every transition, Animating width/height, No reduced-motion |
| 8 | Forms & Feedback | MEDIUM | `ux` | Visible labels, Error near field, Helper text, Progressive disclosure | Placeholder-only label, Errors only at top, Overwhelm upfront |
| 9 | Navigation Patterns | HIGH | `ux` | Predictable back, Bottom nav ≤5, Deep linking | Overloaded nav, Broken back behavior, No deep links |
| 10 | Charts & Data | LOW | `chart` | Legends, Tooltips, Accessible colors | Relying on color alone to convey meaning |

For the full rule list per category (all 119 UX guidelines with rationale), read `references/quick-reference.md`. For app-specific polish rules (icons, touch feedback, dark mode contrast, safe areas) and the canonical pre-delivery checklist, read `references/pro-rules.md`.

## Direct Reference & Knowledge Lookup (Zero Python Required)

This skill operates in pure Markdown & direct file inspection mode (no Python environment required). All UI/UX intelligence, rules, and guidelines are available directly:
- **Full 119 UX Guidelines across 10 categories:** Read `references/quick-reference.md`
- **Professional UI rules & Pre-Delivery Checklist:** Read `references/pro-rules.md`
- **Color palettes, Styles, Typography data:** Inspect files in `data/` (`styles.csv`, `colors.csv`, `typography.csv`, `ui-reasoning.csv`, `landing.csv`) directly with `grep_search` or `view_file`.

## Workflow

### Query & Reference Protocol
When designing, refactoring, or auditing UI:
1. **New project/page or visual direction** → Consult `references/quick-reference.md` §4 (Style) & §6 (Typography & Color), plus `data/ui-reasoning.csv` for industry-specific conventions.
2. **Component design or bug fix** → Check the matching category in `references/quick-reference.md` (e.g. §1 for Accessibility, §2 for Touch/Interaction, §8 for Forms).
3. **Before finalizing any UI implementation** → Run through the **Pre-Delivery Checklist** in `references/pro-rules.md`.

This skill provides design intelligence and implementation guidance. Treat guidelines as high-standard recommendations adapted to the project's design system and tech stack (Next.js 15, React 19, Tailwind CSS v4, Radix UI/shadcn).

### Step 1: Analyze User Requirements

Extract from the user request:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, entertainment, tool, productivity, or hybrid
- **Target audience & context**: age group, usage context (commute, leisure, work)
- **Style keywords**: playful, vibrant, minimal, dark mode, content-first, immersive, etc.
- **Stack**: detect from the project — check `package.json` deps (react/next/vue/svelte/nuxt/@angular), `pubspec.yaml` (Flutter), `*.xcodeproj`/`Package.swift` (SwiftUI), `composer.json` (Laravel), or React Native markers (`app.json` + `react-native` dep). If nothing is detectable and stack guidance matters, ask the user. **Never assume a stack** — a hardcoded default silently misroutes every recommendation.

### Step 2: Establish Design System & Aesthetics
For any new page, feature, or redesign:
1. **Layout & Grid**: Define mobile-first responsive breakpoints (375px, 768px, 1024px, 1280px+). Use consistent 4px/8px incremental spacing scale.
2. **Visual Style**: Select a coherent aesthetic (e.g. Modern Dark Mode, Bento Grid, Clean SaaS Minimal, or Glassmorphic Accents) tailored to the product domain.
3. **Color Palette**: Choose semantic design tokens (Primary, Secondary, Accent, Background, Foreground, Muted, Border, Destructive). Ensure AA contrast (4.5:1 for body text, 3:1 for large text/borders).
4. **Typography**: Pair clean heading & body fonts (e.g., Geist / Inter / Plus Jakarta Sans) with consistent scale (12px, 14px, 16px, 18px, 24px, 32px, 48px).
5. **Motion & Feedback**: Context-aware durations (150-300ms), respect `prefers-reduced-motion`, smooth states (hover, focus-visible, active).

### Step 3: Reference Lookups by Domain

| Need | Where to Look | Key Guidance |
|------|--------------|--------------|
| Accessibility & Focus | `references/quick-reference.md` §1 | Visible 2px focus ring, 4.5:1 contrast, screen reader labels, keyboard navigable |
| Touch & Mobile Targets | `references/quick-reference.md` §2 | Min 44x44px touch target, 8px spacing, active pressed feedback |
| Performance & CLS | `references/quick-reference.md` §3 | Reserved image/skeleton dimensions, lazy load below-the-fold, avoid layout shift |
| Visual Style & Polish | `references/quick-reference.md` §4 & `data/styles.csv` | SVG vector icons only (no emojis), unified elevation, cohesive border-radius |
| Responsive Layout | `references/quick-reference.md` §5 | Mobile-first, no horizontal scroll, adaptive containers |
| Typography & Tokens | `references/quick-reference.md` §6 & `data/typography.csv` | Semantic tokens, 1.5 line-height, avoid raw hex colors in components |
| Animations & States | `references/quick-reference.md` §7 | GPU transforms only (opacity/translate), interruptible animations |
| Forms & Inputs | `references/quick-reference.md` §8 | Visible labels, error messages near fields, accessible form validation |
| Navigation & Back | `references/quick-reference.md` §9 | Predictable back behavior, deep linking, max 5 bottom nav items |
| Charts & Data | `references/quick-reference.md` §10 | Tooltips on hover/tap, accessible data contrast, legend visible |

### Step 4: Tech Stack Integration
For this repository:
- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) with CSS variables
- **Components**: Radix UI primitives / shadcn/ui components (`@/components/ui/*`)
- **Icons**: Lucide React (`lucide-react`)
- **Animations & Interaction**: CSS transitions, subtle micro-animations, accessible state layers

---

## If a search returns 0 results

Do not fabricate output. Instead:
1. Retry once with a narrower query or an explicit domain/stack.
2. If still empty, fall back to the priority table above and say explicitly to the user that this recommendation came from the built-in defaults, not a database match (e.g. "no palette match for X, using general SaaS defaults").
3. Never present a 0-result search as if it returned data.

## Example Workflow

**User request:** "Make an AI search homepage." (stack detected as Next.js from `package.json`)

```bash
# Step 2: design system
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" "AI search tool modern minimal" --design-system -p "AI Search"

# Step 3: supplement
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" "keyboard focus modal" --domain ux

# Step 4: stack guidelines
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" "suspense streaming bundle" --stack nextjs
```

Then synthesize the design system + detailed searches and implement.

## Output Formats

`--design-system` supports `-f ascii` (default, terminal display), `-f markdown` (documentation), and `--json` (machine-readable, includes the raw design system dict plus persistence status).

## Tips for Better Results

- Keep one dominant intent and 2–5 meaningful terms per query: `"keyboard focus modal"`, not a full audit checklist
- Retry once with a narrower phrase or explicit domain/stack; do not cycle through unrelated keywords
- Use `--design-system` for a new project/page and `--domain` for a focused concern
- Pass the detected stack explicitly for implementation-specific guidance

| Problem | What to Do |
|---------|------------|
| Can't decide on style/color | Re-run `--design-system` with different keywords |
| Dark mode contrast issues | `references/quick-reference.md` §6: `color-dark-mode` + `color-accessible-pairs` |
| Animations feel unnatural | `references/quick-reference.md` §7: `spring-physics` + `easing` + `exit-faster-than-enter` |
| Form UX is poor | `references/quick-reference.md` §8: `inline-validation` + `error-clarity` + `focus-management` |
| Navigation feels confusing | `references/quick-reference.md` §9: `nav-hierarchy` + `bottom-nav-limit` + `back-behavior` |
| Layout breaks on small screens | `references/quick-reference.md` §5: `mobile-first` + `breakpoint-consistency` |
| Performance / jank | `references/quick-reference.md` §3: `virtualize-lists` + `main-thread-budget` + `debounce-throttle` |

## Before Delivering App UI

Read `references/pro-rules.md` and run through its canonical Pre-Delivery Checklist. It covers icon/visual-element discipline, interaction feedback, light/dark contrast, safe-area layout, and accessibility — scoped to native/mobile app UI (iOS/Android/React Native/Flutter).
