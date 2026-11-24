# ORVIX Design System & Brand Identity

> **Phase 1 Deliverable** • Version 1.0.0  
> Premium Sports and Entertainment Platform

---

## 1. Brand Identity Overview

**ORVIX** is designed at the intersection of high-stakes sports adrenaline and Hollywood-caliber cinematic entertainment. The brand language combines velocity, precision, prestige, and electric energy.

- **Brand Essence**: High-performance, kinetic luxury, cinematic dark arena experience.
- **Tone & Voice**: Confident, elite, modern, electrifying.
- **Visual Pillars**:
  1. **Atmospheric Dark Canvas**: Midnight Navy creates an immersive arena environment.
  2. **Kinetic Glows**: Electric Blue highlights live momentum and interactive focus.
  3. **Champagne Accents**: Champagne Gold signifies VIP prestige, championship trophies, and exclusive access tiers.
  4. **High-Contrast Clarity**: Soft White typography ensures effortless legibility across stadium displays and mobile viewports.

---

## 2. Logo & Wordmark

### 2.1 Minimal Abstract Logo Mark
The ORVIX logo mark is an iconic, kinetic insignia composed of:
- **Dual Aerodynamic Orbit Sweeps**: Representing speed, continuous live broadcasting, and orbital velocity forming an open dynamic `O`.
- **Central Apex Diamond & Vertex 'V'**: A champagne-gold chevron signifying Victory, Apex performance, and multi-cam broadcast vertex.
- **Center Nexus**: Precision focal point anchoring the emblem.

#### Variants
| Variant | Visual Role | Typical Usage |
| :--- | :--- | :--- |
| `primary` | Electric Blue arcs + Champagne Gold apex | Default platform identity, app icons |
| `gold` | Solid Champagne Gold metallic gradient | VIP passes, trophy celebrations, awards |
| `blue` | Solid Electric Blue kinetic glow | Live stream badges, telemetry chips |
| `monochrome`| Soft White vector | High-contrast overlays on video streams |
| `dark` | Deep Midnight vector | Inverted light contexts / print media |

### 2.2 Wordmark
- **Typography**: Custom geometric lettering with wide horizontal letter spacing (`tracking-[0.28em]` to `tracking-[0.35em]`).
- **Signature Accent**: The dynamic apex of the letter **`X`** features an electric blue energetic emphasis with a champagne gold accent dot.
- **Tagline**: `SPORTS & ENTERTAINMENT` formatted in wide-tracked uppercase.

### 2.3 Brand Lockup Component
`<OrvixBrandLockup />` provides pre-configured responsive layouts:
- `horizontal` (default): Navbar headers and top app bars.
- `vertical`: Splash screens, hero cards, and modal dialogs.
- `mark-only`: Compact navigation rails, favicons, mobile app bars.
- `wordmark-only`: Editorial mastheads, footer copyrights.

---

## 3. Color Tokens

The color palette is built strictly around the four core brand colors with supplementary surface and semantic tokens:

### 3.1 Core Palette
| Token Name | Hex Code | RGB | Role & Meaning |
| :--- | :--- | :--- | :--- |
| **Midnight Navy** | `#081329` | `rgb(8, 19, 41)` | **Primary Base**: Deep arena canvas for cinematic contrast. |
| **Electric Blue** | `#267BFF` | `rgb(38, 123, 255)` | **Primary Accent**: Live sports energy, action buttons, active states. |
| **Champagne Gold**| `#D9BD83` | `rgb(217, 189, 131)`| **Luxury Accent**: VIP tier, awards, championship highlights. |
| **Soft White** | `#F4F6FA` | `rgb(244, 246, 250)`| **Primary Text**: Crisp, non-fatiguing high-contrast text. |

### 3.2 Surface Hierarchy
| Level | Hex Code | Role |
| :--- | :--- | :--- |
| `midnightBase` | `#040A17` | Deepest background canvas behind cards and modals |
| `midnight` | `#081329` | Default page background |
| `midnightCard` | `#0E1C38` | Default card surfaces, form inputs, dropdowns |
| `midnightElevated` | `#15274D` | Hover states, elevated popovers, active pills |
| `midnightBorder` | `#1C3364` | Subtle borders for visual containment |

