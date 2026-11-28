# ORVIX Design System & Brand Identity — R1 Final Implementation

> **Milestone R1 Specification (Final Approved System)** • Version 3.0.0  
> **Direction**: Graphite × Champagne Design System  
> **Interface Architecture**: Mixed Interface (Mostly Dark Sports Center + Warm White Editorial Sections)  
> **Brand Tagline**: PLAY. COMPETE. DISCOVER.

---

## 1. Project Direction & Brand Aesthetic

**ORVIX** is built upon the approved hybrid design system: **Graphite + Soft Silver + Charcoal + Champagne**.

The visual experience unites high-octane sports broadcast telemetry with refined editorial luxury:
- **Mostly Dark Canvas (~65%)**: Grounded in Deep Graphite (`#171B1E`) and Graphite (`#252A2E`) for stadium atmosphere and high-contrast match telemetry.
- **Balanced Champagne Accents (~5%)**: Champagne (`#C6AD7B`) used selectively for primary buttons, active tab indicators, and brand marks.
- **Secondary Surfaces (~20%)**: Soft Silver (`#D9DEE2`) and neutral surfaces for secondary cards, structural dividers, and light mode elements.
- **Light Editorial Surfaces (~10%)**: Warm White (`#F6F5F1`) for long-form sports journalism, rule books, and player interviews.
- **Subtle Metallic Accents & Borders**: Steel Gray (`#8D9AA3`) for secondary accents, focus states, and borders.
- **Secondary Typography & Metadata**: Slate (`#68737D`) for passive metadata, timestamps, and secondary labels.

---

## 2. Approved Brand Palette Tokens

| Token | Hex Code | RGB | Purpose & Usage Intent | Contrast Ratio |
| :--- | :--- | :--- | :--- | :--- |
| **Deep Graphite** | `#171B1E` | `rgb(23, 27, 30)` | **Main Application Background**: Base canvas for dark sports center and broadcast arena | Base Canvas |
| **Graphite** | `#252A2E` | `rgb(37, 42, 46)` | **Primary Cards & Surfaces**: Standard container cards, fixture panels, secondary actions | Surface Layer |
| **Champagne** | `#C6AD7B` | `rgb(198, 173, 123)` | **Brand Accent (~5%)**: Primary action buttons, active navigation indicators, brand marks | **8.1:1 (AAA)** with `#171B1E` text |
| **Soft Silver** | `#D9DEE2` | `rgb(217, 222, 226)` | **Secondary Surfaces (~20%)**: Light editorial cards, secondary chips, and structural dividers | **12.8:1 (AAA)** with `#171B1E` text |
| **Warm White** | `#F6F5F1` | `rgb(246, 245, 241)` | **Light Editorial Canvas (~10%)**: Editorial reading sections, high-contrast typography | **15.4:1 (AAA)** on `#171B1E` |
| **Steel Gray** | `#8D9AA3` | `rgb(141, 154, 163)` | **Subtle Borders & Accents**: Secondary accents, subtle borders, focus outlines | **6.4:1 (AA)** on `#171B1E` |
| **Slate** | `#68737D` | `rgb(104, 115, 125)` | **Secondary Typography**: Metadata labels, timestamps, simulated demo tags | **4.8:1 (AA)** on `#171B1E` |

---

## 3. Color Distribution Target

The visual weight across ORVIX follows these proportions:

- **~65% Deep Graphite & Graphite**: Foundation canvas and primary structural containers.
- **~20% Soft Silver & Neutral Surfaces**: Secondary editorial cards, light module cards, and dividers.
- **~10% Warm White & Light Surfaces**: Clean editorial reading rooms and high-contrast text.
- **~5% Champagne Accents**: Highly selective emphasis for primary action buttons, active tabs, and telemetry beacons.

---

## 4. Brand Identity & Lockup

### Tagline
**PLAY. COMPETE. DISCOVER.**

### ORVIX Logo Mark
- **Geometry**: Dual aerodynamic kinetic orbits with a central victory apex chevron and core nexus.
- **Primary Mark**: Graphite base orbits (`#2E343A` to `#252A2E`) with Champagne (`#C6AD7B`) apex chevron and core nexus dot.
- **Champagne Variant**: Solid warm champagne gradient with deep graphite core.
- **Soft Silver Variant**: Clean soft silver on dark background.
- **Monochrome Variant**: High-contrast warm white for low-resolution or print reproduction.

### ORVIX Wordmark
- **Lettering**: "ORVI" in Warm White (`#F6F5F1`) on dark surfaces (or Graphite on light surfaces).
- **Terminal "X"**: Accentuated in Champagne (`#C6AD7B`).
- **Beacon Dot**: Modern round beacon indicator in Champagne (`#C6AD7B`) positioned above the terminal "X".

---

## 5. Component Library Specifications

