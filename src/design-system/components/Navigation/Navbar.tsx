import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { OrvixBrandLockup } from '../../brand/OrvixBrandLockup'
import { cn } from '../../utils/cn'

export interface NavItem {
  id: string
  label: string
  href?: string
  badge?: string
  badgeVariant?: 'live' | 'champagne' | 'steel' | 'silver' | 'coral' | 'gold' | 'blue'
  isActive?: boolean
  onClick?: () => void
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brandVariant?: 'primary' | 'champagne' | 'steel' | 'silver' | 'graphite' | 'monochrome' | 'dark'
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
        'w-full z-40 transition-all duration-200 border-b border-[#363C42]/80',
        sticky && 'sticky top-0',
        transparent ? 'bg-transparent' : 'bg-[#171B1E]/95 backdrop-blur-md',
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
                      ? 'text-[#F6F5F1] bg-[#2E343A] border border-[#C6AD7B]/40 shadow-sm'
                      : 'text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#252A2E]'
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full',
                        item.badgeVariant === 'live' || item.badgeVariant === 'champagne'
                          ? 'bg-[#C6AD7B]/20 text-[#C6AD7B]'
                          : 'bg-[#8D9AA3]/20 text-[#8D9AA3]'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Action Area */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#252A2E] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#363C42] bg-[#171B1E] px-4 pt-3 pb-5 space-y-2">
          {items.map((item) => {
            const isCurrent = activeId ? item.id === activeId : item.isActive
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={cn(
                  'w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between font-body',
                  isCurrent
                    ? 'text-[#F6F5F1] bg-[#2E343A] border border-[#C6AD7B]/40'
                    : 'text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#252A2E]'
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#C6AD7B]/20 text-[#C6AD7B]">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </nav>
  )
}
