import React from 'react'
import { cn } from '../../utils/cn'

export type BadgeVariant =
  | 'live'
  | 'champagne'
  | 'champagne-solid'
  | 'steel'
  | 'graphite'
  | 'silver'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline'
  // Legacy aliases
  | 'charcoal'
  | 'lime'
  | 'forest'
  | 'coral'
  | 'ivory'
  | 'sage'
  | 'gold'
  | 'blue'

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
    // Champagne brand accent chip
    champagne: 'bg-[#C6AD7B]/20 text-[#C6AD7B] border border-[#C6AD7B]/40',
    // Champagne solid chip
    'champagne-solid': 'bg-[#C6AD7B] text-[#171B1E] border border-[#D4BE8D]',
    // Live broadcasting indicator
    live: 'bg-[#C6AD7B]/20 text-[#C6AD7B] border border-[#C6AD7B]/40',
    // Steel Gray secondary accent
    steel: 'bg-[#8D9AA3]/18 text-[#8D9AA3] border border-[#8D9AA3]/35',
    // Graphite / Broadcast surface
    graphite: 'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42]',
    // Soft Silver / Editorial surface
    silver: 'bg-[#D9DEE2] text-[#171B1E] border border-[#CAD0D5]',
    // Neutral slate
    neutral: 'bg-[#252A2E] text-[#8D9AA3] border border-[#363C42]',
    // Outline
    outline: 'bg-transparent text-[#F6F5F1] border border-[#363C42]',
    // Status states
    success: 'bg-[#729B79]/18 text-[#729B79] border border-[#729B79]/35',
    warning: 'bg-[#C4924A]/18 text-[#C4924A] border border-[#C4924A]/35',
    danger: 'bg-[#C25B5B]/18 text-[#C25B5B] border border-[#C25B5B]/35',

    // Legacy aliases mapped
    charcoal: 'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42]',
    lime: 'bg-[#C6AD7B]/20 text-[#C6AD7B] border border-[#C6AD7B]/40',
    forest: 'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42]',
    coral: 'bg-[#E47D5B]/20 text-[#E47D5B] border border-[#E47D5B]/40',
    ivory: 'bg-[#D9DEE2] text-[#171B1E] border border-[#CAD0D5]',
    sage: 'bg-[#252A2E] text-[#8D9AA3] border border-[#363C42]',
    gold: 'bg-[#C6AD7B]/20 text-[#C6AD7B] border border-[#C6AD7B]/40',
    blue: 'bg-[#C6AD7B]/20 text-[#C6AD7B] border border-[#C6AD7B]/40',
  }

  const shouldPulse = pulse || variant === 'live'

  const pulseDotColor: Record<BadgeVariant, string> = {
    champagne: 'bg-[#C6AD7B]',
    'champagne-solid': 'bg-[#171B1E]',
    live: 'bg-[#C6AD7B]',
    steel: 'bg-[#8D9AA3]',
    graphite: 'bg-[#C6AD7B]',
    silver: 'bg-[#171B1E]',
    neutral: 'bg-[#68737D]',
    outline: 'bg-[#F6F5F1]',
    success: 'bg-[#729B79]',
    warning: 'bg-[#C4924A]',
    danger: 'bg-[#C25B5B]',
    charcoal: 'bg-[#C6AD7B]',
    lime: 'bg-[#C6AD7B]',
    forest: 'bg-[#C6AD7B]',
    coral: 'bg-[#E47D5B]',
    ivory: 'bg-[#171B1E]',
    sage: 'bg-[#68737D]',
    gold: 'bg-[#C6AD7B]',
    blue: 'bg-[#C6AD7B]',
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
      {icon && <span className="inline-flex items-center flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}
