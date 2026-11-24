import React from 'react'
import { cn } from '../../utils/cn'

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'responsive'
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
  as?: React.ElementType
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      className,
      direction = 'col',
      gap = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    const directionClasses = {
      row: 'flex-row',
      col: 'flex-col',
      responsive: 'flex-col sm:flex-row',
    }

    const gapClasses = {
      xs: 'gap-1.5',
      sm: 'gap-3',
      md: 'gap-4 sm:gap-6',
      lg: 'gap-6 sm:gap-8',
      xl: 'gap-8 sm:gap-12',
    }

    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    }

    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    }

    return (
      <Component
        ref={ref}
        className={cn(
          'flex',
          directionClasses[direction],
          gapClasses[gap],
          alignClasses[align],
          justifyClasses[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Stack.displayName = 'Stack'

