import React from 'react'
import { cn } from '../../utils/cn'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: React.ReactNode
  variant?: 'subtle' | 'border' | 'electric' | 'gold'
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  variant = 'border',
  className,
  ...props
}) => {
  const lineVariantStyles = {
    subtle: 'bg-[#1C3364]/40',
    border: 'bg-[#1C3364]',
    electric: 'bg-gradient-to-r from-transparent via-[#267BFF] to-transparent',
    gold: 'bg-gradient-to-r from-transparent via-[#D9BD83] to-transparent',
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
        <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-[#94A3B8] font-display">
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

