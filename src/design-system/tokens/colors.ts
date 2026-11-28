/**
 * ORVIX Brand Color Tokens — Graphite × Champagne Design System (R1 Final)
 * Hybrid Palette: Deep Graphite + Graphite + Champagne + Soft Silver + Warm White + Steel Gray + Slate
 * Mostly dark interface direction (~65% Deep Graphite/Graphite, ~20% Soft Silver/neutrals, ~10% Warm White, ~5% Champagne accents)
 */

export interface ColorToken {
  name: string
  hex: string
  rgb?: string
  role: string
  description: string
  textColor: 'light' | 'dark'
}

export const brandColors = {
  // Approved R1 Final Color Tokens
  deepGraphite: {
    name: 'Deep Graphite',
    hex: '#171B1E',
    rgb: '23, 27, 30',
    role: 'Main Application Background & Sports Center Base',
    description: 'Deep neutral graphite foundation providing broadcast stadium contrast.',
    textColor: 'light',
  },
  graphite: {
    name: 'Graphite',
    hex: '#252A2E',
    rgb: '37, 42, 46',
    role: 'Primary Cards, Surfaces & Secondary Actions',
    description: 'Crisp structural graphite for default container cards, fixture panels, and input fields.',
    textColor: 'light',
  },
  champagne: {
    name: 'Champagne',
    hex: '#C6AD7B',
    rgb: '198, 173, 123',
    role: 'Brand Accent & Primary Action Buttons (~5%)',
    description: 'Refined warm metallic champagne used selectively for primary buttons, active indicators, and brand marks.',
    textColor: 'dark',
  },
  softSilver: {
    name: 'Soft Silver',
    hex: '#D9DEE2',
    rgb: '217, 222, 226',
    role: 'Secondary Surfaces & Editorial Cards (~20%)',
    description: 'Refined modern silver surface for editorial reading cards, chips, and structural dividers.',
    textColor: 'dark',
  },
  warmWhite: {
    name: 'Warm White',
    hex: '#F6F5F1',
    rgb: '246, 245, 241',
    role: 'Light Editorial Surfaces & Primary High-Contrast Text (~10%)',
    description: 'Clean, glare-free optical warm white for editorial sections, article reading rooms, and headings.',
    textColor: 'dark',
  },
  steelGray: {
    name: 'Steel Gray',
    hex: '#8D9AA3',
    rgb: '141, 154, 163',
    role: 'Subtle Borders & Secondary Accents',
    description: 'Modern metallic steel gray used for subtle borders, secondary accents, and metadata labels.',
    textColor: 'light',
  },
  slate: {
    name: 'Slate',
    hex: '#68737D',
    rgb: '104, 115, 125',
    role: 'Secondary Typography, Passive Metadata & Dividers',
    description: 'Balanced mineral slate gray providing clear typographic hierarchy without visual noise.',
    textColor: 'light',
  },

  // Legacy compatibility tokens mapped to Graphite × Champagne
  charcoal: {
    name: 'Graphite',
    hex: '#252A2E',
    rgb: '37, 42, 46',
    role: 'Strong Surface',
    description: 'Mapped to Graphite.',
    textColor: 'light',
  },
  darkSurface: {
    name: 'Graphite',
    hex: '#252A2E',
    rgb: '37, 42, 46',
    role: 'Default Surface',
    description: 'Mapped to Graphite.',
    textColor: 'light',
  },
  mutedGray: {
    name: 'Slate',
    hex: '#68737D',
    rgb: '104, 115, 125',
    role: 'Muted Meta',
    description: 'Mapped to Slate.',
    textColor: 'light',
  },
  deepCharcoal: {
    name: 'Deep Graphite',
    hex: '#171B1E',
    rgb: '23, 27, 30',
    role: 'Deep Canvas',
    description: 'Mapped to Deep Graphite.',
    textColor: 'light',
  },
  coolWhite: {
    name: 'Warm White',
    hex: '#F6F5F1',
    rgb: '246, 245, 241',
    role: 'Light Editorial Canvas',
    description: 'Mapped to Warm White.',
    textColor: 'dark',
  },
  forestGreen: {
    name: 'Graphite',
    hex: '#252A2E',
    rgb: '37, 42, 46',
    role: 'Strong Surface',
    description: 'Mapped to Graphite.',
    textColor: 'light',
  },
  electricLime: {
    name: 'Champagne',
    hex: '#C6AD7B',
    rgb: '198, 173, 123',
    role: 'Brand Accent',
    description: 'Mapped to Champagne.',
    textColor: 'dark',
  },
  warmIvory: {
    name: 'Warm White',
    hex: '#F6F5F1',
    rgb: '246, 245, 241',
    role: 'Light Canvas',
    description: 'Mapped to Warm White.',
    textColor: 'dark',
  },
  softWhite: {
    name: 'Warm White',
    hex: '#F6F5F1',
    rgb: '246, 245, 241',
    role: 'Light Text',
    description: 'Mapped to Warm White.',
    textColor: 'dark',
  },
  mutedSage: {
    name: 'Slate',
    hex: '#68737D',
    rgb: '104, 115, 125',
    role: 'Muted Meta',
    description: 'Mapped to Slate.',
    textColor: 'light',
  },
  warmCoral: {
    name: 'Warm Coral Alert',
    hex: '#E47D5B',
    rgb: '228, 125, 91',
    role: 'Time-Sensitive Alert',
    description: 'Alert and urgent action indicator.',
    textColor: 'light',
  },
  midnightNavy: {
    name: 'Deep Graphite',
    hex: '#171B1E',
    rgb: '23, 27, 30',
    role: 'Deep Canvas',
    description: 'Mapped to Deep Graphite.',
    textColor: 'light',
  },
  electricBlue: {
    name: 'Champagne',
    hex: '#C6AD7B',
    rgb: '198, 173, 123',
    role: 'Brand Accent',
    description: 'Mapped to Champagne.',
    textColor: 'dark',
  },
  champagneGold: {
    name: 'Champagne',
    hex: '#C6AD7B',
    rgb: '198, 173, 123',
    role: 'Brand Accent',
    description: 'Mapped to Champagne.',
    textColor: 'dark',
  },
} as const

