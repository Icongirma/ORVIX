import React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void
  shortcutKey?: string
  fullWidth?: boolean
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = 'Search teams, athletes, streams, events...',
      shortcutKey = '⌘K',
      fullWidth = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasValue = Boolean(value && String(value).length > 0)

    return (
      <div className={cn('relative flex items-center', fullWidth ? 'w-full' : 'w-72')}>
        <div className="absolute left-3.5 flex items-center justify-center text-[#94A3B8] pointer-events-none">
          <Search className="w-4 h-4 text-[#267BFF]" />
        </div>

        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'h-11 w-full pl-10 pr-20 rounded-lg bg-[#0E1C38] text-[#F4F6FA] text-sm placeholder:text-[#64748B] border border-[#1C3364] outline-none transition-all duration-200 focus:border-[#267BFF] focus:ring-2 focus:ring-[#267BFF]/30',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {hasValue && onClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="p-1 text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#15274D] rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {shortcutKey && (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono text-[#94A3B8] bg-[#15274D] border border-[#1C3364] rounded">
              {shortcutKey}
            </kbd>
          )}
        </div>
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

