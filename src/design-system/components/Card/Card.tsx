import React from 'react'
import { cn } from '../../utils/cn'

export type CardVariant =
  | 'standard'
  | 'elevated'
  | 'deep'
  | 'editorialLight'
  | 'editorialCool'
  | 'interactive'
  | 'champagne-accent'
  | 'steel-accent'
  | 'silver-accent'
  | 'coral-accent'
  | 'glass'
  // Legacy aliases
  | 'charcoal'
  | 'forest'
  | 'lime-accent'
  | 'gold-accent'
  | 'blue-accent'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  as?: React.ElementType
  glow?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'standard', as: Component = 'div', glow = false, ...props }, ref) => {
    const variantStyles: Record<CardVariant, string> = {
      // Standard: Clean Graphite surface (#252A2E) with neutral border
      standard:
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.18)]',
      // Elevated: Higher contrast surface for modals and prominent modules
      elevated:
        'bg-[#2E343A] text-[#F6F5F1] border border-[#424950] shadow-[0_4px_16px_rgba(0,0,0,0.28)]',
      // Deep: Deep Graphite container (#171B1E)
      deep:
        'bg-[#171B1E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.2)]',
      // Editorial Light: Soft Silver (#D9DEE2) container on Warm White
      editorialLight:
        'bg-[#D9DEE2] text-[#171B1E] border border-[#CAD0D5] shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
      // Editorial Cool: Warm White surface
      editorialCool:
        'bg-[#F6F5F1] text-[#171B1E] border border-[#D9DEE2] shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
      // Interactive: Subtle hover lift with champagne border transition
      interactive:
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] hover:border-[#C6AD7B]/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B]',
      // Champagne Accent: Restrained 2px top border in Champagne (#C6AD7B)
      'champagne-accent':
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.18)] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C6AD7B]',
      // Steel Accent: 2px top border in Steel Gray (#8D9AA3)
      'steel-accent':
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.18)] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#8D9AA3]',
      // Silver Accent: 2px top border in Soft Silver (#D9DEE2)
      'silver-accent':
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.18)] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#D9DEE2]',
      // Coral Accent: Live and breaking sports top bar
      'coral-accent':
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.18)] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#E47D5B]',
      // Glass: Natural quiet frost
      glass:
        'bg-[#252A2E]/90 backdrop-blur-sm text-[#F6F5F1] border border-[#363C42] shadow-[0_4px_16px_rgba(0,0,0,0.2)]',

      // Legacy aliases mapped
      charcoal:
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.18)]',
      forest:
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.18)]',
      'lime-accent':
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.18)] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C6AD7B]',
      'gold-accent':
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.18)] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C6AD7B]',
      'blue-accent':
        'bg-[#252A2E] text-[#F6F5F1] border border-[#363C42] shadow-[0_2px_8px_rgba(0,0,0,0.18)] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C6AD7B]',
    }

    const glowStyles: Record<CardVariant, string> = {
      standard: 'shadow-[0_2px_12px_rgba(0,0,0,0.25)]',
      elevated: 'shadow-[0_6px_20px_rgba(0,0,0,0.32)]',
      deep: 'shadow-[0_4px_16px_rgba(0,0,0,0.25)]',
      editorialLight: 'shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
      editorialCool: 'shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
      interactive: 'hover:shadow-[0_4px_16px_rgba(198,173,123,0.15)]',
      'champagne-accent': 'shadow-[0_2px_12px_rgba(198,173,123,0.15)]',
      'steel-accent': 'shadow-[0_2px_12px_rgba(141,154,163,0.12)]',
      'silver-accent': 'shadow-[0_2px_12px_rgba(217,222,226,0.1)]',
      'coral-accent': 'shadow-[0_2px_12px_rgba(228,125,91,0.15)]',
      glass: 'shadow-[0_4px_16px_rgba(0,0,0,0.2)]',
      charcoal: 'shadow-[0_2px_12px_rgba(0,0,0,0.25)]',
      forest: 'shadow-[0_2px_12px_rgba(0,0,0,0.25)]',
      'lime-accent': 'shadow-[0_2px_12px_rgba(198,173,123,0.15)]',
      'gold-accent': 'shadow-[0_2px_12px_rgba(198,173,123,0.15)]',
      'blue-accent': 'shadow-[0_2px_12px_rgba(198,173,123,0.15)]',
    }

    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-xl overflow-hidden transition-all duration-200 min-w-0 flex flex-col',
          variantStyles[variant],
          glow && glowStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = 'Card'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'p-4 sm:p-5 lg:p-6 flex items-start justify-between gap-3 sm:gap-4 border-b border-[#363C42]/80 min-w-0',
        className
      )}
      {...props}
    >
      <div className="space-y-1 flex-1 min-w-0">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-base sm:text-lg font-bold font-display tracking-tight text-[#F6F5F1]', className)}
      {...props}
    >
      {children}
    </h3>
  )
)

CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs sm:text-sm text-[#8D9AA3] leading-relaxed font-body', className)} {...props}>
      {children}
    </p>
  )
)

CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 sm:p-5 lg:p-6 min-w-0 flex-1', className)} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'p-4 sm:p-5 lg:p-6 pt-0 flex items-center justify-between gap-4 border-t border-[#363C42]/40 mt-auto min-w-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'
