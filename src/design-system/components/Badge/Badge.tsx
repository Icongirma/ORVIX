import React from 'react'
import { cn } from '../../utils/cn'

export type BadgeVariant = 'live' | 'gold' | 'blue' | 'neutral' | 'success' | 'warning' | 'danger' | 'outline'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  pulse?: boolean
  icon?: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  pulse = false,
  icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 font-display font-semibold uppercase tracking-wider rounded-full select-none whitespace-nowrap flex-shrink-0'

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-[10px] px-2 py-0.5 leading-none',
    md: 'text-xs px-2.5 py-1 leading-none',
  }

  const variantStyles: Record<BadgeVariant, string> = {
    live: 'bg-[#FF3B56]/15 text-[#FF3B56] border border-[#FF3B56]/30',
    gold: 'bg-[#D9BD83]/15 text-[#D9BD83] border border-[#D9BD83]/40 shadow-[0_0_12px_rgba(217,189,131,0.2)]',
    blue: 'bg-[#267BFF]/15 text-[#267BFF] border border-[#267BFF]/30 shadow-[0_0_12px_rgba(38,123,255,0.2)]',
    neutral: 'bg-[#15274D] text-[#94A3B8] border border-[#1C3364]',
    success: 'bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30',
    warning: 'bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30',
    danger: 'bg-[#FF3B56]/20 text-[#FF6B81] border border-[#FF3B56]/30',
    outline: 'bg-transparent text-[#F4F6FA] border border-[#1C3364]',
  }

  const shouldPulse = pulse || variant === 'live'

  const pulseDotColor: Record<BadgeVariant, string> = {
    live: 'bg-[#FF3B56]',
    gold: 'bg-[#D9BD83]',
    blue: 'bg-[#267BFF]',
    neutral: 'bg-[#94A3B8]',
    success: 'bg-[#00E599]',
    warning: 'bg-[#FFB020]',
    danger: 'bg-[#FF3B56]',
    outline: 'bg-[#F4F6FA]',
  }

  return (
    <span className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {shouldPulse && (
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              pulseDotColor[variant]
            )}
          />
          <span className={cn('relative inline-flex rounded-full h-2 w-2', pulseDotColor[variant])} />
        </span>
      )}
      {icon && !shouldPulse && <span className="inline-flex items-center flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  )
}
