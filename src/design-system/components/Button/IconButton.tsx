import React from 'react'
import { cn } from '../../utils/cn'
import type { ButtonVariant, ButtonSize } from './Button'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  ariaLabel: string
  glow?: boolean
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'secondary', size = 'md', ariaLabel, glow = false, className, disabled, type = 'button', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#267BFF] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
    }

    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-[#267BFF] text-white hover:bg-[#1A66E5] border border-[#4F95FF]/30',
      gold: 'bg-gradient-to-r from-[#D9BD83] to-[#C7A969] text-[#081329] hover:brightness-110 border border-[#F3E1B7]/50',
      secondary: 'bg-[#0E1C38] text-[#F4F6FA] hover:bg-[#15274D] border border-[#1C3364]',
      outline: 'bg-transparent text-[#F4F6FA] hover:bg-[#0E1C38] border border-[#267BFF]/50 hover:border-[#267BFF]',
      ghost: 'bg-transparent text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38]/70',
      danger: 'bg-[#FF3B56] text-white hover:bg-[#E02641] border border-[#FF6B81]/30',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          glow && 'shadow-[0_0_18px_rgba(38,123,255,0.4)]',
          className
        )}
        {...props}
      >
        {icon}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'

