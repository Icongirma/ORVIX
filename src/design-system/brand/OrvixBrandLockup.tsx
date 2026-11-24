import React from 'react'
import { OrvixLogo, type OrvixLogoProps } from './OrvixLogo'
import { OrvixWordmark, type OrvixWordmarkProps } from './OrvixWordmark'
import { cn } from '../utils/cn'

export interface OrvixBrandLockupProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: 'horizontal' | 'vertical' | 'mark-only' | 'wordmark-only'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'gold' | 'blue' | 'monochrome' | 'dark'
  withTagline?: boolean
  taglineText?: string
  glow?: boolean
  className?: string
}

export const OrvixBrandLockup: React.FC<OrvixBrandLockupProps> = ({
  layout = 'horizontal',
  size = 'md',
  variant = 'primary',
  withTagline = false,
  taglineText = 'SPORTS & ENTERTAINMENT',
  glow = false,
  className,
  ...props
}) => {
  const logoSizeMap: Record<'sm' | 'md' | 'lg' | 'xl', OrvixLogoProps['size']> = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  }

  const wordmarkSizeMap: Record<'sm' | 'md' | 'lg' | 'xl', OrvixWordmarkProps['size']> = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  }

  if (layout === 'mark-only') {
    return (
      <div className={cn('inline-flex items-center justify-center', className)} {...props}>
        <OrvixLogo size={logoSizeMap[size]} variant={variant} glow={glow} />
      </div>
    )
  }

  if (layout === 'wordmark-only') {
    return (
      <div className={cn('inline-flex items-center justify-center', className)} {...props}>
        <OrvixWordmark
          size={wordmarkSizeMap[size]}
          variant={variant}
          withTagline={withTagline}
          taglineText={taglineText}
        />
      </div>
    )
  }

  if (layout === 'vertical') {
    return (
      <div
        className={cn('inline-flex flex-col items-center justify-center gap-3 text-center', className)}
        role="img"
        aria-label="ORVIX Brand Lockup"
        {...props}
      >
        <OrvixLogo size={logoSizeMap[size]} variant={variant} glow={glow} />
        <OrvixWordmark
          size={wordmarkSizeMap[size]}
          variant={variant}
          withTagline={withTagline}
          taglineText={taglineText}
        />
      </div>
    )
  }

  // Horizontal layout (default)
  return (
    <div
      className={cn('inline-flex items-center gap-3.5', className)}
      role="img"
      aria-label="ORVIX Brand Lockup"
      {...props}
    >
      <OrvixLogo size={logoSizeMap[size]} variant={variant} glow={glow} />
      <OrvixWordmark
        size={wordmarkSizeMap[size]}
        variant={variant}
        withTagline={withTagline}
        taglineText={taglineText}
      />
    </div>
  )
}
