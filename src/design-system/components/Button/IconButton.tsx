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
      'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
    }

    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-[#C6AD7B] text-[#171B1E] hover:bg-[#B59C6A] border border-[#D4BE8D]/40',
      champagne: 'bg-[#C6AD7B] text-[#171B1E] hover:bg-[#B59C6A] border border-[#D4BE8D]/40',
      secondary: 'bg-[#252A2E] text-[#F6F5F1] hover:bg-[#2E343A] border border-[#363C42]',
      steel: 'bg-[#8D9AA3] text-[#171B1E] hover:bg-[#7D8A93] border border-[#A4B1BA]/40',
      dark: 'bg-[#171B1E] text-[#F6F5F1] hover:bg-[#252A2E] border border-[#363C42]',
      silver: 'bg-[#D9DEE2] text-[#171B1E] hover:bg-[#CAD0D5] border border-[#CAD0D5]',
      outline: 'bg-transparent text-[#F6F5F1] hover:bg-[#252A2E] hover:text-[#C6AD7B] border border-[#363C42] hover:border-[#C6AD7B]/60',
      ghost: 'bg-transparent text-[#8D9AA3] hover:text-[#C6AD7B] hover:bg-[#252A2E]/70',
      coral: 'bg-[#E47D5B] text-white hover:bg-[#D46B47] border border-[#EE9375]/30',
      danger: 'bg-[#C25B5B] text-white hover:bg-[#B14E4E] border border-[#D56A6A]/30',
      gold: 'bg-[#C6AD7B] text-[#171B1E] hover:bg-[#B59C6A] border border-[#D4BE8D]/40',
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
          glow && 'shadow-[0_2px_10px_rgba(198,173,123,0.22)]',
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