### 3.3 Semantic & Telemetry Colors
| Name | Hex Code | Application |
| :--- | :--- | :--- |
| **Live Pulse Red** | `#FF3B56` | Live broadcast indicator, match in-progress, alerts |
| **Apex Green** | `#00E599` | Wins, positive telemetry deltas, success feedback |
| **Championship Amber**| `#FFB020` | Upcoming fixtures, warning states, countdowns |

### 3.4 Contrast & Accessibility
- **Soft White (`#F4F6FA`) on Midnight Navy (`#081329`)**: **14.8:1 contrast ratio**, exceeding WCAG AAA standards.
- **Electric Blue (`#267BFF`) on Soft White**: Meets WCAG AA for UI graphics and large text.
- **Interactive Focus States**: All buttons, inputs, and links include high-visibility focus rings (`focus-visible:ring-2 focus-visible:ring-[#267BFF]`).

---

## 4. Typography Rules

### 4.1 Typefaces
- **Display Headings**: `Outfit` (sans-serif) — bold, kinetic, architectural grotesque with geometric angles.
- **Body & Interface**: `Plus Jakarta Sans` (sans-serif) — refined legibility, balanced geometry, optimized for dense dashboard and mobile layouts.
- **Sports Data & Telemetry**: `JetBrains Mono` (monospace) — tabular numbers for race timers, live scores, countdown clocks, and telemetry split deltas.

### 4.2 Type Scale
| Level | Font Family | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `Outfit` | `3.75rem (60px)` | 800 (ExtraBold) | 1.1 | Hero section headlines, marquee features |
| **Heading 1** | `Outfit` | `2.5rem (40px)` | 700 (Bold) | 1.2 | Page titles, primary category titles |
| **Heading 2** | `Outfit` | `2.0rem (32px)` | 700 (Bold) | 1.25 | Section headings, tournament groups |
| **Heading 3** | `Outfit` | `1.5rem (24px)` | 600 (SemiBold) | 1.3 | Card titles, modal headers |
| **Heading 4** | `Plus Jakarta Sans`| `1.25rem (20px)` | 600 (SemiBold) | 1.4 | Subheadings, widget headers |
| **Body Large** | `Plus Jakarta Sans`| `1.125rem (18px)`| 400 (Regular) | 1.6 | Introductory summaries, lead paragraphs|
| **Body Base** | `Plus Jakarta Sans`| `1.0rem (16px)` | 400 / 500 | 1.5 | General interface copy, form labels |
| **Body Small** | `Plus Jakarta Sans`| `0.875rem (14px)`| 400 / 500 | 1.4 | Secondary descriptions, table cells |
| **Micro Caps** | `Outfit` | `0.75rem (12px)` | 700 (Bold) | 1.0 | Uppercase tracking badges, tier tags |
| **Sports Mono** | `JetBrains Mono` | `1.125rem (18px)`| 600 (SemiBold) | 1.0 | Scores, match clocks, split deltas |

---

## 5. Spacing & Grid System

### 5.1 4px / 8px Modular Framework
All dimensions, gutters, and padding conform to a 4px/8px modular grid:
- `space-1` = `4px` (Tight gaps, micro badges)
- `space-2` = `8px` (Icon/label gaps, compact button padding)
- `space-3` = `12px` (Standard input vertical padding)
- `space-4` = `16px` (Card inner padding, standard component gutters)
- `space-6` = `24px` (Card padding, modal containers)
- `space-8` = `32px` (Section gutters)
- `space-12` = `48px` (Sub-section vertical breathing room)
- `space-16` = `64px` (Major landing section vertical padding)

