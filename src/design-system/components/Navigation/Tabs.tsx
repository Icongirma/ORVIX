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
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  variant = 'pills',
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3 gap-1.5',
    md: 'text-sm py-2 px-4 gap-2',
  }

  if (variant === 'underline') {
    return (
      <div className={cn('flex items-center gap-4 sm:gap-6 border-b border-[#1C3364]/80 overflow-x-auto scrollbar-none', className)}>
        {items.map((tab) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex items-center font-display font-semibold transition-all duration-200 select-none pb-3 border-b-2 whitespace-nowrap',
                sizeStyles[size],
                isActive
                  ? 'text-[#F4F6FA] border-[#267BFF]'
                  : 'text-[#94A3B8] border-transparent hover:text-[#F4F6FA] hover:border-[#1C3364]'
              )}
            >
              {tab.icon && <span className="inline-flex items-center">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'text-[11px] px-1.5 py-0.2 rounded-full font-mono-stats',
                    isActive ? 'bg-[#267BFF]/20 text-[#267BFF]' : 'bg-[#15274D] text-[#94A3B8]'
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
        className={cn(
          'inline-flex p-1 rounded-xl bg-[#081329] border border-[#1C3364] overflow-x-auto',
          fullWidth && 'w-full',
          className
        )}
      >
        {items.map((tab) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center justify-center font-display font-medium rounded-lg transition-all duration-200 select-none whitespace-nowrap',
                sizeStyles[size],
                fullWidth && 'flex-1',
                isActive
                  ? 'bg-[#15274D] text-[#F4F6FA] font-semibold border border-[#267BFF]/40 shadow-[0_0_12px_rgba(38,123,255,0.25)]'
                  : 'text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38]/50'
              )}
            >
              {tab.icon && <span className="inline-flex items-center">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'text-[11px] px-1.5 py-0.2 rounded-full font-mono-stats',
                    isActive ? 'bg-[#267BFF]/20 text-[#267BFF]' : 'bg-[#0E1C38] text-[#94A3B8]'
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

  // Pills variant (default)
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 p-1 rounded-xl bg-[#0E1C38] border border-[#1C3364] overflow-x-auto',
        fullWidth && 'w-full',
        className
      )}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center justify-center font-display font-medium rounded-lg transition-all duration-200 select-none whitespace-nowrap',
              sizeStyles[size],
              fullWidth && 'flex-1',
              isActive
                ? 'bg-[#267BFF] text-white font-semibold shadow-[0_0_15px_rgba(38,123,255,0.4)]'
                : 'text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#15274D]'
            )}
          >
            {tab.icon && <span className="inline-flex items-center">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.2 rounded-full font-mono-stats',
                  isActive ? 'bg-white/20 text-white' : 'bg-[#15274D] text-[#94A3B8]'
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

