import React from 'react'
import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'gold' | 'secondary' | 'outline' | 'ghost' | 'danger'
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
      'inline-flex items-center justify-center font-display font-semibold select-none rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#267BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081329] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] whitespace-nowrap flex-shrink-0'

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#267BFF] text-white hover:bg-[#1A66E5] active:bg-[#1258CC] border border-[#4F95FF]/30 shadow-sm',
      gold:
        'bg-gradient-to-r from-[#D9BD83] via-[#E8D2A2] to-[#C7A969] text-[#081329] font-bold hover:brightness-110 active:brightness-95 border border-[#F3E1B7]/50 shadow-sm',
      secondary:
        'bg-[#0E1C38] text-[#F4F6FA] hover:bg-[#15274D] active:bg-[#1C3364] border border-[#1C3364] shadow-sm',
      outline:
        'bg-transparent text-[#F4F6FA] hover:bg-[#0E1C38] hover:text-white border border-[#267BFF]/50 hover:border-[#267BFF]',
      ghost:
        'bg-transparent text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38]/60 active:bg-[#15274D]/60',
      danger:
        'bg-[#FF3B56] text-white hover:bg-[#E02641] active:bg-[#C41C33] border border-[#FF6B81]/30 shadow-sm',
    }

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'h-8 px-2.5 sm:px-3 text-xs gap-1.5 min-w-[64px]',
      md: 'h-10 px-3.5 sm:px-4 text-xs sm:text-sm gap-2 min-w-[80px]',
      lg: 'h-12 px-5 sm:px-6 text-sm sm:text-base gap-2.5 min-w-[110px]',
    }

    const glowStyles: Record<ButtonVariant, string> = {
      primary: 'shadow-[0_0_20px_rgba(38,123,255,0.45)] hover:shadow-[0_0_28px_rgba(38,123,255,0.65)]',
      gold: 'shadow-[0_0_20px_rgba(217,189,131,0.45)] hover:shadow-[0_0_28px_rgba(217,189,131,0.65)]',
      secondary: 'shadow-[0_0_15px_rgba(14,28,56,0.5)]',
      outline: 'hover:shadow-[0_0_18px_rgba(38,123,255,0.35)]',
      ghost: '',
      danger: 'shadow-[0_0_20px_rgba(255,59,86,0.45)] hover:shadow-[0_0_28px_rgba(255,59,86,0.65)]',
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
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              role="status"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
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
            {leftIcon && <span className="flex-shrink-0 inline-flex">{leftIcon}</span>}
            <span className="truncate">{children}</span>
            {rightIcon && <span className="flex-shrink-0 inline-flex">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
