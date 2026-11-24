/**
 * ORVIX Brand Color Tokens
 * Premium Sports & Entertainment Platform
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
  // Primary User-Specified Palette
  midnightNavy: {
    name: 'Midnight Navy',
    hex: '#081329',
    rgb: '8, 19, 41',
    role: 'Primary Canvas & Brand Base',
    description: 'Deep, cinematic dark foundation representing high-stakes arena exclusivity.',
    textColor: 'light',
  },
  electricBlue: {
    name: 'Electric Blue',
    hex: '#267BFF',
    rgb: '38, 123, 255',
    role: 'Primary Action & Live Energy',
    description: 'Kinetic, high-octane blue signifying live athletic motion and interactive focus.',
    textColor: 'light',
  },
  champagneGold: {
    name: 'Champagne Gold',
    hex: '#D9BD83',
    rgb: '217, 189, 131',
    role: 'Prestige, VIP & Trophies',
    description: 'Refined metallic gold representing championship glory, premium tiers, and VIP access.',
    textColor: 'dark',
  },
  softWhite: {
    name: 'Soft White',
    hex: '#F4F6FA',
    rgb: '244, 246, 250',
    role: 'Primary Text & Crisp Accents',
    description: 'High-contrast, non-fatiguing cool white for maximum legibility in dark environments.',
    textColor: 'dark',
  },
} as const

export const surfaceColors = {
  midnightBase: {
    name: 'Midnight Base',
    hex: '#040A17',
    role: 'Deep Canvas',
    description: 'Deepest background level for ambient contrast behind elevated panels.',
  },
  midnightCard: {
    name: 'Midnight Card',
    hex: '#0E1C38',
    role: 'Default Surface / Card',
    description: 'Standard container surface with subtle cool slate undertones.',
  },
  midnightElevated: {
    name: 'Midnight Elevated',
    hex: '#15274D',
    role: 'Hover & Elevated Menus',
    description: 'Interactive hover states, popovers, and elevated modals.',
  },
  midnightBorder: {
    name: 'Midnight Border',
    hex: '#1C3364',
    role: 'Structural Border',
    description: 'Crisp borders separating cards, header sections, and grid lanes.',
  },
} as const

export const textColors = {
  primary: {
    name: 'Soft White',
    hex: '#F4F6FA',
    role: 'Primary Headings & Key Data',
  },
  muted: {
    name: 'Muted Slate',
    hex: '#94A3B8',
    role: 'Secondary Body & Subtitles',
  },
  subtle: {
    name: 'Subtle Ash',
    hex: '#64748B',
    role: 'Meta Labels, Timestamps & Placeholders',
  },
} as const

export const statusColors = {
  livePulse: {
    name: 'Live Red',
    hex: '#FF3B56',
    role: 'Live Match Broadcast & Critical Alerts',
  },
  success: {
    name: 'Apex Green',
    hex: '#00E599',
    role: 'Wins, Completed Purchases & Active Status',
  },
  warning: {
    name: 'Championship Amber',
    hex: '#FFB020',
    role: 'Upcoming Events & Time Limits',
  },
} as const

export const glowEffects = {
  electricBlue: '0 0 25px -4px rgba(38, 123, 255, 0.45)',
  champagneGold: '0 0 25px -4px rgba(217, 189, 131, 0.40)',
  livePulse: '0 0 20px -2px rgba(255, 59, 86, 0.45)',
} as const

