import React from 'react'
import { cn } from '../../utils/cn'

export type ButtonVariant =
  | 'primary'
  | 'champagne'
  | 'secondary'
  | 'steel'
  | 'dark'
  | 'silver'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'coral'
  // Legacy aliases
  | 'gold'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  glow?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      glow = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-display font-semibold select-none rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171B1E] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] whitespace-nowrap flex-shrink-0'

    const variantStyles: Record<ButtonVariant, string> = {
      // Primary Action: Champagne button with dark typography for accessible 8.1:1 AAA contrast
      primary:
        'bg-[#C6AD7B] text-[#171B1E] font-bold hover:bg-[#B59C6A] active:bg-[#A48B59] border border-[#D4BE8D]/40 shadow-sm',
      // Champagne Accent: Explicit variant mapping
      champagne:
        'bg-[#C6AD7B] text-[#171B1E] font-bold hover:bg-[#B59C6A] active:bg-[#A48B59] border border-[#D4BE8D]/40 shadow-sm',
      // Secondary Action: Graphite surface with warm white text
      secondary:
        'bg-[#252A2E] text-[#F6F5F1] hover:bg-[#2E343A] active:bg-[#1D2225] border border-[#363C42] shadow-sm',
      // Steel Gray Accent: Metallic secondary accent button
      steel:
        'bg-[#8D9AA3] text-[#171B1E] font-bold hover:bg-[#7D8A93] active:bg-[#6E7B84] border border-[#A4B1BA]/40 shadow-sm',
      // Dark Deep Graphite Surface
      dark:
        'bg-[#171B1E] text-[#F6F5F1] hover:bg-[#252A2E] active:bg-[#121517] border border-[#363C42] shadow-sm',
      // Soft Silver Surface: Light button for editorial reading sections
      silver:
        'bg-[#D9DEE2] text-[#171B1E] hover:bg-[#CAD0D5] active:bg-[#BCC3C8] border border-[#CAD0D5] shadow-sm',
      // Outline: Quiet graphite border with champagne hover accent
      outline:
        'bg-transparent text-[#F6F5F1] hover:bg-[#252A2E] hover:text-[#C6AD7B] border border-[#363C42] hover:border-[#C6AD7B]/60',
      // Ghost: Minimalist, clean slate hover with champagne highlight
      ghost:
        'bg-transparent text-[#8D9AA3] hover:text-[#C6AD7B] hover:bg-[#252A2E]/70 active:bg-[#2E3439]',
      // Coral Alert / Time-Sensitive
      coral:
        'bg-[#E47D5B] text-white hover:bg-[#D46B47] active:bg-[#BF5C38] border border-[#EE9375]/30 shadow-sm',
      // Danger: Clean crimson error action
      danger:
        'bg-[#C25B5B] text-white hover:bg-[#B14E4E] active:bg-[#A04141] border border-[#D56A6A]/30 shadow-sm',
      // Legacy aliases mapped
      gold:
        'bg-[#C6AD7B] text-[#171B1E] font-bold hover:bg-[#B59C6A] active:bg-[#A48B59] border border-[#D4BE8D]/40 shadow-sm',
    }

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'h-8 px-2.5 sm:px-3 text-xs gap-1.5 min-w-[64px]',
      md: 'h-10 px-3.5 sm:px-4 text-xs sm:text-sm gap-2 min-w-[80px]',
      lg: 'h-12 px-5 sm:px-6 text-sm sm:text-base gap-2.5 min-w-[110px]',
    }

    // Clean modern natural elevation shadows
    const glowStyles: Record<ButtonVariant, string> = {
      primary: 'shadow-[0_2px_12px_rgba(198,173,123,0.25)]',
      champagne: 'shadow-[0_2px_12px_rgba(198,173,123,0.25)]',
      secondary: 'shadow-[0_2px_8px_rgba(0,0,0,0.2)]',
      steel: 'shadow-[0_2px_10px_rgba(141,154,163,0.2)]',
      dark: 'shadow-[0_2px_8px_rgba(0,0,0,0.25)]',
      silver: 'shadow-[0_2px_6px_rgba(0,0,0,0.06)]',
      outline: 'hover:shadow-[0_2px_8px_rgba(198,173,123,0.15)]',
      ghost: '',
      coral: 'shadow-[0_2px_10px_rgba(228,125,91,0.25)]',
      danger: 'shadow-[0_2px_10px_rgba(194,91,91,0.25)]',
      gold: 'shadow-[0_2px_12px_rgba(198,173,123,0.25)]',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          glow && glowStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="inline-flex items-center flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex items-center flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
