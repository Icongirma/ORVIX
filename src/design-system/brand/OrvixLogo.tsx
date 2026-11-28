import React from 'react'
import { cn } from '../utils/cn'

export type LogoVariant =
  | 'primary'
  | 'champagne'
  | 'steel'
  | 'silver'
  | 'graphite'
  | 'monochrome'
  | 'dark'
  // Legacy aliases
  | 'charcoal'
  | 'lime'
  | 'forest'
  | 'coral'
  | 'gold'
  | 'blue'

export interface OrvixLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number
  variant?: LogoVariant
  glow?: boolean
  className?: string
}

const sizeMap = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 56,
  xl: 72,
  '2xl': 96,
}

export const OrvixLogo: React.FC<OrvixLogoProps> = ({
  size = 'md',
  variant = 'primary',
  glow = false,
  className,
  ...props
}) => {
  const dimension = typeof size === 'number' ? size : sizeMap[size]
  const idPrefix = React.useId().replace(/:/g, '')

  // Color schemes for variations
  const renderDefs = () => {
    switch (variant) {
      case 'champagne':
      case 'gold':
      case 'lime':
        return (
          <defs>
            <linearGradient id={`${idPrefix}-champagne`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4BE8D" />
              <stop offset="100%" stopColor="#C6AD7B" />
            </linearGradient>
          </defs>
        )
      case 'steel':
        return (
          <defs>
            <linearGradient id={`${idPrefix}-steel`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A4B1BA" />
              <stop offset="100%" stopColor="#8D9AA3" />
            </linearGradient>
          </defs>
        )
      case 'silver':
        return (
          <defs>
            <linearGradient id={`${idPrefix}-silver`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F6F5F1" />
              <stop offset="100%" stopColor="#D9DEE2" />
            </linearGradient>
          </defs>
        )
      case 'graphite':
      case 'dark':
      case 'charcoal':
      case 'forest':
        return (
          <defs>
            <linearGradient id={`${idPrefix}-graphite`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E343A" />
              <stop offset="100%" stopColor="#252A2E" />
            </linearGradient>
          </defs>
        )
      case 'monochrome':
        return (
          <defs>
            <linearGradient id={`${idPrefix}-white`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F6F5F1" />
            </linearGradient>
          </defs>
        )
      case 'coral':
        return (
          <defs>
            <linearGradient id={`${idPrefix}-coral-warm`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EE9375" />
              <stop offset="100%" stopColor="#E47D5B" />
            </linearGradient>
          </defs>
        )
      case 'blue':
      case 'primary':
      default:
        return (
          <defs>
            <linearGradient id={`${idPrefix}-graphite-base`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E343A" />
              <stop offset="100%" stopColor="#252A2E" />
            </linearGradient>
            <linearGradient id={`${idPrefix}-champagne-accent`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4BE8D" />
              <stop offset="100%" stopColor="#C6AD7B" />
            </linearGradient>
          </defs>
        )
    }
  }

  // Determine fills based on variant
  const getFills = () => {
    switch (variant) {
      case 'champagne':
      case 'gold':
      case 'lime':
        return {
          upperArc: `url(#${idPrefix}-champagne)`,
          lowerArc: `url(#${idPrefix}-champagne)`,
          apexChevron: '#171B1E',
          coreNexus: '#171B1E',
        }
      case 'steel':
        return {
          upperArc: `url(#${idPrefix}-steel)`,
          lowerArc: `url(#${idPrefix}-steel)`,
          apexChevron: '#171B1E',
          coreNexus: '#8D9AA3',
        }
      case 'silver':
        return {
          upperArc: `url(#${idPrefix}-silver)`,
          lowerArc: `url(#${idPrefix}-silver)`,
          apexChevron: '#171B1E',
          coreNexus: '#C6AD7B',
        }
      case 'graphite':
      case 'dark':
      case 'charcoal':
      case 'forest':
        return {
          upperArc: `url(#${idPrefix}-graphite)`,
          lowerArc: `url(#${idPrefix}-graphite)`,
          apexChevron: '#C6AD7B',
          coreNexus: '#C6AD7B',
        }
      case 'monochrome':
        return {
          upperArc: `url(#${idPrefix}-white)`,
          lowerArc: `url(#${idPrefix}-white)`,
          apexChevron: `url(#${idPrefix}-white)`,
          coreNexus: '#C6AD7B',
        }
      case 'coral':
        return {
          upperArc: `url(#${idPrefix}-coral-warm)`,
          lowerArc: `url(#${idPrefix}-coral-warm)`,
          apexChevron: '#F6F5F1',
          coreNexus: '#171B1E',
        }
      case 'blue':
      case 'primary':
      default:
        return {
          upperArc: `url(#${idPrefix}-graphite-base)`,
          lowerArc: `url(#${idPrefix}-graphite-base)`,
          apexChevron: `url(#${idPrefix}-champagne-accent)`,
          coreNexus: '#C6AD7B',
        }
    }
  }

  const fills = getFills()

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ORVIX Logo Mark"
      className={cn(
        'transition-transform duration-300 select-none flex-shrink-0',
        glow && 'filter drop-shadow-[0_2px_8px_rgba(198,173,123,0.22)]',
        className
      )}
      {...props}
    >
      {renderDefs()}

      {/* Aerodynamic Kinetic Orbit Ring - Upper Sector */}
      <path
        d="M22 55C18 36 31 19 50 17C64 15 76 22 81 31C74 30 65 29 54 32C39 35 30 46 28 57C25 56 23 55.5 22 55Z"
        fill={fills.upperArc}
        opacity="0.95"
      />

      {/* Aerodynamic Kinetic Orbit Ring - Lower Counter-Sweep */}
      <path
        d="M78 45C82 64 69 81 50 83C36 85 24 78 19 69C26 70 35 71 46 68C61 65 70 54 72 43C75 44 77 44.5 78 45Z"
        fill={fills.lowerArc}
        opacity="0.95"
      />

      {/* Central Victory Apex Diamond / Dynamic V */}
      <g>
        <polygon
          points="50,26 67,50 50,74 33,50"
          fill="none"
          stroke={fills.apexChevron}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic Inner Kinetic Horizon Wings */}
        <path
          d="M38 50H45M55 50H62"
          stroke={fills.apexChevron}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Central Apex Nexus Dot */}
        <circle cx="50" cy="50" r="5" fill={fills.coreNexus} />
      </g>
    </svg>
  )
}
