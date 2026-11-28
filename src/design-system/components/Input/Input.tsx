import React from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  errorText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  fullWidth?: boolean
  variant?: 'default' | 'silver' | 'light' | 'forest'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      startIcon,
      endIcon,
      fullWidth = true,
      variant = 'default',
      id,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const hasError = Boolean(errorText)

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-medium text-[#F6F5F1]/90 select-none flex items-center justify-between font-display"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3.5 flex items-center justify-center text-[#8D9AA3] pointer-events-none">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'h-11 rounded-lg text-sm transition-all duration-200 border outline-none font-body',
              startIcon ? 'pl-10' : 'pl-3.5',
              endIcon ? 'pr-10' : 'pr-3.5',
              fullWidth ? 'w-full' : 'w-auto',
              variant === 'light'
                ? 'bg-[#F6F5F1] text-[#171B1E] placeholder:text-[#68737D]/60 border-[#D9DEE2] focus:border-[#C6AD7B] focus:ring-2 focus:ring-[#C6AD7B]/20'
                : variant === 'silver'
                ? 'bg-[#D9DEE2] text-[#171B1E] placeholder:text-[#68737D]/60 border-[#CAD0D5] focus:border-[#C6AD7B] focus:ring-2 focus:ring-[#C6AD7B]/20'
                : 'bg-[#252A2E] text-[#F6F5F1] placeholder:text-[#8D9AA3]/60 border-[#363C42] focus:border-[#C6AD7B] focus:ring-2 focus:ring-[#C6AD7B]/20',
              hasError && 'border-[#C25B5B] focus:border-[#C25B5B] focus:ring-2 focus:ring-[#C25B5B]/25',
              disabled && 'opacity-50 cursor-not-allowed bg-[#171B1E]',
              className
            )}
            {...props}
          />

          {endIcon && (
            <div className="absolute right-3.5 flex items-center justify-center text-[#8D9AA3]">
              {endIcon}
            </div>
          )}
        </div>

        {hasError && (
          <p id={`${inputId}-error`} className="text-xs text-[#C25B5B] font-medium mt-0.5">
            {errorText}
          </p>
        )}
        {!hasError && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-[#8D9AA3] mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