export const semanticColors = {
  // Backgrounds
  background: {
    primaryDark: '#171B1E',
    secondaryDark: '#252A2E',
    primaryLight: '#F6F5F1',
    secondaryLight: '#D9DEE2',
    deepGraphite: '#171B1E',
    graphite: '#252A2E',
    editorial: '#F6F5F1',
  },
  // Surfaces
  surface: {
    dark: '#252A2E',
    darkElevated: '#2E343A',
    darkSubtle: '#1D2225',
    light: '#F6F5F1',
    lightElevated: '#FFFFFF',
    silver: '#D9DEE2',
    champagneSubtle: 'rgba(198, 173, 123, 0.12)',
    steelSubtle: 'rgba(141, 154, 163, 0.12)',
  },
  // Text
  text: {
    primaryOnDark: '#F6F5F1',
    secondaryOnDark: '#D9DEE2',
    mutedOnDark: '#8D9AA3',
    subtleOnDark: '#68737D',
    primaryOnLight: '#171B1E',
    secondaryOnLight: '#252A2E',
    mutedOnLight: '#68737D',
    accentChampagne: '#C6AD7B',
    accentSteel: '#8D9AA3',
    onChampagne: '#171B1E', // Dark text on Champagne ensures 8.1:1 AAA contrast
  },
  // Actions
  action: {
    primaryBg: '#C6AD7B', // Champagne primary button
    primaryText: '#171B1E', // Dark text for accessible contrast
    primaryHover: '#B59C6A',
    primaryActive: '#A48B59',
    secondaryBg: '#252A2E', // Graphite secondary button
    secondaryText: '#F6F5F1',
    secondaryHover: '#2E343A',
    secondaryActive: '#1D2225',
    steelBg: '#8D9AA3',
    steelText: '#171B1E',
    steelHover: '#7D8A93',
    silverBg: '#D9DEE2',
    silverText: '#171B1E',
    silverHover: '#CAD0D5',
    darkBg: '#171B1E',
    darkText: '#F6F5F1',
    darkHover: '#252A2E',
  },
  // Borders
  border: {
    dark: '#363C42',
    darkSubtle: '#2A3035',
    darkElevated: '#424950',
    light: '#D9DEE2',
    lightSubtle: '#E4E8EB',
    champagneAccent: '#C6AD7B',
    steelAccent: '#8D9AA3',
  },
  // Statuses
  status: {
    live: '#C6AD7B',
    success: '#729B79',
    warning: '#C4924A',
    error: '#C25B5B',
    info: '#8D9AA3',
  },
} as const

// Legacy surfaceColors interface preserved for compatibility
export const surfaceColors = {
  midnightBase: {
    name: 'Deep Graphite Base',
    hex: '#171B1E',
    role: 'Deepest Canvas',
    description: 'Clean deep graphite background for sports center pages.',
  },
  midnightCard: {
    name: 'Graphite Surface Card',
    hex: '#252A2E',
    role: 'Default Surface / Card',
    description: 'Standard container surface with neutral graphite tones.',
  },
  midnightElevated: {
    name: 'Elevated Graphite Surface',
    hex: '#2E343A',
    role: 'Hover & Elevated Menus',
    description: 'Interactive hover states, popovers, and elevated modals.',
  },
  midnightBorder: {
    name: 'Neutral Graphite Border',
    hex: '#363C42',
    role: 'Structural Border',
    description: 'Subtle borders separating cards, headers, and grid lanes.',
  },
} as const

export const textColors = {
  primary: {
    name: 'Warm White',
    hex: '#F6F5F1',
    role: 'Primary Headings & Key Data',
  },
  muted: {
    name: 'Steel Gray',
    hex: '#8D9AA3',
    role: 'Secondary Body & Subtitles',
  },
  subtle: {
    name: 'Slate',
    hex: '#68737D',
    role: 'Meta Labels, Timestamps & Placeholders',
  },
} as const

export const statusColors = {
  livePulse: {
    name: 'Champagne / Live',
    hex: '#C6AD7B',
    role: 'Live Match Broadcast & Critical Alerts',
  },
  success: {
    name: 'Clean Modern Green',
    hex: '#729B79',
    role: 'Completed Milestones & Active Status',
  },
  warning: {
    name: 'Understated Amber',
    hex: '#C4924A',
    role: 'Upcoming Events & Time Limits',
  },
  info: {
    name: 'Slate',
    hex: '#68737D',
    role: 'Informational Badges & Telemetry Labels',
  },
} as const

export const glowEffects = {
  champagneAccent: '0 2px 12px rgba(198, 173, 123, 0.22)',
  subtleElevation: '0 4px 16px rgba(0, 0, 0, 0.28)',
  cardElevation: '0 2px 8px rgba(0, 0, 0, 0.2)',
  steelAccent: '0 2px 10px rgba(141, 154, 163, 0.18)',
  // Legacy aliases mapped
  limeAccent: '0 2px 12px rgba(198, 173, 123, 0.22)',
  coralPulse: '0 2px 10px rgba(228, 125, 91, 0.2)',
  electricBlue: '0 2px 12px rgba(198, 173, 123, 0.22)',
  champagneGold: '0 2px 12px rgba(198, 173, 123, 0.22)',
  livePulse: '0 2px 12px rgba(198, 173, 123, 0.22)',
} as const
