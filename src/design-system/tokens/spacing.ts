/**
 * ORVIX Spacing, Radius & Layout Tokens
 * Modular 4px/8px Grid Framework
 */

export const spacingScale = [
  { name: 'space-1', value: '4px', rem: '0.25rem', usage: 'Tightest inline gaps, badge padding' },
  { name: 'space-2', value: '8px', rem: '0.5rem', usage: 'Icon/text gap, compact button padding' },
  { name: 'space-3', value: '12px', rem: '0.75rem', usage: 'Standard input/button vertical padding' },
  { name: 'space-4', value: '16px', rem: '1.0rem', usage: 'Card inner padding, default component gutters' },
  { name: 'space-5', value: '20px', rem: '1.25rem', usage: 'Intermediate spacing for grouped elements' },
  { name: 'space-6', value: '24px', rem: '1.5rem', usage: 'Card padding, dialog padding, stack spacing' },
  { name: 'space-8', value: '32px', rem: '2.0rem', usage: 'Section gutters, large modal spacing' },
  { name: 'space-10', value: '40px', rem: '2.5rem', usage: 'Component block separations' },
  { name: 'space-12', value: '48px', rem: '3.0rem', usage: 'Sub-section separations' },
  { name: 'space-16', value: '64px', rem: '4.0rem', usage: 'Major landing section vertical padding' },
  { name: 'space-24', value: '96px', rem: '6.0rem', usage: 'Hero section vertical breathing room' },
] as const

export const radiusScale = [
  { name: 'radius-none', value: '0px', usage: 'Square banners, tabular raw views' },
  { name: 'radius-sm', value: '4px', usage: 'Micro tags, small badges' },
  { name: 'radius-md', value: '8px', usage: 'Inputs, default buttons, dropdown menus' },
  { name: 'radius-lg', value: '12px', usage: 'Content cards, media thumbnails, modals' },
  { name: 'radius-xl', value: '16px', usage: 'Feature cards, elevated panels, glass overlays' },
  { name: 'radius-2xl', value: '24px', usage: 'Hero showcase cards, floating navigation bars' },
  { name: 'radius-full', value: '9999px', usage: 'Pill badges, round icon buttons, avatars' },
] as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