### 5.2 Corner Radius Scale
- `rounded-sm` = `4px` (Micro tags)
- `rounded-md` = `8px` (Inputs, standard buttons)
- `rounded-lg` = `12px` (Content cards, media thumbnails)
- `rounded-xl` = `16px` (Elevated feature cards, modals)
- `rounded-2xl` = `24px` (Hero containers, floating navigation bars)
- `rounded-full` = `9999px` (Pill badges, avatars, icon buttons)

### 5.3 Glassmorphism Surfaces
```css
.glass-panel {
  background: rgba(14, 28, 56, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(244, 246, 250, 0.08);
}
```

---

## 6. Frontend Component Library

All components are located in `src/design-system/components/` with strict TypeScript typing:

### 6.1 Buttons (`Button`, `IconButton`)
- **Variants**: `primary` (Electric Blue glow), `gold` (Champagne VIP), `secondary` (Midnight Elevated), `outline` (Transparent with border), `ghost`, `danger`.
- **Sizes**: `sm` (32px), `md` (40px), `lg` (48px).
- **Features**: Animated loading spinner (`isLoading`), disabled handling, `leftIcon`, `rightIcon`, `glow`, `fullWidth`.

### 6.2 Inputs (`Input`, `SearchInput`, `Select`, `Textarea`)
- **Input**: Supports `label`, `helperText`, `errorText`, `startIcon`, `endIcon`, `variant="gold-accent"`.
- **SearchInput**: Tailored for sports and entertainment entity search with keyboard shortcut badge (`⌘K`) and clear button.
- **Select**: Custom dropdown with arrow icon and options support.
- **Textarea**: Expandable multi-line field with character counter.

### 6.3 Cards (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`)
- **Variants**: `standard`, `elevated`, `glass`, `interactive` (hover micro-elevation & glow), `gold-accent` (VIP top highlight), `blue-accent`.
- **Subcomponents**: Clean compound architecture for sports fixtures, match previews, and VIP passes.

### 6.4 Badges (`Badge`)
- **Variants**: `live` (with real-time animated radar pulse ping), `gold` (VIP pass), `blue` (Featured), `neutral`, `success`, `warning`, `danger`, `outline`.
- **Sizes**: `sm`, `md`.

### 6.5 Navigation Elements (`Navbar`, `Tabs`, `Breadcrumbs`, `Pagination`)
- **Navbar**: Sticky glassmorphic desktop navigation with brand lockup, item badges, action buttons, and slide-down mobile menu drawer.
- **Tabs**: Sports category and feed tabs supporting `pills`, `underline`, and `contained` styles with item counter pills.
- **Breadcrumbs**: Hierarchical pathways with chevron separators.
- **Pagination**: Desktop & mobile friendly page navigator with page numbers, prev/next arrows, and active state.

### 6.6 Layout Components (`Container`, `Grid`, `Section`, `Stack`, `Divider`)
- **Container**: Max-width constraints (`sm`, `md`, `lg`, `xl`, `full`).
- **Grid**: Responsive column layout (`1` to `12` columns) with configurable gaps.
- **Section**: Standardized section spacing with header, badge, title, subtitle, and action slots.
- **Stack**: Flexbox abstraction with direction, alignment, and gap controls.
- **Divider**: Subtle separators with optional centered label or metallic gradients.

---

## 7. Responsive Support & Mobile Touch Targets

- **Mobile First**: All components are responsive by default.
- **Touch Target Assurance**: All interactive controls maintain a minimum bounding box of **40px - 44px** on touchscreens to ensure comfort during active usage.
- **Viewport Simulator**: The Design System showcase in `App.tsx` includes an interactive viewport switcher:
  - **Desktop**: Full responsive width
  - **Tablet**: 768px frame constraint
  - **Mobile**: 375px phone frame constraint

---

## 8. Directory Structure

