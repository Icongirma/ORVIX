import React from 'react'
import {
  Menu,
  Bell,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
} from 'lucide-react'
import { IconButton, Badge, SearchInput } from '../design-system/components'
import { OrvixLogo } from '../design-system/brand'
import { cn } from '../design-system/utils/cn'

export interface HeaderProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  onOpenMobileMenu: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onOpenNotifications?: () => void
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  className,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 sm:h-20 border-b border-[#1C3364]/80 bg-[#081329]/95 backdrop-blur-md transition-all duration-200 min-w-0',
        className
      )}
    >
      <div className="h-full px-3.5 xs:px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2.5 sm:gap-4 min-w-0">
        {/* Left Section: Sidebar Toggle & Mobile Branding */}
        <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-shrink-0">
          {/* Desktop Sidebar Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38] border border-[#1C3364] transition-colors flex-shrink-0"
          >
            {sidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>

          {/* Mobile Menu Hamburger (accessible on <1024px) */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile navigation menu"
            className="lg:hidden flex items-center justify-center w-9 h-9 xs:w-10 xs:h-10 rounded-lg text-[#F4F6FA] bg-[#0E1C38] border border-[#1C3364] hover:bg-[#15274D] transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Brand Mark (shown on <1024px) */}
          <div className="flex lg:hidden items-center gap-1.5 xs:gap-2 min-w-0">
            <OrvixLogo size="sm" variant="primary" glow className="flex-shrink-0" />
            <span className="font-display font-black text-sm xs:text-base sm:text-lg tracking-[0.1em] xs:tracking-[0.18em] text-[#F4F6FA] truncate">
              ORVI<span className="text-[#267BFF]">X</span>
            </span>
          </div>

          {/* Live Arena Badge (Desktop only on xl to preserve tablet breathing space) */}
          <div className="hidden xl:flex items-center gap-2 pl-2">
            <Badge variant="live" size="sm" pulse>
              Live Arena
            </Badge>
            <span className="text-xs text-[#94A3B8] whitespace-nowrap">
              14 Online
            </span>
          </div>
        </div>

        {/* Center: Search Field (visible from sm and above, width-constrained on tablet) */}
        <div className="flex-1 max-w-[200px] md:max-w-xs lg:max-w-sm xl:max-w-md hidden sm:block min-w-0 mx-2">
          <SearchInput
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder="Search sports, games..."
            shortcutKey="⌘K"
            fullWidth
          />
        </div>

        {/* Right Section: Actions & User Avatar */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 flex-shrink-0">
          {/* Notifications Trigger */}
          <div className="relative flex-shrink-0">
            <IconButton
              icon={<Bell className="w-4 h-4" />}
              ariaLabel="View notifications"
              variant="secondary"
              size="md"
              onClick={onOpenNotifications}
              className="w-9 h-9 xs:w-10 xs:h-10"
            />
            {/* Unread alert dot */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#FF3B56] ring-2 ring-[#081329]" />
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center pl-0.5 sm:pl-1 flex-shrink-0">
            <button
              type="button"
              className="flex items-center gap-2 p-1 xs:p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#0E1C38] border border-[#1C3364] hover:border-[#267BFF]/50 transition-all select-none group min-w-0"
              aria-label="User profile menu"
            >
              {/* Avatar with status indicator */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-[#267BFF] to-[#D9BD83] p-[1.5px] flex-shrink-0">
                <div className="w-full h-full rounded-[6px] bg-[#081329] flex items-center justify-center font-display font-bold text-xs text-[#F4F6FA]">
                  AR
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00E599] ring-2 ring-[#081329]" />
              </div>

              {/* Name & Role (hidden on tablet and mobile, visible on xl) */}
              <div className="hidden xl:flex flex-col text-left leading-tight min-w-0">
                <span className="text-xs font-semibold text-[#F4F6FA] group-hover:text-[#267BFF] transition-colors truncate">
                  Alex Rivera
                </span>
                <span className="text-[10px] font-mono-stats text-[#94A3B8] font-medium truncate">
                  LEVEL 14 • 14,840 XP
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden xl:block group-hover:text-[#F4F6FA] flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
