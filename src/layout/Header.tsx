import React, { useState, useRef, useEffect } from 'react'
import {
  Menu,
  Bell,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  User,
  Medal,
  HelpCircle,
  LogOut,
  Check,
  Radio,
  ExternalLink,
  CheckCheck,
} from 'lucide-react'
import { IconButton, Badge, SearchInput } from '../design-system/components'
import { OrvixBrandLockup } from '../design-system/brand'
import { NAVIGATION_ITEMS, type NavigationSectionId } from './navigationConfig'
import { cn } from '../design-system/utils/cn'

export interface HeaderProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  onOpenMobileMenu: () => void
  activeSection: NavigationSectionId
  onSelectSection: (id: NavigationSectionId) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenMobileMenu,
  activeSection,
  onSelectSection,
  searchQuery,
  onSearchChange,
  className,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(2)

  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const currentItem = NAVIGATION_ITEMS.find((n) => n.id === activeSection) || NAVIGATION_ITEMS[0]

  // Global Keyboard shortcuts: Cmd+K / Ctrl+K to focus search, Escape to close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      // Escape key closes menus
      if (e.key === 'Escape') {
        if (profileMenuOpen) setProfileMenuOpen(false)
        if (notificationsOpen) setNotificationsOpen(false)
      }
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [profileMenuOpen, notificationsOpen])

  const sampleNotifications = [
    {
      id: 'n1',
      title: 'Monaco GP Qualifying Session',
      desc: 'Simulated multicam feeds & telemetry starting at 14:00 UTC.',
      time: '12m ago',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Weekly Community Sprint Unlocked',
      desc: 'New telemetry quiz available in Challenges tab.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Season Milestone Achieved',
      desc: 'Earned "Grand Prix Pioneer" trophy badge (+500 XP).',
      time: '1d ago',
      unread: false,
    },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 sm:h-20 border-b border-[#363C42]/80 bg-[#171B1E]/95 backdrop-blur-md transition-all duration-200 min-w-0',
        className
      )}
      aria-label="Top Application Header"
    >
      <div className="h-full px-3.5 xs:px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2.5 sm:gap-4 min-w-0">
        {/* Left Section: Sidebar Toggle, Mobile Menu & Active Section Title */}
        <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-shrink-0">
          {/* Desktop Sidebar Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#252A2E] border border-[#363C42] transition-colors flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] active:scale-95"
          >
            {sidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>

          {/* Mobile Menu Hamburger (<1024px) */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile navigation menu"
            className="lg:hidden flex items-center justify-center w-9 h-9 xs:w-10 xs:h-10 rounded-lg text-[#F6F5F1] bg-[#252A2E] border border-[#363C42] hover:bg-[#2E343A] transition-colors flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Brand Mark (<1024px) */}
          <div className="flex lg:hidden items-center gap-1.5 xs:gap-2 min-w-0">
            <OrvixBrandLockup size="sm" variant="primary" withTagline={false} />
          </div>

          {/* Desktop Breadcrumb Section Indicator */}
          <div className="hidden lg:flex items-center gap-2 pl-2">
            <span className="text-xs uppercase tracking-wider text-[#8D9AA3] font-display font-medium">
              Section
            </span>
            <span className="text-xs text-[#68737D]">•</span>
            <span className="text-sm font-bold text-[#F6F5F1] font-display flex items-center gap-1.5">
              {currentItem.label}
              {currentItem.badge && (
                <Badge variant={currentItem.badgeVariant || 'neutral'} size="sm">
                  {currentItem.badge}
                </Badge>
              )}
            </span>
          </div>

          {/* Demo Arena Indicator (on xl) */}
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-[#363C42]/60">
            <Badge variant="champagne" size="sm">
              Demo Arena
            </Badge>
            <span className="text-xs text-[#8D9AA3] font-mono-stats whitespace-nowrap">
              Simulated 4K
            </span>
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="flex-1 max-w-[200px] md:max-w-xs lg:max-w-sm xl:max-w-md hidden sm:block min-w-0 mx-2">
          <SearchInput
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder="Search fixtures, teams, events..."
            shortcutKey="⌘K"
            fullWidth
          />
        </div>

        {/* Right Section: Notifications Trigger & User Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Notifications Trigger & Dropdown */}
          <div className="relative flex-shrink-0" ref={notificationsRef}>
            <IconButton
              icon={<Bell className="w-4 h-4" />}
              ariaLabel={unreadNotifications > 0 ? `View ${unreadNotifications} unread notifications` : 'View notifications'}
              aria-haspopup="dialog"
              aria-expanded={notificationsOpen}
              variant="secondary"
              size="md"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen)
                setProfileMenuOpen(false)
              }}
              className="w-9 h-9 xs:w-10 xs:h-10 text-[#8D9AA3] hover:text-[#F6F5F1] active:scale-95 transition-all"
            />
            {unreadNotifications > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C6AD7B] ring-2 ring-[#171B1E] animate-pulse"
                aria-hidden="true"
              />
            )}

            {/* Notifications Menu Popover */}
            {notificationsOpen && (
              <div
                role="dialog"
                aria-label="Notifications"
                className="absolute right-0 mt-2 w-80 sm:w-88 rounded-xl bg-[#252A2E] border border-[#363C42] shadow-2xl z-50 overflow-hidden animate-popover-in"
              >
                <div className="p-3.5 border-b border-[#363C42] flex items-center justify-between bg-[#1E2327]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-display uppercase tracking-wider text-[#F6F5F1]">
                      Notifications
                    </span>
                    {unreadNotifications > 0 ? (
                      <Badge variant="champagne" size="sm">
                        {unreadNotifications} New
                      </Badge>
                    ) : (
                      <Badge variant="steel" size="sm">
                        0 New
                      </Badge>
                    )}
                  </div>
                  {unreadNotifications > 0 ? (
                    <button
                      type="button"
                      onClick={() => setUnreadNotifications(0)}
                      className="text-[11px] text-[#C6AD7B] hover:text-[#D4BE8D] font-medium flex items-center gap-1 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  ) : (
                    <span className="text-[10px] text-[#8D9AA3]">Up to date</span>
                  )}
                </div>

                <div className="divide-y divide-[#363C42]/60 max-h-72 overflow-y-auto">
                  {unreadNotifications === 0 ? (
                    <div className="p-6 text-center space-y-2">
                      <Check className="w-6 h-6 text-[#729B79] mx-auto" />
                      <p className="text-xs font-semibold text-[#F6F5F1]">All caught up!</p>
                      <p className="text-[11px] text-[#8D9AA3]">No unread alerts or notifications.</p>
                    </div>
                  ) : (
                    sampleNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          'p-3 text-left transition-colors hover:bg-[#2E343A] cursor-pointer',
                          notif.unread && unreadNotifications > 0 ? 'bg-[#2E343A]/50' : ''
                        )}
                        onClick={() => {
                          if (notif.unread && unreadNotifications > 0) {
                            setUnreadNotifications((prev) => Math.max(0, prev - 1))
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-[#F6F5F1] leading-snug">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-[#8D9AA3] whitespace-nowrap font-mono-stats">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8D9AA3] mt-1 leading-relaxed">
                          {notif.desc}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-[#171B1E] border-t border-[#363C42] text-center">
                  <span className="text-[10px] text-[#8D9AA3]">
                    Simulated activity stream & notifications
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative flex-shrink-0" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen)
                setNotificationsOpen(false)
              }}
              aria-expanded={profileMenuOpen}
              aria-haspopup="menu"
              aria-label="User profile and account options"
              className={cn(
                'flex items-center gap-2 p-1 xs:p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#252A2E] border transition-all select-none group min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-[#C6AD7B] active:scale-95',
                profileMenuOpen
                  ? 'border-[#C6AD7B] shadow-sm'
                  : 'border-[#363C42] hover:border-[#8D9AA3]'
              )}
            >
              {/* User Avatar */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#2E343A] border border-[#C6AD7B]/40 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-xs text-[#C6AD7B]">
                  AR
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#729B79] ring-2 ring-[#171B1E]" />
              </div>

              {/* User Identity info (hidden on mobile and tablet) */}
              <div className="hidden xl:flex flex-col text-left leading-tight min-w-0">
                <span className="text-xs font-semibold text-[#F6F5F1] group-hover:text-[#C6AD7B] transition-colors truncate">
                  Alex Rivera
                </span>
                <span className="text-[10px] font-mono-stats text-[#8D9AA3] font-medium truncate">
                  LEVEL 14 • 14,840 XP
                </span>
              </div>

              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-[#8D9AA3] hidden xl:block transition-transform duration-200 flex-shrink-0',
                  profileMenuOpen ? 'rotate-180 text-[#C6AD7B]' : ''
                )}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div
                role="menu"
                aria-label="User account menu"
                className="absolute right-0 mt-2 w-64 rounded-xl bg-[#252A2E] border border-[#363C42] shadow-2xl z-50 overflow-hidden animate-popover-in"
              >
                {/* Header Profile Summary */}
                <div className="p-3.5 border-b border-[#363C42] bg-[#1E2327]">
                  <p className="text-xs font-bold text-[#F6F5F1] font-display">Alex Rivera</p>
                  <p className="text-[11px] text-[#8D9AA3] truncate">alex.rivera@orvix.internal</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono-stats font-bold text-[#C6AD7B]">
                      Level 14 Fan
                    </span>
                    <span className="text-[10px] text-[#8D9AA3] font-mono-stats">
                      14,840 Season XP
                    </span>
                  </div>
                </div>

                {/* Navigation Links inside Profile Menu */}
                <div className="p-1.5 space-y-0.5" role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSelectSection('profile')
                      setProfileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#F6F5F1] hover:bg-[#2E343A] rounded-lg transition-colors text-left outline-none focus-visible:bg-[#2E343A] focus-visible:text-[#C6AD7B]"
                  >
                    <User className="w-4 h-4 text-[#C6AD7B]" />
                    <span>View Fan Profile</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSelectSection('achievements')
                      setProfileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#F6F5F1] hover:bg-[#2E343A] rounded-lg transition-colors text-left outline-none focus-visible:bg-[#2E343A] focus-visible:text-[#C6AD7B]"
                  >
                    <Medal className="w-4 h-4 text-[#8D9AA3]" />
                    <span>Earned Trophies</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSelectSection('help')
                      setProfileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#F6F5F1] hover:bg-[#2E343A] rounded-lg transition-colors text-left outline-none focus-visible:bg-[#2E343A] focus-visible:text-[#C6AD7B]"
                  >
                    <HelpCircle className="w-4 h-4 text-[#8D9AA3]" />
                    <span>Help & Support</span>
                  </button>
                </div>

                {/* Footer Action */}
                <div className="p-1.5 border-t border-[#363C42]">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#8D9AA3] hover:text-[#C6AD7B] hover:bg-[#2E343A] rounded-lg transition-colors text-left outline-none focus-visible:bg-[#2E343A]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Close Menu</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
