import React from 'react'
import { cn } from '../../utils/cn'

export type CardVariant = 'standard' | 'elevated' | 'glass' | 'interactive' | 'gold-accent' | 'blue-accent'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  as?: React.ElementType
  glow?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'standard', as: Component = 'div', glow = false, ...props }, ref) => {
    const variantStyles: Record<CardVariant, string> = {
      standard: 'bg-[#0E1C38] border border-[#1C3364] shadow-md',
      elevated: 'bg-[#15274D] border border-[#1C3364]/80 shadow-xl',
      glass:
        'bg-[#0E1C38]/70 backdrop-blur-md border border-[rgba(244,246,250,0.1)] shadow-lg',
      interactive:
        'bg-[#0E1C38] border border-[#1C3364] hover:border-[#267BFF] hover:shadow-[0_8px_30px_rgba(38,123,255,0.25)] hover:-translate-y-1 transition-all duration-300 cursor-pointer',
      'gold-accent':
        'bg-[#0E1C38] border border-[#D9BD83]/40 shadow-lg relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#D9BD83] before:to-transparent',
      'blue-accent':
        'bg-[#0E1C38] border border-[#267BFF]/40 shadow-lg relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#267BFF] before:to-transparent',
    }

    const glowStyles: Record<CardVariant, string> = {
      standard: 'shadow-[0_0_25px_rgba(8,19,41,0.8)]',
      elevated: 'shadow-[0_0_30px_rgba(38,123,255,0.2)]',
      glass: 'shadow-[0_0_30px_rgba(244,246,250,0.05)]',
      interactive: 'hover:shadow-[0_0_35px_rgba(38,123,255,0.35)]',
      'gold-accent': 'shadow-[0_0_30px_rgba(217,189,131,0.25)]',
      'blue-accent': 'shadow-[0_0_30px_rgba(38,123,255,0.3)]',
    }

    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-xl overflow-hidden transition-all duration-200 text-[#F4F6FA] min-w-0 flex flex-col',
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
        'p-4 sm:p-5 lg:p-6 flex items-start justify-between gap-3 sm:gap-4 border-b border-[#1C3364]/60 min-w-0',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1 flex-1 min-w-0">{children}</div>
      {action && <div className="flex-shrink-0 ml-1">{action}</div>}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'text-base sm:text-lg lg:text-xl font-bold font-display text-[#F4F6FA] tracking-tight leading-snug break-words',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
)

CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs sm:text-sm text-[#94A3B8] leading-relaxed break-words', className)} {...props}>
      {children}
    </p>
  )
)

CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 sm:p-5 lg:p-6 flex-1 min-w-0', className)} {...props}>
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
        'p-3.5 sm:p-4 lg:p-5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-t border-[#1C3364]/60 bg-[#081329]/40 min-w-0 mt-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'
