import React, { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MobileDrawer, MobileBottomBar } from './MobileNav'
import { MainContent } from './MainContent'
import { Footer } from './Footer'
import {
  type NavigationSectionId,
} from './navigationConfig'
import { cn } from '../design-system/utils/cn'

export interface AppLayoutProps {
  initialSection?: NavigationSectionId
  onSwitchToDesignShowcase?: () => void
  className?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  initialSection = 'home',
  onSwitchToDesignShowcase,
  className,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<NavigationSectionId>(initialSection)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelectSection = (id: NavigationSectionId) => {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={cn('min-h-screen bg-[#081329] text-[#F4F6FA] flex flex-col font-body', className)}>
      {/* Top Banner with Quick Switcher to Design System Showcase */}
      {onSwitchToDesignShowcase && (
        <div className="bg-[#040A17] border-b border-[#1C3364] px-3 xs:px-4 py-1.5 flex items-center justify-between gap-2 text-xs z-50 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse flex-shrink-0" />
            <span className="font-semibold text-[#F4F6FA] truncate">ORVIX Platform</span>
            <span className="hidden sm:inline text-[#64748B] flex-shrink-0">•</span>
            <span className="hidden sm:inline text-[#94A3B8] truncate">
              Active: <span className="text-[#267BFF] font-semibold capitalize">{activeSection}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onSwitchToDesignShowcase}
            className="text-[#267BFF] hover:text-[#5EA1FF] font-semibold text-xs transition-colors flex items-center gap-1 whitespace-nowrap flex-shrink-0"
          >
            <span className="hidden xs:inline">Design System</span> Showcase &rarr;
          </button>
        </div>
      )}

      {/* Main Framework: Sidebar + Core Stage */}
      <div className="flex flex-1 relative min-w-0 overflow-x-hidden">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />

        {/* Mobile Slide-Over Drawer */}
        <MobileDrawer
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Core Stage: Header + Main Content + Footer */}
        <div className="flex-1 flex flex-col min-w-0 pb-24 sm:pb-28 lg:pb-0">
          {/* Desktop & Mobile Header */}
          <Header
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            onOpenMobileMenu={() => setMobileDrawerOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <MainContent
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
            />
          </main>

          {/* Global Platform Footer */}
          <Footer onSelectSection={handleSelectSection} />
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Phone viewports) */}
      <MobileBottomBar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />
    </div>
  )
}
