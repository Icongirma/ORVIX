import React from 'react'
import { cn } from '../../utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  errorText?: string
  fullWidth?: boolean
  maxCount?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, errorText, fullWidth = true, maxCount, value, id, className, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId
    const hasError = Boolean(errorText)
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-[#F4F6FA]/90">
            <label htmlFor={textareaId}>{label}</label>
            {maxCount && (
              <span className="text-xs text-[#94A3B8]">
                {currentLength} / {maxCount}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          disabled={disabled}
          className={cn(
            'min-h-[100px] p-3.5 rounded-lg bg-[#0E1C38] text-[#F4F6FA] text-sm placeholder:text-[#64748B] border outline-none transition-all duration-200 resize-y',
            hasError
              ? 'border-[#FF3B56] focus:border-[#FF3B56] focus:ring-2 focus:ring-[#FF3B56]/30'
              : 'border-[#1C3364] focus:border-[#267BFF] focus:ring-2 focus:ring-[#267BFF]/30',
            disabled && 'opacity-50 cursor-not-allowed bg-[#081329]',
            className
          )}
          {...props}
        />

        {hasError && <p className="text-xs text-[#FF3B56] font-medium">{errorText}</p>}
        {!hasError && helperText && <p className="text-xs text-[#94A3B8]">{helperText}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

