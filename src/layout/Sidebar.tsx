import React from 'react'
import { Activity } from 'lucide-react'
import { OrvixBrandLockup } from '../design-system/brand'
import { Badge } from '../design-system/components'
import {
  NAVIGATION_ITEMS,
  NAVIGATION_CATEGORIES,
  type NavigationSectionId,
} from './navigationConfig'
import { cn } from '../design-system/utils/cn'

export interface SidebarProps {
  collapsed: boolean
  activeSection: NavigationSectionId
  onSelectSection: (id: NavigationSectionId) => void
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  activeSection,
  onSelectSection,
  className,
}) => {
  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-[#1C3364]/80 bg-[#040A17] sticky top-0 h-screen transition-all duration-300 z-40 select-none overflow-hidden',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Sidebar Header / Brand Lockup */}
      <div className="h-16 sm:h-20 flex items-center px-4 border-b border-[#1C3364]/70 flex-shrink-0">
        {collapsed ? (
          <div className="w-full flex justify-center">
            <OrvixBrandLockup layout="mark-only" size="md" variant="primary" glow />
          </div>
        ) : (
          <div className="pl-1 min-w-0">
            <OrvixBrandLockup
              layout="horizontal"
              size="sm"
              variant="primary"
              withTagline
              taglineText="SPORTS & ENTERTAINMENT"
            />
          </div>
        )}
      </div>

      {/* Navigation Sections Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        {NAVIGATION_CATEGORIES.map((category) => {
          const items = NAVIGATION_ITEMS.filter((item) => item.category === category.key)
          if (items.length === 0) return null

          return (
            <div key={category.key} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-display">
                  {category.label}
                </div>
              )}

              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectSection(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative',
                        collapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 gap-3',
                        isActive
                          ? 'bg-[#15274D] text-[#F4F6FA] font-semibold border border-[#267BFF]/40 shadow-[0_0_16px_rgba(38,123,255,0.25)]'
                          : 'text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38] border border-transparent'
                      )}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#267BFF] rounded-r-full shadow-[0_0_8px_#267BFF]" />
                      )}

                      {/* Nav Icon */}
                      <Icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0 transition-colors',
                          isActive ? 'text-[#267BFF]' : 'text-[#94A3B8] group-hover:text-[#F4F6FA]'
                        )}
                      />

                      {/* Nav Label & Badge (when expanded) */}
                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0 gap-2">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <Badge
                              variant={item.badgeVariant || 'neutral'}
                              size="sm"
                              pulse={item.badgeVariant === 'live'}
                              className="flex-shrink-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Small badge dot when collapsed */}
                      {collapsed && item.badge && (
                        <span
                          className={cn(
                            'absolute top-2 right-2 w-2 h-2 rounded-full',
                            item.badgeVariant === 'live'
                              ? 'bg-[#FF3B56] animate-pulse'
                              : item.badgeVariant === 'gold'
                              ? 'bg-[#D9BD83]'
                              : 'bg-[#267BFF]'
                          )}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sidebar Footer Widget: Stream Status */}
      <div className="p-3 border-t border-[#1C3364]/70 flex-shrink-0">
        {collapsed ? (
          <div
            title="Stream Engine: 4K HDR Active"
            className="w-full flex items-center justify-center p-2.5 rounded-xl bg-[#0E1C38] border border-[#1C3364] text-[#00E599]"
          >
            <Activity className="w-5 h-5" />
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-[#0E1C38] border border-[#1C3364] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold font-display text-white">
                <Activity className="w-3.5 h-3.5 text-[#267BFF]" />
                Stream Engine
              </span>
              <span className="text-[10px] font-mono-stats text-[#00E599] font-bold">4K HDR</span>
            </div>

            <p className="text-[11px] text-[#94A3B8] leading-tight">
              Ultra-low latency multicam broadcast active.
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
