import React from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  errorText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  fullWidth?: boolean
  variant?: 'default' | 'gold-accent'
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
            className="text-xs sm:text-sm font-medium text-[#F4F6FA]/90 select-none flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3.5 flex items-center justify-center text-[#94A3B8] pointer-events-none">
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
              'h-11 rounded-lg bg-[#0E1C38] text-[#F4F6FA] text-sm placeholder:text-[#64748B] transition-all duration-200 border outline-none',
              startIcon ? 'pl-10' : 'pl-3.5',
              endIcon ? 'pr-10' : 'pr-3.5',
              fullWidth ? 'w-full' : 'w-auto',
              hasError
                ? 'border-[#FF3B56] focus:border-[#FF3B56] focus:ring-2 focus:ring-[#FF3B56]/30'
                : variant === 'gold-accent'
                ? 'border-[#D9BD83]/40 focus:border-[#D9BD83] focus:ring-2 focus:ring-[#D9BD83]/30'
                : 'border-[#1C3364] focus:border-[#267BFF] focus:ring-2 focus:ring-[#267BFF]/30',
              disabled && 'opacity-50 cursor-not-allowed bg-[#081329]',
              className
            )}
            {...props}
          />

          {endIcon && (
            <div className="absolute right-3.5 flex items-center justify-center text-[#94A3B8]">
              {endIcon}
            </div>
          )}
        </div>

        {hasError && (
          <p id={`${inputId}-error`} className="text-xs text-[#FF3B56] flex items-center gap-1 font-medium">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errorText}
          </p>
        )}

        {!hasError && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-[#94A3B8]">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