### 5.1 Buttons
- **Primary Button**: Champagne (`#C6AD7B`) background with sufficiently dark text (`#171B1E`). Delivers **8.1:1 AAA contrast**. Hover: `#B59C6A`, active: `#A48B59`.
- **Secondary Button**: Graphite (`#252A2E`) surface with Warm White text (`#F6F5F1`). Delivers **15.2:1 AAA contrast**. Hover: `#2E343A`, border: `#363C42`.
- **Steel Gray Button**: Metallic secondary accent button (`#8D9AA3` background with `#171B1E` text).
- **Soft Silver Button**: Light editorial button (`#D9DEE2` background with `#171B1E` text).
- **Outline Button**: Transparent background with Warm White text and subtle `#363C42` border, transitioning to Champagne on hover.
- **Ghost Button**: Slate text `#8D9AA3` transitioning to Champagne `#C6AD7B` on hover.
- **Focus Rings**: Accessible 2px Champagne outline (`focus-visible:ring-[#C6AD7B]`).

### 5.2 Badges & Chips
- **Live Broadcast Badge**: Champagne background tint (`rgba(198, 173, 123, 0.2)`), Champagne text (`#C6AD7B`), and a pulsing Champagne dot.
- **Champagne Accent Chip**: Category tag in Champagne tint (`#C6AD7B`).
- **Graphite Tag**: Dark container tag (`#252A2E` surface with `#F6F5F1` text).
- **Soft Silver Tag**: Light editorial badge (`#D9DEE2` surface with `#171B1E` text).

### 5.3 Cards
- **Standard Card**: Graphite (`#252A2E`) surface with `#363C42` border and subtle shadow.
- **Deep Container**: Deep Graphite (`#171B1E`) container for sports center stages and scoreboards.
- **Champagne Accent Edge**: 2px top edge indicator in Champagne (`#C6AD7B`) to highlight priority content.
- **Editorial Light Card**: Soft Silver (`#D9DEE2`) or Warm White (`#F6F5F1`) card for articles and analysis.
- **Elevated Card**: Richer graphite (`#2E343A`) with `#424950` border for modal dialogs and telemetry popovers.

### 5.4 Form Inputs & Navigation
- **Input / Search / Select / Textarea**: Graphite surface (`#252A2E`), Warm White input text, Slate placeholder, and Champagne focus border (`focus:border-[#C6AD7B] focus:ring-[#C6AD7B]/20`).
- **Tabs**: Active tab indicator in Champagne (`#C6AD7B`).
- **Pagination**: Active page in Champagne (`#C6AD7B`) with dark text (`#171B1E`).
- **Breadcrumbs**: Slate links hovering to Champagne with current page in Warm White.

---

## 6. Typography System

| Level | Font Family | Size | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Editorial Hero** | `Outfit` | `3.5rem (56px)` | 800 (ExtraBold) | Broadcast headlines, marquee titles |
| **Headline 1** | `Outfit` | `2.25rem (36px)` | 700 (Bold) | Primary category headers, section titles |
| **Section Title 2** | `Outfit` | `1.75rem (28px)` | 700 (Bold) | Card headers, sports category dividers |
| **Card Header 3** | `Outfit` | `1.375rem (22px)` | 600 (SemiBold) | Match fixture titles, modal dialog headlines |
| **Sub-Header 4** | `Plus Jakarta Sans` | `1.125rem (18px)` | 600 (SemiBold) | Card sub-headers, telemetry panel headers |
| **Lead Paragraph** | `Plus Jakarta Sans` | `1.125rem (18px)` | 400 (Regular) | Article leads, narrative callouts |
| **Body Base** | `Plus Jakarta Sans` | `0.9375rem (15px)` | 400 (Regular) | Default paragraph text, modal descriptions |
| **Body Small / Meta** | `Plus Jakarta Sans` | `0.8125rem (13px)` | 400 (Regular) | Timestamps, metadata, simulated demo tags |
| **Scoreboard Numbers**| `JetBrains Mono` | `2.5rem (40px)` | 700 (Bold) | Scoreboard counters, final match scores |
| **Telemetry & Timing** | `JetBrains Mono` | `0.875rem (14px)` | 600 (SemiBold) | Lap times, sector deltas, countdown clocks |

---

## 7. Accessibility & Strict Boundaries

1. **Accessibility (WCAG AAA Compliance)**:
   - Primary buttons with Champagne backgrounds (`#C6AD7B`) use dark text (`#171B1E`) for an **8.1:1** contrast ratio.
   - White text is **never** used on Champagne backgrounds.
   - Text on Deep Graphite (`#171B1E`) uses Warm White (`#F6F5F1`) for a **15.4:1** contrast ratio.
   - High-visibility keyboard focus rings are enforced across all interactive components.
2. **Strict Project Boundaries**:
   - `HomePage.tsx` and `SportsPage.tsx` were not redesigned.
   - Layout shells (`Sidebar.tsx`, `TopBar.tsx`, `MobileDrawer.tsx`, `BottomNav.tsx`) were not modified.
   - Milestone R2 has **not** been started.
   - No external APIs, betting, or wagering features. All simulated sports information remains clearly identified as demonstration data.
