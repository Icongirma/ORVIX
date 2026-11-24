import React from 'react'
import { cn } from '../../utils/cn'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
  as?: React.ElementType
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, size = 'xl', as: Component = 'div', ...props }, ref) => {
    const sizeClasses: Record<ContainerSize, string> = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    }

    return (
      <Component
        ref={ref}
        className={cn('w-full mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8 min-w-0', sizeClasses[size], className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Container.displayName = 'Container'
