import React from 'react'
import { OrvixLogo, type OrvixLogoProps, type LogoVariant } from './OrvixLogo'
import { OrvixWordmark, type OrvixWordmarkProps, type WordmarkVariant } from './OrvixWordmark'
import { cn } from '../utils/cn'

export interface OrvixBrandLockupProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: 'horizontal' | 'vertical' | 'mark-only' | 'wordmark-only'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: LogoVariant | WordmarkVariant
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
  taglineText = 'PLAY. COMPETE. DISCOVER.',
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
        <OrvixLogo size={logoSizeMap[size]} variant={variant as LogoVariant} glow={glow} />
      </div>
    )
  }

  if (layout === 'wordmark-only') {
    return (
      <div className={cn('inline-flex items-center justify-center', className)} {...props}>
        <OrvixWordmark
          size={wordmarkSizeMap[size]}
          variant={variant as WordmarkVariant}
          withTagline={withTagline}
          taglineText={taglineText}
        />
      </div>
    )
  }

  if (layout === 'vertical') {
    return (
      <div
        className={cn('inline-flex flex-col items-center justify-center gap-3 text-center min-w-0 max-w-full', className)}
        role="img"
        aria-label="ORVIX Brand Lockup"
        {...props}
      >
        <OrvixLogo size={logoSizeMap[size]} variant={variant as LogoVariant} glow={glow} className="flex-shrink-0" />
        <OrvixWordmark
          size={wordmarkSizeMap[size]}
          variant={variant as WordmarkVariant}
          withTagline={withTagline}
          taglineText={taglineText}
          className="min-w-0"
        />
      </div>
    )
  }

  // Horizontal layout (default)
  const gapMap = {
    sm: 'gap-2.5',
    md: 'gap-3 sm:gap-3.5',
    lg: 'gap-3.5 sm:gap-4',
    xl: 'gap-4 sm:gap-5',
  }

  return (
    <div
      className={cn('inline-flex items-center min-w-0 max-w-full', gapMap[size], className)}
      role="img"
      aria-label="ORVIX Brand Lockup"
      {...props}
    >
      <OrvixLogo size={logoSizeMap[size]} variant={variant as LogoVariant} glow={glow} className="flex-shrink-0" />
      <OrvixWordmark
        size={wordmarkSizeMap[size]}
        variant={variant as WordmarkVariant}
        withTagline={withTagline}
        taglineText={taglineText}
        className="min-w-0"
      />
    </div>
  )
}
