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
    <div className={cn('min-h-screen bg-[#171B1E] text-[#F6F5F1] flex flex-col font-body selection:bg-[#C6AD7B] selection:text-[#171B1E]', className)}>
      {/* Top Banner with Quick Switcher to Design System Showcase */}
      {onSwitchToDesignShowcase && (
        <aside aria-label="Design system switcher" className="bg-[#171B1E] border-b border-[#363C42] px-3 xs:px-4 py-1.5 flex items-center justify-between gap-2 text-xs z-50 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-2 h-2 rounded-full bg-[#C6AD7B] animate-pulse flex-shrink-0" />
            <span className="font-semibold text-[#F6F5F1] truncate">ORVIX Platform</span>
            <span className="hidden sm:inline text-[#68737D] flex-shrink-0">•</span>
            <span className="hidden sm:inline text-[#8D9AA3] truncate">
              Section: <span className="text-[#C6AD7B] font-semibold capitalize">{activeSection}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onSwitchToDesignShowcase}
            className="text-[#C6AD7B] hover:text-[#D4BE8D] font-semibold text-xs transition-colors flex items-center gap-1 whitespace-nowrap flex-shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-[#C6AD7B]"
          >
            <span className="hidden xs:inline">Design System</span> Showcase &rarr;
          </button>
        </aside>
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
        {/* pb-20 on mobile ensures bottom navigation bar never covers content */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
          {/* Desktop & Mobile Header */}
          <Header
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            onOpenMobileMenu={() => setMobileDrawerOpen(true)}
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0" id="main-content">
            <MainContent
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
            />
          </main>

          {/* Global Platform Footer */}
          <Footer onSelectSection={handleSelectSection} />
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (<1024px) */}
      <MobileBottomBar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />
    </div>
  )
}
