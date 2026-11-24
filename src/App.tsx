import React, { useState } from 'react'
import { AppLayout } from './layout'
import {
  Trophy,
  Flame,
  Sparkles,
  Tv,
  Bell,
  User,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Play,
  Layers,
  Palette,
  Type,
  Layout as LayoutIcon,
  Sliders,
  Radio,
  ArrowLeft,
} from 'lucide-react'
import {
  OrvixLogo,
  OrvixBrandLockup,
} from './design-system/brand'
import {
  Button,
  IconButton,
  Input,
  SearchInput,
  Select,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Navbar,
  Tabs,
  Breadcrumbs,
  Pagination,
  Container,
  Grid,
  Section,
} from './design-system/components'
import {
  brandColors,
  surfaceColors,
  statusColors,
  typographyScale,
  spacingScale,
} from './design-system/tokens'

export default function App() {
  // Mode: 'app' (default Application Layout) or 'showcase' (Design System tokens & specs)
  const [appMode, setAppMode] = useState<'app' | 'showcase'>('app')

  // Showcase state
  const [activeNavTab, setActiveNavTab] = useState('brand')
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const [inputVal, setInputVal] = useState('Championship Final')
  const [searchVal, setSearchVal] = useState('')
  const [selectedSport, setSelectedSport] = useState('f1')
  const [tabStyle, setTabStyle] = useState<'pills' | 'underline' | 'contained'>('pills')
  const [activeCategoryTab, setActiveCategoryTab] = useState('live')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const copyToClipboard = (hex: string) => {
    navigator.clipboard?.writeText(hex)
    setCopiedHex(hex)
    setTimeout(() => setCopiedHex(null), 2000)
  }

  // If in Application Layout Mode, render the AppLayout component
  if (appMode === 'app') {
    return (
      <AppLayout
        initialSection="home"
        onSwitchToDesignShowcase={() => setAppMode('showcase')}
      />
    )
  }

  // Design System Showcase View
  return (
    <div className="min-h-screen bg-[#081329] text-[#F4F6FA] flex flex-col font-body selection:bg-[#267BFF] selection:text-white">
      {/* Top Application Showcase Bar */}
      <header className="border-b border-[#1C3364] bg-[#040A17]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAppMode('app')}
              className="p-1.5 rounded-lg bg-[#0E1C38] border border-[#1C3364] text-[#267BFF] hover:text-white flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Application Layout</span>
            </button>
            <span className="hidden sm:inline-block h-4 w-[1px] bg-[#1C3364]" />
            <OrvixBrandLockup size="sm" variant="primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D9BD83] bg-[#D9BD83]/10 px-2.5 py-1 rounded-full border border-[#D9BD83]/30 hidden md:inline-block">
              Design System Specs
            </span>
          </div>

          {/* Viewport Simulation Controls */}
          <div className="flex items-center gap-2 bg-[#0E1C38] p-1 rounded-lg border border-[#1C3364]">
            <span className="text-xs text-[#94A3B8] px-2 hidden md:inline font-medium">Viewport:</span>
            <button
              type="button"
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-medium transition-colors ${
                viewportMode === 'desktop' ? 'bg-[#267BFF] text-white shadow-sm' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-medium transition-colors ${
                viewportMode === 'tablet' ? 'bg-[#267BFF] text-white shadow-sm' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-medium transition-colors ${
                viewportMode === 'mobile' ? 'bg-[#267BFF] text-white shadow-sm' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main
        className={`flex-1 transition-all duration-300 mx-auto w-full ${
          viewportMode === 'mobile'
            ? 'max-w-[400px] border-x border-[#1C3364] my-4 shadow-2xl bg-[#081329] rounded-2xl overflow-hidden'
            : viewportMode === 'tablet'
            ? 'max-w-[800px] border-x border-[#1C3364] my-4 shadow-2xl bg-[#081329] rounded-2xl overflow-hidden'
            : 'max-w-full'
        }`}
      >
        {/* Sub-Header Design System Navigation */}
        <div className="bg-[#0E1C38]/80 border-b border-[#1C3364]/70 px-4 sm:px-6 lg:px-8 py-3 sticky top-[57px] z-40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[
                { id: 'brand', label: 'Brand & Logo' },
                { id: 'colors', label: 'Color Tokens' },
                { id: 'typography', label: 'Typography' },
                { id: 'components', label: 'Components' },
                { id: 'layout', label: 'Responsive Layout' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNavTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold font-display tracking-wide transition-all whitespace-nowrap ${
                    activeNavTab === item.id
                      ? 'bg-[#267BFF] text-white shadow-[0_0_12px_rgba(38,123,255,0.4)]'
                      : 'text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#15274D]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <Badge variant="live" size="sm">System Online</Badge>
              <Badge variant="gold" size="sm">Design Tokens</Badge>
            </div>
          </div>
        </div>

        {/* SECTION 1: BRAND IDENTITY & LOGO */}
        {activeNavTab === 'brand' && (
          <Container size="xl" className="py-8 sm:py-12 space-y-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#267BFF] mb-2 font-display">
                <Sparkles className="w-4 h-4 text-[#D9BD83]" />
                Brand Foundation
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F4F6FA] tracking-tight">
                ORVIX Brand Identity
              </h1>
              <p className="text-base text-[#94A3B8] mt-2 max-w-3xl leading-relaxed">
                ORVIX is a premier sports and entertainment platform blending high-octane athletic adrenaline with cinematic luxury.
              </p>
            </div>

            <Card variant="gold-accent" className="p-8 sm:p-12 text-center relative overflow-hidden bg-gradient-to-b from-[#0E1C38] to-[#081329]">
              <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                <OrvixBrandLockup size="xl" variant="primary" glow withTagline taglineText="PREMIER SPORTS & ENTERTAINMENT" />
              </div>
            </Card>

            <Grid cols={4} gap="md">
              <Card variant="standard" className="p-6 text-center flex flex-col items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Primary Edition</span>
                <div className="py-4">
                  <OrvixLogo size="lg" variant="primary" glow />
                </div>
                <p className="text-xs text-[#94A3B8]">Electric Blue + Gold</p>
              </Card>

              <Card variant="standard" className="p-6 text-center flex flex-col items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D9BD83]">VIP Gold Edition</span>
                <div className="py-4">
                  <OrvixLogo size="lg" variant="gold" glow />
                </div>
                <p className="text-xs text-[#94A3B8]">Champagne Gold</p>
              </Card>

              <Card variant="standard" className="p-6 text-center flex flex-col items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#267BFF]">Kinetic Blue Edition</span>
                <div className="py-4">
                  <OrvixLogo size="lg" variant="blue" glow />
                </div>
                <p className="text-xs text-[#94A3B8]">Electric Blue</p>
              </Card>

              <Card variant="standard" className="p-6 text-center flex flex-col items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F4F6FA]">Soft White Minimal</span>
                <div className="py-4">
                  <OrvixLogo size="lg" variant="monochrome" />
                </div>
                <p className="text-xs text-[#94A3B8]">Monochrome White</p>
              </Card>
            </Grid>
          </Container>
        )}

        {/* SECTION 2: COLOR PALETTE */}
        {activeNavTab === 'colors' && (
          <Container size="xl" className="py-8 sm:py-12 space-y-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#267BFF] mb-2 font-display">
                <Palette className="w-4 h-4 text-[#267BFF]" />
                Design Tokens
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F4F6FA] tracking-tight">
                Brand Color Palette
              </h1>
            </div>

            <Grid cols={4} gap="md">
              {Object.entries(brandColors).map(([key, color]) => (
                <Card
                  key={key}
                  variant="interactive"
                  onClick={() => copyToClipboard(color.hex)}
                  className="p-5 flex flex-col justify-between group"
                >
                  <div>
                    <div
                      className="w-full h-24 rounded-lg mb-4 flex items-end justify-end p-2.5 shadow-inner border border-white/10"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded shadow-sm ${
                        color.textColor === 'light' ? 'bg-black/50 text-white' : 'bg-white/80 text-black'
                      }`}>
                        {color.hex}
                      </span>
                    </div>
                    <h4 className="font-bold text-base font-display text-[#F4F6FA]">{color.name}</h4>
                    <p className="text-xs font-semibold text-[#267BFF] mt-0.5">{color.role}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1C3364] flex items-center justify-between text-xs text-[#94A3B8]">
                    <span>RGB: {color.rgb}</span>
                    <span className="flex items-center gap-1 text-[#267BFF]">
                      {copiedHex === color.hex ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedHex === color.hex ? 'Copied' : 'Copy'}
                    </span>
                  </div>
                </Card>
              ))}
            </Grid>
          </Container>
        )}

        {/* SECTION 3: TYPOGRAPHY */}
        {activeNavTab === 'typography' && (
          <Container size="xl" className="py-8 sm:py-12 space-y-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F4F6FA] tracking-tight">
                Typography Scale Hierarchy
              </h1>
            </div>
            <div className="space-y-4">
              {typographyScale.map((item, idx) => (
                <Card key={idx} variant="standard" className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1C3364]">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#267BFF] uppercase tracking-wider">{item.level}</span>
                      <h4 className="text-sm font-medium text-[#94A3B8] mt-0.5">
                        Font: {item.font} • Size: {item.size} • Weight: {item.weight}
                      </h4>
                    </div>
                    <p className="text-xs text-[#64748B] max-w-md">{item.usage}</p>
                  </div>
                  <div className="pt-4 overflow-x-auto">
                    <p className={item.className}>{item.sample}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        )}

        {/* SECTION 4: COMPONENTS */}
        {activeNavTab === 'components' && (
          <Container size="xl" className="py-8 sm:py-12 space-y-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F4F6FA] tracking-tight">
                Component Library Suite
              </h1>
            </div>

            <Section title="Buttons & Badges">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" glow>Primary Action</Button>
                <Button variant="gold" glow>Gold VIP Access</Button>
                <Button variant="secondary">Secondary Dark</Button>
                <Button variant="outline">Outline Border</Button>
                <Badge variant="live" size="md">LIVE BROADCAST</Badge>
                <Badge variant="gold" size="md">VIP TIER</Badge>
                <Badge variant="blue" size="md">4K HDR</Badge>
              </div>
            </Section>
          </Container>
        )}

        {/* SECTION 5: LAYOUT */}
        {activeNavTab === 'layout' && (
          <Container size="xl" className="py-8 sm:py-12 space-y-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F4F6FA] tracking-tight">
                Layout Grid Framework
              </h1>
            </div>
            <Card variant="standard" className="p-6">
              <div className="grid grid-cols-12 gap-3 text-center text-xs font-mono font-semibold">
                <div className="col-span-12 sm:col-span-8 p-4 rounded-lg bg-[#15274D] border border-[#267BFF]/30 text-[#F4F6FA]">
                  Main Stream (Span 8 Desktop / Span 12 Mobile)
                </div>
                <div className="col-span-12 sm:col-span-4 p-4 rounded-lg bg-[#0E1C38] border border-[#1C3364] text-[#94A3B8]">
                  Sidebar Telemetry (Span 4 Desktop / Span 12 Mobile)
                </div>
              </div>
            </Card>
          </Container>
        )}
      </main>
    </div>
  )
}
