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
        'hidden lg:flex flex-col border-r border-[#363C42] bg-[#171B1E] sticky top-0 h-screen transition-[width] duration-300 ease-in-out z-40 select-none overflow-hidden flex-shrink-0',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
      aria-label="Desktop Navigation Sidebar"
    >
      {/* Sidebar Header / Brand Lockup */}
      <div className="h-16 sm:h-20 flex items-center px-4 border-b border-[#363C42]/80 flex-shrink-0">
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
              taglineText="PLAY. COMPETE. DISCOVER."
            />
          </div>
        )}
      </div>

      {/* Navigation Sections Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none" aria-label="Main Navigation">
        {NAVIGATION_CATEGORIES.map((category) => {
          const items = NAVIGATION_ITEMS.filter((item) => item.category === category.key)
          if (items.length === 0) return null

          return (
            <div key={category.key} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#8D9AA3] font-display">
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
                      aria-label={collapsed ? item.label : undefined}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] active:scale-[0.98]',
                        collapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 gap-3',
                        isActive
                          ? 'bg-[#2E343A] text-[#F6F5F1] font-semibold border border-[#C6AD7B]/30 shadow-sm'
                          : 'text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#252A2E] border border-transparent'
                      )}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-2 bottom-2 w-1 bg-[#C6AD7B] rounded-r-full shadow-[0_0_8px_rgba(198,173,123,0.4)]"
                          aria-hidden="true"
                        />
                      )}

                      {/* Nav Icon */}
                      <Icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0 transition-colors',
                          isActive ? 'text-[#C6AD7B]' : 'text-[#8D9AA3] group-hover:text-[#F6F5F1]'
                        )}
                        aria-hidden="true"
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
                              ? 'bg-[#C6AD7B] animate-pulse'
                              : 'bg-[#C6AD7B]'
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Sidebar Footer Widget: Stream & Telemetry Status */}
      <div className="p-3 border-t border-[#363C42]/80 flex-shrink-0">
        {collapsed ? (
          <div
            title="Simulated Telemetry: Demo Feeds Active"
            className="w-full flex items-center justify-center p-2.5 rounded-xl bg-[#252A2E] border border-[#363C42] text-[#C6AD7B]"
          >
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-[#252A2E] border border-[#363C42] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold font-display text-[#F6F5F1]">
                <Activity className="w-3.5 h-3.5 text-[#C6AD7B]" />
                Simulated Telemetry
              </span>
              <span className="w-2 h-2 rounded-full bg-[#729B79] animate-pulse" />
            </div>
            <p className="text-[11px] text-[#8D9AA3] leading-snug">
              Demonstration feeds & sample metrics active.
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
