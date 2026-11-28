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

    if (!shouldShowLeftDots && !shouldShowRightDots) {
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
        className="w-9 h-9 rounded-lg flex items-center justify-center text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#252A2E] border border-[#363C42] transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="w-8 text-center text-xs text-[#4D565E]">
                ...
              </span>
            )
          }

          const isCurrent = page === currentPage

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                'w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all',
                isCurrent
                  ? 'bg-[#C6AD7B] text-[#171B1E] font-bold border border-[#D4BE8D] shadow-sm'
                  : 'text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#252A2E] border border-transparent'
              )}
            >
              {page}
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
        className="w-9 h-9 rounded-lg flex items-center justify-center text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#252A2E] border border-[#363C42] transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
