import React from 'react'
import { cn } from '../../utils/cn'

export interface TabItem {
  id: string
  label: string
  count?: number | string
  icon?: React.ReactNode
  badge?: string
}

export interface TabsProps {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  variant?: 'pills' | 'underline' | 'contained'
  size?: 'sm' | 'md'
  fullWidth?: boolean
  className?: string
  ariaLabel?: string
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  variant = 'pills',
  size = 'md',
  fullWidth = false,
  className,
  ariaLabel = 'Navigation Tabs',
}) => {
  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3 gap-1.5',
    md: 'text-sm py-2 px-4 gap-2',
  }

  // Keyboard navigation across tabs: ArrowLeft / ArrowRight
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = (currentIndex + 1) % items.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = (currentIndex - 1 + items.length) % items.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = items.length - 1
    }

    if (nextIndex >= 0) {
      onChange(items[nextIndex].id)
      const tabButtons = (e.currentTarget.parentElement?.querySelectorAll('[role="tab"]') as NodeListOf<HTMLButtonElement>)
      tabButtons?.[nextIndex]?.focus()
    }
  }

  if (variant === 'underline') {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn('flex items-center gap-4 sm:gap-6 border-b border-[#363C42]/80 overflow-x-auto scrollbar-none', className)}
      >
        {items.map((tab, idx) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'relative flex items-center font-display font-semibold transition-all duration-200 select-none pb-3 border-b-2 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171B1E] active:scale-[0.98]',
                sizeStyles[size],
                isActive
                  ? 'text-[#F6F5F1] border-[#C6AD7B]'
                  : 'text-[#8D9AA3] border-transparent hover:text-[#F6F5F1] hover:border-[#363C42]'
              )}
            >
              {tab.icon && <span className="inline-flex items-center">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'text-[11px] px-1.5 py-0.2 rounded-full font-mono-stats font-bold',
                    isActive ? 'bg-[#C6AD7B]/20 text-[#C6AD7B]' : 'bg-[#252A2E] text-[#8D9AA3]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'contained') {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          'inline-flex p-1 rounded-xl bg-[#171B1E] border border-[#363C42] overflow-x-auto',
          fullWidth && 'w-full',
          className
        )}
      >
        {items.map((tab, idx) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'flex items-center justify-center font-display font-semibold transition-all duration-200 rounded-lg select-none whitespace-nowrap border outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171B1E] active:scale-[0.98]',
                sizeStyles[size],
                fullWidth && 'flex-1',
                isActive
                  ? 'bg-[#2E343A] text-[#C6AD7B] border-[#C6AD7B]/30 shadow-sm font-bold'
                  : 'text-[#8D9AA3] border-transparent hover:text-[#F6F5F1] hover:bg-[#252A2E]'
              )}
            >
              {tab.icon && <span className="inline-flex items-center">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-full font-mono-stats bg-[#252A2E] text-[#8D9AA3] font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Variant: 'pills' (Default)
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('flex items-center gap-2 overflow-x-auto scrollbar-none', className)}
    >
      {items.map((tab, idx) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              'flex items-center font-display font-semibold transition-all duration-200 rounded-lg select-none whitespace-nowrap border outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171B1E] active:scale-[0.98]',
              sizeStyles[size],
              isActive
                ? 'bg-[#2E343A] text-[#C6AD7B] border-[#C6AD7B]/40 shadow-sm font-bold'
                : 'text-[#8D9AA3] border-transparent hover:text-[#F6F5F1] hover:bg-[#252A2E]'
            )}
          >
            {tab.icon && <span className="inline-flex items-center">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.2 rounded-full font-mono-stats font-bold',
                  isActive ? 'bg-[#C6AD7B]/20 text-[#C6AD7B]' : 'bg-[#252A2E] text-[#8D9AA3]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