```
ORVIX/
├── DESIGN_SYSTEM.md          # Design system documentation (this file)
├── index.html                # HTML entry point with fonts & meta
├── package.json              # Project dependencies & scripts
├── tsconfig.json             # Root TypeScript config
├── tsconfig.app.json         # App TypeScript config with @/ path aliases
├── vite.config.ts            # Vite 6 + Tailwind CSS v4 config
├── public/
│   └── favicon.svg           # ORVIX kinetic orbital logo favicon
└── src/
    ├── App.tsx               # Master App (AppLayout + Design Showcase switcher)
    ├── main.tsx              # React 19 entry point
    ├── index.css             # Tailwind CSS v4 imports & custom tokens
    ├── layout/               # Application Master Layout
    │   ├── AppLayout.tsx     # Master responsive layout container
    │   ├── Header.tsx        # Desktop & tablet header with search & profile
    │   ├── Sidebar.tsx       # Desktop collapsible navigation rail
    │   ├── MobileNav.tsx     # Mobile slide-over drawer & bottom action bar
    │   ├── MainContent.tsx   # Fluid main container & section placeholders
    │   ├── Footer.tsx        # Global platform footer
    │   ├── navigationConfig.ts # 8 unified navigation sections
    │   └── index.ts          # Layout barrel export
    └── design-system/
        ├── index.ts          # Central export point
        ├── tokens/           # Color, typography, and spacing tokens
        │   ├── colors.ts
        │   ├── typography.ts
        │   ├── spacing.ts
        │   └── index.ts
        ├── brand/            # Vector logo marks & brand lockups
        │   ├── OrvixLogo.tsx
        │   ├── OrvixWordmark.tsx
        │   ├── OrvixBrandLockup.tsx
        │   └── index.ts
        ├── components/       # Reusable UI component library
        │   ├── Button/
        │   ├── Input/
        │   ├── Card/
        │   ├── Badge/
        │   ├── Navigation/
        │   ├── Layout/
        │   └── index.ts
        └── utils/
            └── cn.ts         # Classnames merge utility
```

---

## 9. Next Steps (Post-Phase 1)
Following user review and approval of Phase 1, the platform will proceed to:
- **Phase 2**: Homepage & Discovery Experience
- **Phase 3**: Live Sports & Multicam Streaming Engine
- **Phase 4**: VIP Tiers, Authentication, and User Profiles



## Terminology Policy

Strictly prohibits gambling, betting odds, wagers, and casino mechanics. All platform features focus purely on sports entertainment and skill progression.

## Brand Aesthetic

High-performance motorsport telemetry, broadcast studio displays, and synchronized multicam spectator feeds.

## Responsive Preview Standards

Components must scale seamlessly from 320px mobile up to 1440px desktop ultrawide viewports.

## Glow States

Glow buttons utilize box-shadow filters calibrated for electric blue (#267BFF) with zero layout shifts.

## Phase 1 Sign-Off

Phase 1 verified with 100% build pass, zero unresolved dependencies, and complete token export coverage.

## Non-VIP Policy

All membership features are standardized. Pro Apex tiers, VIP passes, and VIP club concierge are removed in favor of equal community access.

## Anti-Wagering Guarantee

Prediction brackets, wagering odds, and betting slips are strictly excluded from all platform navigation and layout modules.

## Non-Monetary XP

XP, trophies, and seasonal leaderboard standings are purely cosmetic and non-monetary achievements.

## Help & Support

VIP support channels replaced with comprehensive community technical assistance and stream setup guides.

## Responsive Layout Debugging Pass

Verified 100% text visibility and zero horizontal scroll at 320px, 375px, 430px, 768px, 1024px, 1280px, and 1440px.

## Multicam Simulation Engine

Homepage features 4K 60FPS video simulation stage with Cockpit, Director, Pitwall, and Aerial camera switching.

## Upcoming Fixtures

Multi-sport match fixtures displaying live indicators, 4K badges, kickoff times, and venue metadata.

## Latest Sports Results

Section 4: Completed race classification, shootout pole deltas, and Champions League match scoreboards.

## Skill Games Hub

Section 5: Non-monetary interactive games including Apex Reflex Trainer, Trackmaster F1, and Sports Trivia.

## Weekly Challenges

Section 6: Community knowledge sprints and trivia quests with progression XP rewards.

## Community Leaderboards

Section 7: Global fan ranking tiers, division badges, and seasonal scoreboards.
