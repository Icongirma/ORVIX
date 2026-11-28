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
          <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-[#F6F5F1]/90 font-display">
            <label htmlFor={textareaId}>{label}</label>
            {maxCount && (
              <span className="text-xs text-[#8D9AA3]">
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
            'min-h-[100px] p-3.5 rounded-lg bg-[#252A2E] text-[#F6F5F1] text-sm placeholder:text-[#8D9AA3]/60 border outline-none transition-all duration-200 resize-y font-body',
            hasError
              ? 'border-[#C25B5B] focus:border-[#C25B5B] focus:ring-2 focus:ring-[#C25B5B]/25'
              : 'border-[#363C42] focus:border-[#C6AD7B] focus:ring-2 focus:ring-[#C6AD7B]/20',
            disabled && 'opacity-50 cursor-not-allowed bg-[#171B1E]',
            className
          )}
          {...props}
        />

        {hasError && <p className="text-xs text-[#C25B5B] font-medium mt-0.5">{errorText}</p>}
        {!hasError && helperText && <p className="text-xs text-[#8D9AA3] mt-0.5">{helperText}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
