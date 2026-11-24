import React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface BreadcrumbItem {
  id: string
  label: string
  href?: string
  onClick?: () => void
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs sm:text-sm font-body', className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.id} className="inline-flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />}
              {isLast ? (
                <span className="font-semibold text-[#F4F6FA] select-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="text-[#94A3B8] hover:text-[#267BFF] transition-colors font-medium select-none"
                >
                  {item.label}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

