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
        <div className="absolute left-3.5 flex items-center justify-center text-[#8D9AA3] pointer-events-none">
          <Search className="w-4 h-4 text-[#8D9AA3]" />
        </div>

        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'h-11 w-full pl-10 pr-20 rounded-lg bg-[#252A2E] text-[#F6F5F1] text-sm placeholder:text-[#8D9AA3]/60 border border-[#363C42] outline-none transition-all duration-200 focus:border-[#C6AD7B] focus:ring-2 focus:ring-[#C6AD7B]/20 font-body',
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
              className="p-1 text-[#8D9AA3] hover:text-[#C6AD7B] hover:bg-[#2E343A] rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {shortcutKey && (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#8D9AA3] bg-[#171B1E] border border-[#363C42] rounded">
              {shortcutKey}
            </kbd>
          )}
        </div>
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
