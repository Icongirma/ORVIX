import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  // Generate page numbers with ellipses
  const generatePages = () => {
    const totalNumbers = siblingCount * 2 + 3
    const totalBlocks = totalNumbers + 2

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, '...', totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1)
      return [1, '...', ...rightRange]
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    )
    return [1, '...', ...middleRange, '...', totalPages]
  }

  const pages = generatePages()

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1.5 font-display select-none', className)}
    >
      {/* Previous Button */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous Page"
        className="w-9 h-9 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38] border border-[#1C3364] transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="w-8 text-center text-xs text-[#64748B]">
                ...
              </span>
            )
          }

          const pageNum = Number(page)
          const isCurrent = pageNum === currentPage

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                'w-9 h-9 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center justify-center',
                isCurrent
                  ? 'bg-[#267BFF] text-white border-[#267BFF] shadow-[0_0_12px_rgba(38,123,255,0.4)]'
                  : 'bg-[#0E1C38] text-[#94A3B8] border-[#1C3364] hover:text-[#F4F6FA] hover:bg-[#15274D]'
              )}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next Page"
        className="w-9 h-9 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38] border border-[#1C3364] transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}

