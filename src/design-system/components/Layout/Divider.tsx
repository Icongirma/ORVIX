import React from 'react'
import { cn } from '../../utils/cn'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: React.ReactNode
  variant?: 'subtle' | 'border' | 'champagne' | 'steel' | 'graphite' | 'silver' | 'charcoal' | 'lime' | 'coral' | 'forest' | 'electric' | 'gold'
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  variant = 'border',
  className,
  ...props
}) => {
  const lineVariantStyles = {
    subtle: 'bg-[#363C42]/50',
    border: 'bg-[#363C42]',
    champagne: 'bg-gradient-to-r from-transparent via-[#C6AD7B] to-transparent',
    steel: 'bg-gradient-to-r from-transparent via-[#8D9AA3] to-transparent',
    graphite: 'bg-gradient-to-r from-transparent via-[#363C42] to-transparent',
    silver: 'bg-gradient-to-r from-transparent via-[#D9DEE2] to-transparent',
    // Legacy aliases
    charcoal: 'bg-gradient-to-r from-transparent via-[#363C42] to-transparent',
    lime: 'bg-gradient-to-r from-transparent via-[#C6AD7B] to-transparent',
    coral: 'bg-gradient-to-r from-transparent via-[#E47D5B] to-transparent',
    forest: 'bg-gradient-to-r from-transparent via-[#363C42] to-transparent',
    electric: 'bg-gradient-to-r from-transparent via-[#C6AD7B] to-transparent',
    gold: 'bg-gradient-to-r from-transparent via-[#C6AD7B] to-transparent',
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={cn('inline-block w-[1px] self-stretch min-h-[1.5em]', lineVariantStyles[variant], className)}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div className={cn('relative flex items-center my-6', className)} role="separator" {...props}>
        <div className={cn('flex-grow h-[1px]', lineVariantStyles[variant])} />
        <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-[#8D9AA3] font-display">
          {label}
        </span>
        <div className={cn('flex-grow h-[1px]', lineVariantStyles[variant])} />
      </div>
    )
  }

  return (
    <div
      className={cn('w-full h-[1px] my-6', lineVariantStyles[variant], className)}
      role="separator"
      {...props}
    />
  )
}
