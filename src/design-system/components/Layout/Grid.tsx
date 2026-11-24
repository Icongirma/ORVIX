import React from 'react'
import { cn } from '../../utils/cn'

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: GridCols | { default: GridCols; sm?: GridCols; md?: GridCols; lg?: GridCols; xl?: GridCols }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  as?: React.ElementType
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ children, className, cols = 3, gap = 'md', as: Component = 'div', ...props }, ref) => {
    const gapClasses = {
      sm: 'gap-3 sm:gap-4',
      md: 'gap-4 sm:gap-6',
      lg: 'gap-5 sm:gap-6 lg:gap-8',
      xl: 'gap-6 sm:gap-8 lg:gap-10',
    }

    const getColsClasses = () => {
      if (typeof cols === 'number') {
        const colMap: Record<GridCols, string> = {
          1: 'grid-cols-1',
          2: 'grid-cols-1 md:grid-cols-2',
          3: 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
          4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4',
          5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
          6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
          12: 'grid-cols-12',
        }
        return colMap[cols]
      }

      // Responsive object mapping
      return cn(
        cols.default && `grid-cols-${cols.default}`,
        cols.sm && `sm:grid-cols-${cols.sm}`,
        cols.md && `md:grid-cols-${cols.md}`,
        cols.lg && `lg:grid-cols-${cols.lg}`,
        cols.xl && `xl:grid-cols-${cols.xl}`
      )
    }

    return (
      <Component
        ref={ref}
        className={cn('grid min-w-0 w-full', getColsClasses(), gapClasses[gap], className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Grid.displayName = 'Grid'
