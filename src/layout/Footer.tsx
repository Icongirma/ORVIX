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
        'border-t border-[#363C42] bg-[#171B1E] py-12 px-4 sm:px-6 lg:px-8 mt-auto text-[#8D9AA3]',
        className
      )}
      aria-label="Application Footer"
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
              taglineText="PLAY. COMPETE. DISCOVER."
            />
            <p className="text-xs sm:text-sm text-[#8D9AA3] max-w-sm leading-relaxed font-body">
              The premier platform for high-performance sports and cinematic live entertainment. Multi-angle broadcast simulation, simulated demonstration telemetry, and community fan progression.
            </p>

            {/* Platform Live Operational Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#252A2E] border border-[#363C42] text-xs">
              <span className="w-2 h-2 rounded-full bg-[#729B79] animate-pulse" />
              <span className="text-[#F6F5F1] font-medium font-display">Broadcast Telemetry Systems Operational</span>
            </div>
          </div>

          {/* Column 1: Explore & Play */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-[#C6AD7B]">
              Explore & Play
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#8D9AA3] font-body">
              {['home', 'sports', 'games', 'challenges'].map((id) => {
                const item = NAVIGATION_ITEMS.find((n) => n.id === id)
                if (!item) return null
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectSection(item.id)}
                      className="hover:text-[#C6AD7B] transition-colors text-left"
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
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-[#C6AD7B]">
              Progression
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#8D9AA3] font-body">
              {['leaderboard', 'achievements', 'profile'].map((id) => {
                const item = NAVIGATION_ITEMS.find((n) => n.id === id)
                if (!item) return null
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectSection(item.id)}
                      className="hover:text-[#C6AD7B] transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Column 3: Platform Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-[#C6AD7B]">
              Support & Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#8D9AA3] font-body">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSection('help')}
                  className="hover:text-[#C6AD7B] transition-colors text-left"
                >
                  Help & Support
                </button>
              </li>
              <li className="hover:text-[#C6AD7B] cursor-pointer transition-colors">Broadcast Guides</li>
              <li className="hover:text-[#C6AD7B] cursor-pointer transition-colors">Community Guidelines</li>
              <li className="hover:text-[#C6AD7B] cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>
        </div>

        {/* Mandatory Simulation Data Disclaimer Notice */}
        <div className="p-3.5 rounded-xl bg-[#252A2E]/60 border border-[#363C42] text-xs text-[#8D9AA3] text-center font-body">
          <p>
            <strong className="text-[#F6F5F1]">Demonstration Notice:</strong> All sports fixtures, live scores, telemetry statistics, rosters, and competition challenges on ORVIX are simulated demonstration data for platform preview purposes. No real monetary transactions, wagers, or betting features are supported.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Security Note */}
        <div className="pt-8 border-t border-[#363C42] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8D9AA3] text-center sm:text-left min-w-0 font-body">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#C6AD7B] flex-shrink-0" />
            <span className="break-words">&copy; {new Date().getFullYear()} ORVIX Global Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1.5 text-xs text-[#8D9AA3]">
            <span className="hover:text-[#F6F5F1] cursor-pointer whitespace-nowrap">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#F6F5F1] cursor-pointer whitespace-nowrap">Security Center</span>
            <span>•</span>
            <span className="hover:text-[#F6F5F1] cursor-pointer whitespace-nowrap">Cookie Settings</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
