import React from 'react'
import { cn } from '../../utils/cn'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  badge?: React.ReactNode
  title?: string
  subtitle?: string
  action?: React.ReactNode
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  as?: React.ElementType
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      className,
      badge,
      title,
      subtitle,
      action,
      spacing = 'md',
      as: Component = 'section',
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      sm: 'py-6 sm:py-8',
      md: 'py-10 sm:py-14',
      lg: 'py-16 sm:py-20',
      xl: 'py-20 sm:py-28',
    }

    const hasHeader = Boolean(badge || title || subtitle || action)

    return (
      <Component ref={ref} className={cn('w-full', spacingClasses[spacing], className)} {...props}>
        {hasHeader && (
          <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              {badge && <div>{badge}</div>}
              {title && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-[#F4F6FA] tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">{subtitle}</p>}
            </div>
            {action && <div className="flex-shrink-0 self-start md:self-end">{action}</div>}
          </div>
        )}
        {children}
      </Component>
    )
  }
)

Section.displayName = 'Section'

