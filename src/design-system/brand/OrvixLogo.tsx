import React from 'react'
import { cn } from '../utils/cn'

export interface OrvixLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number
  variant?: 'primary' | 'gold' | 'blue' | 'monochrome' | 'dark'
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

  // Unique ID prefix for SVG gradient definitions to prevent collisions
  const idPrefix = React.useId().replace(/:/g, '')

  // Color schemes for variations
  const renderDefs = () => {
    switch (variant) {
      case 'gold':
        return (
          <defs>
            <linearGradient id={`${idPrefix}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9E8C8" />
              <stop offset="50%" stopColor="#D9BD83" />
              <stop offset="100%" stopColor="#B3924B" />
            </linearGradient>
            <filter id={`${idPrefix}-glow`} x1="-20%" y1="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        )
      case 'blue':
        return (
          <defs>
            <linearGradient id={`${idPrefix}-blue`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6BA6FF" />
              <stop offset="100%" stopColor="#267BFF" />
            </linearGradient>
            <filter id={`${idPrefix}-glow`} x1="-20%" y1="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        )
      case 'monochrome':
        return (
          <defs>
            <linearGradient id={`${idPrefix}-white`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
        )
      case 'dark':
        return (
          <defs>
            <linearGradient id={`${idPrefix}-dark`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#081329" />
            </linearGradient>
          </defs>
        )
      case 'primary':
      default:
        return (
          <defs>
            <linearGradient id={`${idPrefix}-blue-primary`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5EA1FF" />
              <stop offset="100%" stopColor="#267BFF" />
            </linearGradient>
            <linearGradient id={`${idPrefix}-gold-accent`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5E4BE" />
              <stop offset="50%" stopColor="#D9BD83" />
              <stop offset="100%" stopColor="#B69550" />
            </linearGradient>
            <filter id={`${idPrefix}-glow`} x1="-20%" y1="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        )
    }
  }

  // Determine fills based on variant
  const getFills = () => {
    switch (variant) {
      case 'gold':
        return {
          upperArc: `url(#${idPrefix}-gold)`,
          lowerArc: `url(#${idPrefix}-gold)`,
          apexChevron: `url(#${idPrefix}-gold)`,
          coreNexus: '#F9E8C8',
        }
      case 'blue':
        return {
          upperArc: `url(#${idPrefix}-blue)`,
          lowerArc: `url(#${idPrefix}-blue)`,
          apexChevron: `url(#${idPrefix}-blue)`,
          coreNexus: '#FFFFFF',
        }
      case 'monochrome':
        return {
          upperArc: `url(#${idPrefix}-white)`,
          lowerArc: `url(#${idPrefix}-white)`,
          apexChevron: `url(#${idPrefix}-white)`,
          coreNexus: '#FFFFFF',
        }
      case 'dark':
        return {
          upperArc: `url(#${idPrefix}-dark)`,
          lowerArc: `url(#${idPrefix}-dark)`,
          apexChevron: '#081329',
          coreNexus: '#267BFF',
        }
      case 'primary':
      default:
        return {
          upperArc: `url(#${idPrefix}-blue-primary)`,
          lowerArc: `url(#${idPrefix}-blue-primary)`,
          apexChevron: `url(#${idPrefix}-gold-accent)`,
          coreNexus: '#D9BD83',
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
        glow && variant === 'primary' && 'filter drop-shadow-[0_0_12px_rgba(38,123,255,0.6)]',
        glow && variant === 'gold' && 'filter drop-shadow-[0_0_12px_rgba(217,189,131,0.6)]',
        glow && variant === 'blue' && 'filter drop-shadow-[0_0_12px_rgba(38,123,255,0.7)]',
        className
      )}
      {...props}
    >
      {renderDefs()}

      {/* Aerodynamic Kinetic Orbit Ring - Upper Sector */}
      <path
        d="M22 55C18 36 31 19 50 17C64 15 76 22 81 31C74 30 65 29 54 32C39 35 30 46 28 57C25 56 23 55.5 22 55Z"
        fill={fills.upperArc}
        opacity={variant === 'primary' ? '0.95' : '1'}
      />

      {/* Aerodynamic Kinetic Orbit Ring - Lower Counter-Sweep */}
      <path
        d="M78 45C82 64 69 81 50 83C36 85 24 78 19 69C26 70 35 71 46 68C61 65 70 54 72 43C75 44 77 44.5 78 45Z"
        fill={fills.lowerArc}
        opacity={variant === 'primary' ? '0.95' : '1'}
      />

      {/* Central Victory Apex Diamond / Dynamic V */}
      <g filter={glow ? `url(#${idPrefix}-glow)` : undefined}>
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

