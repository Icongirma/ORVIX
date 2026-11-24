import React from 'react'
import { Shield } from 'lucide-react'
import { OrvixBrandLockup } from '../design-system/brand'
import { Container } from '../design-system/components'
import {
  NAVIGATION_ITEMS,
  type NavigationSectionId,
} from './navigationConfig'
import { cn } from '../design-system/utils/cn'

export interface FooterProps {
  onSelectSection: (id: NavigationSectionId) => void
  className?: string
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection, className }) => {
  return (
    <footer
      className={cn(
        'border-t border-[#1C3364]/80 bg-[#040A17] py-12 px-4 sm:px-6 lg:px-8 mt-auto',
        className
      )}
    >
      <Container size="xl" className="space-y-10">
        {/* Top Grid: Brand & Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <OrvixBrandLockup
              size="md"
              variant="primary"
              withTagline
              taglineText="SPORTS & ENTERTAINMENT"
            />
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-sm leading-relaxed">
              The premier platform for high-performance sports and cinematic live entertainment. Ultra-low latency 4K multicam broadcasting, simulated telemetry, and community fan progression.
            </p>

            {/* Platform Live Operational Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E1C38] border border-[#1C3364] text-xs">
              <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
              <span className="text-[#F4F6FA] font-medium">All Broadcast Systems Operational</span>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-[#D9BD83]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#94A3B8]">
              {['home', 'sports', 'games', 'challenges'].map((id) => {
                const item = NAVIGATION_ITEMS.find((n) => n.id === id)
                if (!item) return null
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectSection(item.id)}
                      className="hover:text-[#267BFF] transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Column 2: Progression */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-[#D9BD83]">
              Community
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#94A3B8]">
              {['leaderboard', 'achievements', 'profile'].map((id) => {
                const item = NAVIGATION_ITEMS.find((n) => n.id === id)
                if (!item) return null
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectSection(item.id)}
                      className="hover:text-[#267BFF] transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Column 3: Platform & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-[#D9BD83]">
              Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#94A3B8]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSection('help')}
                  className="hover:text-[#267BFF] transition-colors"
                >
                  Help &amp; Support
                </button>
              </li>
              <li className="hover:text-[#267BFF] cursor-pointer transition-colors">Broadcast Guides</li>
              <li className="hover:text-[#267BFF] cursor-pointer transition-colors">Community Guidelines</li>
              <li className="hover:text-[#267BFF] cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Security Note */}
        <div className="pt-8 border-t border-[#1C3364]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] text-center sm:text-left min-w-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#267BFF] flex-shrink-0" />
            <span className="break-words">&copy; {new Date().getFullYear()} ORVIX Global Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1.5 text-xs text-[#94A3B8]">
            <span className="hover:text-[#F4F6FA] cursor-pointer whitespace-nowrap">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#F4F6FA] cursor-pointer whitespace-nowrap">Security Center</span>
            <span>•</span>
            <span className="hover:text-[#F4F6FA] cursor-pointer whitespace-nowrap">Cookie Settings</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
