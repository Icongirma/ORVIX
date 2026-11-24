import React, { useEffect } from 'react'
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
  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-[#040A17]/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[280px] xs:max-w-xs bg-[#081329] border-r border-[#1C3364] h-full flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#1C3364] flex items-center justify-between gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <OrvixBrandLockup size="sm" variant="primary" withTagline={false} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-lg bg-[#0E1C38] text-[#94A3B8] hover:text-[#F4F6FA] border border-[#1C3364] flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-3.5 border-b border-[#1C3364]/70 min-w-0">
          <SearchInput
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder="Search ORVIX..."
            fullWidth
          />
        </div>

        {/* Navigation Sections List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
          {NAVIGATION_CATEGORIES.map((category) => {
            const items = NAVIGATION_ITEMS.filter((item) => item.category === category.key)
            if (items.length === 0) return null

            return (
              <div key={category.key} className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-display px-2 block truncate">
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
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all select-none min-h-[44px] min-w-0 gap-2',
                          isActive
                            ? 'bg-[#15274D] text-[#F4F6FA] font-semibold border border-[#267BFF]/40 shadow-[0_0_12px_rgba(38,123,255,0.25)]'
                            : 'text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38]'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-[#267BFF]' : 'text-[#94A3B8]')} />
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
                          <ChevronRight className="w-4 h-4 text-[#64748B] flex-shrink-0 ml-1.5" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Drawer Footer: Stream Engine Status */}
        <div className="p-3.5 border-t border-[#1C3364] bg-[#040A17] space-y-2 flex-shrink-0">
          <div className="p-3 rounded-xl bg-[#0E1C38] border border-[#1C3364] flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold font-display text-white flex items-center gap-1.5 truncate">
                <Activity className="w-3.5 h-3.5 text-[#267BFF] flex-shrink-0" />
                Stream Engine
              </p>
              <p className="text-[11px] text-[#94A3B8] truncate">4K Ultra-Low Latency</p>
            </div>
            <Badge variant="success" size="sm" className="flex-shrink-0">ONLINE</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export interface MobileBottomBarProps {
  activeSection: NavigationSectionId
  onSelectSection: (id: NavigationSectionId) => void
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const bottomNavItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'sports' as const, label: 'Sports', icon: Trophy, hasDot: true },
    { id: 'games' as const, label: 'Games', icon: Gamepad2 },
    { id: 'challenges' as const, label: 'Challenges', icon: Flame },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ]

  return (
    <nav
      aria-label="Mobile Bottom Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-[#081329]/95 backdrop-blur-md border-t border-[#1C3364] px-1 xs:px-2 flex items-center justify-around select-none shadow-[0_-4px_20px_rgba(0,0,0,0.5)] min-w-0"
    >
      {bottomNavItems.map((item) => {
        const Icon = item.icon
        const isActive = activeSection === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectSection(item.id)}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full min-h-[44px] py-1 transition-all relative min-w-0 overflow-hidden px-0.5',
              isActive ? 'text-[#267BFF]' : 'text-[#94A3B8] hover:text-[#F4F6FA]'
            )}
          >
            {/* Active Pill Glow */}
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 bg-[#267BFF] rounded-full shadow-[0_0_8px_#267BFF]" />
            )}

            <div className="relative flex-shrink-0">
              <Icon className={cn('w-5 h-5 transition-transform duration-200', isActive && 'scale-110')} />
              {item.hasDot && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF3B56] animate-pulse" />
              )}
            </div>

            <span
              className={cn(
                'text-[9px] xs:text-[10px] mt-1 font-display font-medium tracking-tight truncate max-w-[56px] xs:max-w-none text-center leading-none',
                isActive && 'font-bold text-[#267BFF]'
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
