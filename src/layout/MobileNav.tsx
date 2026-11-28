import React, { useEffect, useRef } from 'react'
import {
  X,
  ChevronRight,
  Home,
  Trophy,
  Gamepad2,
  Flame,
  User,
  Activity,
} from 'lucide-react'
import { OrvixBrandLockup } from '../design-system/brand'
import { Badge, SearchInput } from '../design-system/components'
import {
  NAVIGATION_ITEMS,
  NAVIGATION_CATEGORIES,
  type NavigationSectionId,
} from './navigationConfig'
import { cn } from '../design-system/utils/cn'

export interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  activeSection: NavigationSectionId
  onSelectSection: (id: NavigationSectionId) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

export const MobileDrawer: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  searchQuery,
  onSearchChange,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Prevent background scrolling when mobile drawer is open & auto-focus close button
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Small timeout to allow element to render before focusing
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 50)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true" aria-label="Mobile Navigation Drawer">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0D0E]/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[280px] xs:max-w-xs bg-[#171B1E] border-r border-[#363C42] h-full flex flex-col z-50 shadow-2xl animate-drawer-in">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#363C42] flex items-center justify-between gap-2 min-w-0 bg-[#1E2327]">
          <div className="min-w-0 flex-1">
            <OrvixBrandLockup size="sm" variant="primary" withTagline={false} />
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="w-9 h-9 rounded-lg bg-[#252A2E] text-[#8D9AA3] hover:text-[#F6F5F1] border border-[#363C42] flex items-center justify-center transition-all flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-3.5 border-b border-[#363C42]/70 min-w-0 bg-[#171B1E]">
          <SearchInput
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder="Search ORVIX..."
            fullWidth
          />
        </div>

        {/* Navigation Sections List */}
        <nav className="flex-1 overflow-y-auto p-3.5 space-y-5 scrollbar-none" aria-label="Mobile Sections">
          {NAVIGATION_CATEGORIES.map((category) => {
            const items = NAVIGATION_ITEMS.filter((item) => item.category === category.key)
            if (items.length === 0) return null

            return (
              <div key={category.key} className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D9AA3] font-display px-2 block truncate">
                  {category.label}
                </span>

                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeSection === item.id

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectSection(item.id)
                          onClose()
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all select-none min-h-[44px] min-w-0 gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] active:scale-[0.98]',
                          isActive
                            ? 'bg-[#2E343A] text-[#F6F5F1] font-semibold border border-[#C6AD7B]/30 shadow-sm'
                            : 'text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#252A2E]'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-[#C6AD7B]' : 'text-[#8D9AA3]')} />
                          <span className="truncate text-left">{item.label}</span>
                        </div>

                        {item.badge ? (
                          <Badge
                            variant={item.badgeVariant || 'neutral'}
                            size="sm"
                            pulse={item.badgeVariant === 'live'}
                            className="flex-shrink-0 ml-1.5"
                          >
                            {item.badge}
                          </Badge>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#68737D] flex-shrink-0 ml-1.5" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Drawer Footer: Telemetry Status */}
        <div className="p-3.5 border-t border-[#363C42] bg-[#171B1E] space-y-2 flex-shrink-0">
          <div className="p-3 rounded-xl bg-[#252A2E] border border-[#363C42] flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#F6F5F1] font-display flex items-center gap-1.5 truncate">
                <Activity className="w-3.5 h-3.5 text-[#C6AD7B] flex-shrink-0" />
                Simulated Telemetry
              </span>
              <p className="text-[10px] text-[#8D9AA3] truncate">Demonstration Platform Feeds</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#729B79] animate-pulse flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

export interface MobileBottomBarProps {
  activeSection: NavigationSectionId
  onSelectSection: (id: NavigationSectionId) => void
  className?: string
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeSection,
  onSelectSection,
  className,
}) => {
  // Mobile primary destination shortcuts (max 5 items for clean layout at 360px)
  const bottomBarItems: Array<{ id: NavigationSectionId; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'sports', label: 'Sports', icon: Trophy, badge: 'DEMO' },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'challenges', label: 'Challenges', icon: Flame },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 lg:hidden h-16 bg-[#171B1E]/95 backdrop-blur-md border-t border-[#363C42] px-2 flex items-center justify-around select-none shadow-2xl',
        className
      )}
      aria-label="Mobile Bottom Navigation"
    >
      {bottomBarItems.map((item) => {
        const Icon = item.icon
        const isActive = activeSection === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectSection(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all relative min-h-[44px] outline-none focus-visible:ring-1 focus-visible:ring-[#C6AD7B] active:scale-[0.96]',
              isActive ? 'text-[#C6AD7B]' : 'text-[#8D9AA3] hover:text-[#F6F5F1]'
            )}
          >
            {/* Active Top Bar Indicator */}
            {isActive && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#C6AD7B] rounded-full shadow-[0_0_6px_rgba(198,173,123,0.6)]"
                aria-hidden="true"
              />
            )}

            {/* Icon with Optional Live Badge */}
            <div className="relative">
              <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-105')} />
              {item.badge && (
                <span
                  className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#C6AD7B] animate-pulse ring-1 ring-[#171B1E]"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Label */}
            <span
              className={cn(
                'text-[10px] mt-1 font-display tracking-tight transition-colors truncate max-w-full',
                isActive ? 'font-bold text-[#F6F5F1]' : 'font-medium'
              )}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
