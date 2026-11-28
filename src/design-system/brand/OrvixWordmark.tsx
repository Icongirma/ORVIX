import React from 'react'
import { cn } from '../utils/cn'

export type WordmarkVariant =
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

export interface OrvixWordmarkProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: WordmarkVariant
  withTagline?: boolean
  taglineText?: string
  className?: string
}

export const OrvixWordmark: React.FC<OrvixWordmarkProps> = ({
  size = 'md',
  variant = 'primary',
  withTagline = false,
  taglineText = 'PLAY. COMPETE. DISCOVER.',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-lg sm:text-xl tracking-[0.22em] sm:tracking-[0.25em]',
    md: 'text-xl sm:text-2xl md:text-3xl tracking-[0.24em] sm:tracking-[0.28em]',
    lg: 'text-2xl sm:text-4xl lg:text-5xl tracking-[0.24em] sm:tracking-[0.3em]',
    xl: 'text-3xl xs:text-4xl sm:text-5xl lg:text-6xl tracking-[0.22em] sm:tracking-[0.32em]',
    '2xl': 'text-4xl sm:text-6xl lg:text-7xl tracking-[0.25em] sm:tracking-[0.35em]',
  }

  const taglineSizes = {
    sm: 'text-[9px] tracking-[0.25em] sm:tracking-[0.35em] mt-0.5',
    md: 'text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.4em] mt-1',
    lg: 'text-[10px] sm:text-xs lg:text-sm tracking-[0.3em] sm:tracking-[0.45em] mt-1.5',
    xl: 'text-[11px] sm:text-sm lg:text-base tracking-[0.28em] sm:tracking-[0.5em] mt-2',
    '2xl': 'text-xs sm:text-base lg:text-lg tracking-[0.32em] sm:tracking-[0.55em] mt-2.5',
  }

  const getWordmarkColors = () => {
    switch (variant) {
      case 'champagne':
      case 'gold':
      case 'lime':
        return {
          main: 'text-[#C6AD7B]',
          tagline: 'text-[#C6AD7B]/80',
          accentX: 'text-[#F6F5F1]',
          beacon: 'bg-[#F6F5F1]',
        }
      case 'steel':
        return {
          main: 'text-[#8D9AA3]',
          tagline: 'text-[#8D9AA3]/80',
          accentX: 'text-[#C6AD7B]',
          beacon: 'bg-[#C6AD7B]',
        }
      case 'silver':
        return {
          main: 'text-[#D9DEE2]',
          tagline: 'text-[#68737D]',
          accentX: 'text-[#C6AD7B]',
          beacon: 'bg-[#C6AD7B]',
        }
      case 'graphite':
      case 'dark':
      case 'charcoal':
      case 'forest':
        return {
          main: 'text-[#252A2E]',
          tagline: 'text-[#68737D]',
          accentX: 'text-[#C6AD7B]',
          beacon: 'bg-[#C6AD7B]',
        }
      case 'monochrome':
        return {
          main: 'text-[#F6F5F1]',
          tagline: 'text-[#8D9AA3]',
          accentX: 'text-[#F6F5F1]',
          beacon: 'bg-[#F6F5F1]',
        }
      case 'coral':
        return {
          main: 'text-[#F6F5F1]',
          tagline: 'text-[#8D9AA3]',
          accentX: 'text-[#E47D5B]',
          beacon: 'bg-[#E47D5B]',
        }
      case 'blue':
      case 'primary':
      default:
        return {
          main: 'text-[#F6F5F1]',
          accentX: 'text-[#C6AD7B]',
          beacon: 'bg-[#C6AD7B]',
          tagline: 'text-[#8D9AA3]',
        }
    }
  }

  const colors = getWordmarkColors()

  return (
    <div
      className={cn('inline-flex flex-col select-none font-display', className)}
      role="img"
      aria-label="ORVIX Wordmark"
      {...props}
    >
      <div className={cn('font-black uppercase flex items-center leading-none', sizeClasses[size])}>
        {variant === 'monochrome' ? (
          <span className={colors.main}>ORVIX</span>
        ) : (
          <>
            <span className={colors.main}>ORVI</span>
            <span className={cn('relative inline-block transition-transform duration-300', colors.accentX)}>
              X
              <span className={cn('absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full opacity-90 hidden sm:inline-block', colors.beacon)} />
            </span>
          </>
        )}
      </div>

      {withTagline && (
        <span
          className={cn(
            'uppercase font-semibold text-center font-display whitespace-nowrap',
            taglineSizes[size],
            colors.tagline
          )}
        >
          {taglineText}
        </span>
      )}
    </div>
  )
}
