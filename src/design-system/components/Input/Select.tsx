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
          <label htmlFor={selectId} className="text-xs sm:text-sm font-medium text-[#F4F6FA]/90 select-none">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'h-11 w-full pl-3.5 pr-10 rounded-lg bg-[#0E1C38] text-[#F4F6FA] text-sm border outline-none appearance-none transition-all duration-200 cursor-pointer',
              hasError
                ? 'border-[#FF3B56] focus:border-[#FF3B56] focus:ring-2 focus:ring-[#FF3B56]/30'
                : 'border-[#1C3364] focus:border-[#267BFF] focus:ring-2 focus:ring-[#267BFF]/30',
              disabled && 'opacity-50 cursor-not-allowed bg-[#081329]',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#081329] text-[#F4F6FA]">
                {opt.label} {opt.badge ? `(${opt.badge})` : ''}
              </option>
            ))}
          </select>

          <div className="absolute right-3.5 flex items-center justify-center text-[#94A3B8] pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {hasError && <p className="text-xs text-[#FF3B56] font-medium">{errorText}</p>}
        {!hasError && helperText && <p className="text-xs text-[#94A3B8]">{helperText}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

