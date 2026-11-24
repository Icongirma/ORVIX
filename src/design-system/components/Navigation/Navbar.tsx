import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { OrvixBrandLockup } from '../../brand/OrvixBrandLockup'
import { cn } from '../../utils/cn'

export interface NavItem {
  id: string
  label: string
  href?: string
  badge?: string
  badgeVariant?: 'live' | 'gold' | 'blue'
  isActive?: boolean
  onClick?: () => void
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brandVariant?: 'primary' | 'gold' | 'blue' | 'monochrome'
  items?: NavItem[]
  actions?: React.ReactNode
  activeId?: string
  onItemSelect?: (id: string) => void
  sticky?: boolean
  transparent?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  brandVariant = 'primary',
  items = [],
  actions,
  activeId,
  onItemSelect,
  sticky = true,
  transparent = false,
  className,
  ...props
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleItemClick = (item: NavItem) => {
    if (item.onClick) item.onClick()
    if (onItemSelect) onItemSelect(item.id)
    setMobileMenuOpen(false)
  }

  return (
    <nav
      className={cn(
        'w-full z-40 transition-all duration-200 border-b border-[#1C3364]/70',
        sticky && 'sticky top-0',
        transparent
          ? 'bg-transparent'
          : 'bg-[#081329]/90 backdrop-blur-md',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <OrvixBrandLockup
              size="md"
              variant={brandVariant}
              withTagline={false}
              className="cursor-pointer hover:opacity-95 transition-opacity"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {items.map((item) => {
              const isCurrent = activeId ? item.id === activeId : item.isActive
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 select-none font-body',
                    isCurrent
                      ? 'text-[#F4F6FA] bg-[#15274D] border border-[#267BFF]/40 shadow-[0_0_15px_rgba(38,123,255,0.2)]'
                      : 'text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38]'
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full',
                        item.badgeVariant === 'live'
                          ? 'bg-[#FF3B56]/20 text-[#FF3B56] border border-[#FF3B56]/40'
                          : item.badgeVariant === 'gold'
                          ? 'bg-[#D9BD83]/20 text-[#D9BD83] border border-[#D9BD83]/40'
                          : 'bg-[#267BFF]/20 text-[#267BFF] border border-[#267BFF]/40'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Action Items (Right) */}
          <div className="hidden sm:flex items-center gap-3">
            {actions}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center sm:hidden gap-2">
            {actions && <div className="sm:hidden">{actions}</div>}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-lg bg-[#0E1C38] text-[#F4F6FA] border border-[#1C3364] hover:bg-[#15274D] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1C3364] bg-[#081329] px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1.5">
            {items.map((item) => {
              const isCurrent = activeId ? item.id === activeId : item.isActive
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between',
                    isCurrent
                      ? 'text-[#F4F6FA] bg-[#15274D] border border-[#267BFF]/40 font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38]'
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                        item.badgeVariant === 'live'
                          ? 'bg-[#FF3B56]/20 text-[#FF3B56] border border-[#FF3B56]/40'
                          : 'bg-[#267BFF]/20 text-[#267BFF]'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

