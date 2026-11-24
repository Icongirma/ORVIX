import React from 'react'
import { cn } from '../utils/cn'

export interface OrvixWordmarkProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'primary' | 'gold' | 'blue' | 'monochrome' | 'dark'
  withTagline?: boolean
  taglineText?: string
  className?: string
}

export const OrvixWordmark: React.FC<OrvixWordmarkProps> = ({
  size = 'md',
  variant = 'primary',
  withTagline = false,
  taglineText = 'SPORTS & ENTERTAINMENT',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xl tracking-[0.25em]',
    md: 'text-2xl sm:text-3xl tracking-[0.28em]',
    lg: 'text-4xl sm:text-5xl tracking-[0.3em]',
    xl: 'text-5xl sm:text-6xl tracking-[0.32em]',
    '2xl': 'text-6xl sm:text-7xl tracking-[0.35em]',
  }

  const taglineSizes = {
    sm: 'text-[9px] tracking-[0.35em] mt-0.5',
    md: 'text-[10px] sm:text-xs tracking-[0.4em] mt-1',
    lg: 'text-xs sm:text-sm tracking-[0.45em] mt-1.5',
    xl: 'text-sm sm:text-base tracking-[0.5em] mt-2',
    '2xl': 'text-base sm:text-lg tracking-[0.55em] mt-2.5',
  }

  const getWordmarkColors = () => {
    switch (variant) {
      case 'gold':
        return {
          main: 'bg-gradient-to-r from-[#F9E8C8] via-[#D9BD83] to-[#B3924B] bg-clip-text text-transparent',
          tagline: 'text-[#D9BD83]/80',
        }
      case 'blue':
        return {
          main: 'bg-gradient-to-r from-[#7AB1FF] via-[#267BFF] to-[#1258CC] bg-clip-text text-transparent',
          tagline: 'text-[#267BFF]/80',
        }
      case 'monochrome':
        return {
          main: 'text-[#F4F6FA]',
          tagline: 'text-[#94A3B8]',
        }
      case 'dark':
        return {
          main: 'text-[#081329]',
          tagline: 'text-[#081329]/70',
        }
      case 'primary':
      default:
        return {
          main: 'text-[#F4F6FA]',
          accentX: 'text-[#267BFF]',
          tagline: 'text-[#D9BD83]/90',
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
        {variant === 'primary' ? (
          <>
            <span className={colors.main}>ORVI</span>
            <span className="text-[#267BFF] relative inline-block transition-transform duration-300">
              X
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#D9BD83] rounded-full opacity-90 hidden sm:inline-block" />
            </span>
          </>
        ) : (
          <span className={colors.main}>ORVIX</span>
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

