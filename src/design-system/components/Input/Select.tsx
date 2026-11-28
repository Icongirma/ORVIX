import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface SelectOption {
  value: string
  label: string
  badge?: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helperText?: string
  errorText?: string
  options: SelectOption[]
  fullWidth?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, errorText, options, fullWidth = true, id, className, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const selectId = id || generatedId
    const hasError = Boolean(errorText)

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label htmlFor={selectId} className="text-xs sm:text-sm font-medium text-[#F6F5F1]/90 select-none font-display">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'h-11 w-full pl-3.5 pr-10 rounded-lg bg-[#252A2E] text-[#F6F5F1] text-sm border outline-none appearance-none transition-all duration-200 cursor-pointer font-body',
              hasError
                ? 'border-[#C25B5B] focus:border-[#C25B5B] focus:ring-2 focus:ring-[#C25B5B]/25'
                : 'border-[#363C42] focus:border-[#C6AD7B] focus:ring-2 focus:ring-[#C6AD7B]/20',
              disabled && 'opacity-50 cursor-not-allowed bg-[#171B1E]',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#171B1E] text-[#F6F5F1]">
                {opt.label} {opt.badge ? `(${opt.badge})` : ''}
              </option>
            ))}
          </select>

          <div className="absolute right-3.5 flex items-center justify-center text-[#8D9AA3] pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {hasError && <p className="text-xs text-[#C25B5B] font-medium mt-0.5">{errorText}</p>}
        {!hasError && helperText && <p className="text-xs text-[#8D9AA3] mt-0.5">{helperText}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
