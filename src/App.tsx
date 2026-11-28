import React, { useState, useEffect } from 'react'
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
  Activity,
  Shield,
  Star,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import {
  OrvixLogo,
  OrvixBrandLockup,
  OrvixWordmark,
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
  Divider,
} from './design-system/components'
import {
  brandColors,
  semanticColors,
  surfaceColors,
  statusColors,
  typographyScale,
  spacingScale,
} from './design-system/tokens'

export default function App() {
  // Mode: 'app' (default Application Layout) or 'showcase' (Design System tokens & specs)
  const [appMode, setAppMode] = useState<'app' | 'showcase'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase()
      const search = window.location.search.toLowerCase()
      if (hash === '#showcase' || search.includes('mode=showcase') || search.includes('showcase=true')) {
        return 'showcase'
      }
    }
    return 'app'
  })

  // Listen for hash changes so browser navigation and direct URLs work
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#showcase') {
        setAppMode('showcase')
      } else if (hash === '' || hash === '#app') {
        setAppMode('app')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleSwitchToMode = (mode: 'app' | 'showcase') => {
    setAppMode(mode)
    if (mode === 'showcase') {
      window.location.hash = 'showcase'
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  // Showcase state
  const [activeNavTab, setActiveNavTab] = useState('brand')
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const [inputVal, setInputVal] = useState('Monaco Grand Prix')
  const [searchVal, setSearchVal] = useState('')
  const [selectedSport, setSelectedSport] = useState('f1')
  const [tabStyle, setTabStyle] = useState<'pills' | 'underline' | 'contained'>('pills')
  const [activeCategoryTab, setActiveCategoryTab] = useState('live')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [textareaVal, setTextareaVal] = useState('Monaco sector 2 delta shows high-downforce mechanical grip advantage.')

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
        onSwitchToDesignShowcase={() => handleSwitchToMode('showcase')}
      />
    )
  }

  // Computed column helpers for viewport simulation
  const swatchCols = viewportMode === 'mobile' ? 1 : viewportMode === 'tablet' ? 2 : 3
  const cardCols = viewportMode === 'mobile' ? 1 : viewportMode === 'tablet' ? 2 : 3
  const inputCols = viewportMode === 'mobile' ? 1 : viewportMode === 'tablet' ? 2 : 3

  // Design System Showcase View
  return (
    <div className="min-h-screen bg-[#171B1E] text-[#F6F5F1] flex flex-col font-body selection:bg-[#C6AD7B] selection:text-[#171B1E]">
      {/* Top Application Showcase Bar */}
      <header className="border-b border-[#363C42] bg-[#171B1E]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => handleSwitchToMode('app')}
              className="p-1.5 rounded-lg bg-[#252A2E] border border-[#363C42] text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#2E343A] flex items-center gap-1.5 text-xs font-semibold transition-colors flex-shrink-0"
              title="Return to ORVIX Application"
            >
              <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden xs:inline">Back to Application</span>
              <span className="xs:hidden">Back</span>
            </button>
            <span className="hidden sm:inline-block h-4 w-[1px] bg-[#363C42]" />
            <OrvixBrandLockup size="sm" variant="primary" className="flex-shrink-0" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C6AD7B] bg-[#C6AD7B]/15 px-2.5 py-1 rounded-full border border-[#C6AD7B]/30 hidden lg:inline-block">
              R1 Final: Graphite × Champagne
            </span>
          </div>

          {/* Viewport Simulation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[#252A2E] p-1 rounded-lg border border-[#363C42] flex-shrink-0">
            <span className="text-xs text-[#8D9AA3] px-1.5 hidden md:inline font-medium">Viewport:</span>
            <button
              type="button"
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-medium transition-colors ${
                viewportMode === 'desktop' ? 'bg-[#2E343A] text-[#C6AD7B] shadow-sm' : 'text-[#8D9AA3] hover:text-[#F6F5F1]'
              }`}
              title="Desktop viewport (100% width)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-medium transition-colors ${
                viewportMode === 'tablet' ? 'bg-[#2E343A] text-[#C6AD7B] shadow-sm' : 'text-[#8D9AA3] hover:text-[#F6F5F1]'
              }`}
              title="Tablet simulation (max 800px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-medium transition-colors ${
                viewportMode === 'mobile' ? 'bg-[#2E343A] text-[#C6AD7B] shadow-sm' : 'text-[#8D9AA3] hover:text-[#F6F5F1]'
              }`}
              title="Mobile simulation (max 420px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main
        className={`flex-1 transition-all duration-300 mx-auto w-full min-w-0 ${
          viewportMode === 'mobile'
            ? 'max-w-[420px] border-x border-[#363C42] my-4 shadow-2xl bg-[#171B1E] rounded-2xl overflow-hidden'
            : viewportMode === 'tablet'
            ? 'max-w-[800px] border-x border-[#363C42] my-4 shadow-2xl bg-[#171B1E] rounded-2xl overflow-hidden'
            : 'max-w-full'
        }`}
      >
        {/* Sub-Header Design System Navigation */}
        <div className="bg-[#252A2E]/90 border-b border-[#363C42] px-3 xs:px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 sticky top-[53px] sm:top-[57px] z-40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {[
                { id: 'brand', label: 'Brand & Aesthetic' },
                { id: 'colors', label: 'Color Palette & Tokens' },
                { id: 'typography', label: 'Editorial Typography' },
                { id: 'components', label: 'Components Suite' },
                { id: 'mixed', label: 'Mixed Interface (Dark/Light)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNavTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold font-display tracking-wide transition-all whitespace-nowrap flex-shrink-0 ${
                    activeNavTab === item.id
                      ? 'bg-[#2E343A] text-[#C6AD7B] border border-[#C6AD7B]/40 shadow-sm'
                      : 'text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#2E343A]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <Badge variant="champagne" size="sm">R1 Final</Badge>
              <Badge variant="silver" size="sm">Graphite × Champagne</Badge>
            </div>
          </div>
        </div>

        {/* SECTION 1: BRAND IDENTITY & LOGO */}
        {activeNavTab === 'brand' && (
          <Container size="xl" className="py-6 sm:py-12 space-y-8 sm:space-y-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C6AD7B] mb-2 font-display">
                <Sparkles className="w-4 h-4 text-[#C6AD7B]" />
                R1 Final Brand Identity
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#F6F5F1] tracking-tight">
                Graphite × Champagne Design System
              </h1>
              <p className="text-sm sm:text-base text-[#8D9AA3] mt-2 max-w-3xl leading-relaxed">
                ORVIX unites broadcast sports precision with understated luxury. The approved hybrid architecture pairs Deep Graphite and Graphite backgrounds with restrained Champagne accents, Warm White editorial text, Soft Silver secondary surfaces, and Steel Gray structural borders.
              </p>
            </div>

            {/* Marquee Hero Lockup */}
            <Card variant="deep" className="p-6 sm:p-12 text-center relative overflow-hidden border-[#363C42]">
              <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                <OrvixBrandLockup
                  size={viewportMode === 'mobile' ? 'lg' : 'xl'}
                  layout={viewportMode === 'mobile' ? 'vertical' : 'horizontal'}
                  variant="primary"
                  withTagline
                  taglineText="PLAY. COMPETE. DISCOVER."
                />
              </div>
            </Card>

            {/* 4 Brand Logo Variants */}
            <div>
              <h3 className="text-lg font-bold font-display text-[#F6F5F1] mb-4">Core Logo Marks</h3>
              <Grid cols={cardCols as any} gap="md">
                <Card variant="standard" className="p-5 text-center flex flex-col items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C6AD7B]">Primary (Graphite + Champagne)</span>
                  <div className="py-4">
                    <OrvixLogo size="lg" variant="primary" />
                  </div>
                  <p className="text-xs text-[#8D9AA3]">Graphite Orbit with Champagne Apex & Nexus</p>
                </Card>

                <Card variant="standard" className="p-5 text-center flex flex-col items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C6AD7B]">Champagne Accent</span>
                  <div className="py-4">
                    <OrvixLogo size="lg" variant="champagne" />
                  </div>
                  <p className="text-xs text-[#8D9AA3]">Warm Metallic Champagne Orbit with Dark Core</p>
                </Card>

                <Card variant="standard" className="p-5 text-center flex flex-col items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D9DEE2]">Soft Silver Editorial</span>
                  <div className="py-4">
                    <OrvixLogo size="lg" variant="silver" />
                  </div>
                  <p className="text-xs text-[#8D9AA3]">Soft Silver on Graphite Surface</p>
                </Card>

                <Card variant="standard" className="p-5 text-center flex flex-col items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#F6F5F1]">Warm White Minimal</span>
                  <div className="py-4">
                    <OrvixLogo size="lg" variant="monochrome" />
                  </div>
                  <p className="text-xs text-[#8D9AA3]">Warm White Glare-Free Optical Contrast</p>
                </Card>
              </Grid>
            </div>

            {/* Dedicated Wordmark Suite */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-[#F6F5F1]">Editorial Wordmark Variations</h3>
              <Grid cols={viewportMode === 'mobile' ? 1 : 2} gap="md">
                <Card variant="standard" className="p-6 flex flex-col justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C6AD7B]">Primary Wordmark (Dark Canvas)</span>
                  <div className="py-3">
                    <OrvixWordmark size="md" variant="primary" withTagline taglineText="PLAY. COMPETE. DISCOVER." />
                  </div>
                  <p className="text-xs text-[#8D9AA3]">Warm White typography with Champagne terminal 'X' and selective beacon indicator.</p>
                </Card>

                <Card variant="editorialLight" className="p-6 flex flex-col justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#252A2E]">Editorial Wordmark (Light Canvas)</span>
                  <div className="py-3">
                    <OrvixWordmark size="md" variant="graphite" withTagline taglineText="PLAY. COMPETE. DISCOVER." />
                  </div>
                  <p className="text-xs text-[#252A2E]">Graphite typography with Champagne terminal 'X' on Soft Silver editorial surface.</p>
                </Card>
              </Grid>
            </div>
          </Container>
        )}

        {/* SECTION 2: COLOR PALETTE */}
        {activeNavTab === 'colors' && (
          <Container size="xl" className="py-6 sm:py-12 space-y-8 sm:space-y-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C6AD7B] mb-2 font-display">
                <Palette className="w-4 h-4 text-[#C6AD7B]" />
                Approved Hybrid Palette Tokens
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#F6F5F1] tracking-tight">
                Graphite × Champagne Color Tokens
              </h1>
              <p className="text-sm sm:text-base text-[#8D9AA3] mt-2 max-w-2xl">
                Deep Graphite: #171B1E | Graphite: #252A2E | Champagne: #C6AD7B | Soft Silver: #D9DEE2 | Warm White: #F6F5F1 | Steel Gray: #8D9AA3 | Slate: #68737D. Click any swatch to copy HEX.
              </p>
            </div>

            {/* 7 Swatches Grid */}
            <Grid cols={swatchCols as any} gap="md">
              {[
                { name: 'Deep Graphite', hex: '#171B1E', rgb: '23, 27, 30', role: 'Main Application Background (~65%)', textColor: 'light' },
                { name: 'Graphite', hex: '#252A2E', rgb: '37, 42, 46', role: 'Primary Cards, Surfaces & Secondary Actions', textColor: 'light' },
                { name: 'Champagne', hex: '#C6AD7B', rgb: '198, 173, 123', role: 'Brand Accent & Primary Action Buttons (~5%)', textColor: 'dark' },
                { name: 'Soft Silver', hex: '#D9DEE2', rgb: '217, 222, 226', role: 'Secondary Surfaces & Editorial Cards (~20%)', textColor: 'dark' },
                { name: 'Warm White', hex: '#F6F5F1', rgb: '246, 245, 241', role: 'Light Editorial Surfaces & Primary Typography (~10%)', textColor: 'dark' },
                { name: 'Steel Gray', hex: '#8D9AA3', rgb: '141, 154, 163', role: 'Subtle Borders & Secondary Accents', textColor: 'dark' },
                { name: 'Slate', hex: '#68737D', rgb: '104, 115, 125', role: 'Secondary Typography & Passive Metadata', textColor: 'light' },
              ].map((color) => (
                <Card
                  key={color.hex}
                  variant="interactive"
                  onClick={() => copyToClipboard(color.hex)}
                  className="p-4 sm:p-5 flex flex-col justify-between group"
                >
                  <div>
                    <div
                      className="w-full h-20 sm:h-24 rounded-lg mb-3 sm:mb-4 flex items-end justify-end p-2.5 shadow-inner border border-white/10"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded shadow-sm ${
                        color.textColor === 'light' ? 'bg-black/60 text-white' : 'bg-black/80 text-white'
                      }`}>
                        {color.hex}
                      </span>
                    </div>
                    <h4 className="font-bold text-base font-display text-[#F6F5F1]">{color.name}</h4>
                    <p className="text-xs font-semibold text-[#8D9AA3] mt-0.5 leading-snug">{color.role}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#363C42] flex items-center justify-between text-xs text-[#8D9AA3]">
                    <span>RGB: {color.rgb}</span>
                    <span className="flex items-center gap-1 text-[#C6AD7B]">
                      {copiedHex === color.hex ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedHex === color.hex ? 'Copied' : 'Copy'}
                    </span>
                  </div>
                </Card>
              ))}
            </Grid>

            {/* Architecture Roles & Distribution Guide */}
            <div className="p-5 rounded-2xl bg-[#252A2E] border border-[#363C42] space-y-4">
              <h3 className="text-base font-bold font-display text-[#F6F5F1]">Color Distribution Target</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#171B1E] border border-[#363C42]">
                  <span className="text-xs font-mono font-bold text-[#F6F5F1] block">~65% Base & Containers</span>
                  <span className="text-sm font-semibold text-[#F6F5F1]">Deep Graphite & Graphite</span>
                  <p className="text-xs text-[#8D9AA3] mt-1">Deep stadium canvas (#171B1E) and structured cards (#252A2E).</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#171B1E] border border-[#363C42]">
                  <span className="text-xs font-mono font-bold text-[#D9DEE2] block">~20% Secondary Surfaces</span>
                  <span className="text-sm font-semibold text-[#D9DEE2]">Soft Silver & Neutrals</span>
                  <p className="text-xs text-[#8D9AA3] mt-1">Editorial cards, subtle borders, and balanced light cards.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#171B1E] border border-[#363C42]">
                  <span className="text-xs font-mono font-bold text-[#F6F5F1] block">~10% Light Surfaces</span>
                  <span className="text-sm font-semibold text-[#F6F5F1]">Warm White Canvas</span>
                  <p className="text-xs text-[#8D9AA3] mt-1">Tactile editorial reading rooms and high-contrast typography.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#171B1E] border border-[#363C42]">
                  <span className="text-xs font-mono font-bold text-[#C6AD7B] block">~5% Brand Accent</span>
                  <span className="text-sm font-semibold text-[#C6AD7B]">Champagne Accents</span>
                  <p className="text-xs text-[#8D9AA3] mt-1">Primary action buttons, active tabs, and telemetry beacons.</p>
                </div>
              </div>
            </div>

            {/* Semantic Tokens Table */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xl font-bold font-display text-[#F6F5F1]">Semantic Tokens Architecture</h3>
              <div className="overflow-x-auto rounded-xl border border-[#363C42] bg-[#252A2E] w-full">
                <table className="w-full text-xs text-left min-w-[580px]">
                  <thead className="bg-[#171B1E] text-[#8D9AA3] uppercase font-display border-b border-[#363C42]">
                    <tr>
                      <th className="p-3.5 whitespace-nowrap">Semantic Role</th>
                      <th className="p-3.5 whitespace-nowrap">Color Name</th>
                      <th className="p-3.5 whitespace-nowrap">Hex Token</th>
                      <th className="p-3.5 whitespace-nowrap">Usage Intent & Contrast</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#363C42] text-[#F6F5F1]">
                    <tr>
                      <td className="p-3.5 font-semibold">Primary Deep Dark Canvas</td>
                      <td className="p-3.5 flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-[#171B1E] border border-[#363C42] flex-shrink-0" /> Deep Graphite</td>
                      <td className="p-3.5 font-mono text-[#C6AD7B]">#171B1E</td>
                      <td className="p-3.5 text-[#8D9AA3]">Sports Center, broadcast arena stages, primary dark canvas</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold">Strong Elements & Dark Surface</td>
                      <td className="p-3.5 flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-[#252A2E] flex-shrink-0" /> Graphite</td>
                      <td className="p-3.5 font-mono text-[#C6AD7B]">#252A2E</td>
                      <td className="p-3.5 text-[#8D9AA3]">Fixture cards, scoreboard containers, secondary buttons</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold">Primary Action Button</td>
                      <td className="p-3.5 flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-[#C6AD7B] flex-shrink-0" /> Champagne</td>
                      <td className="p-3.5 font-mono text-[#C6AD7B]">#C6AD7B</td>
                      <td className="p-3.5 text-[#8D9AA3]">Primary action with dark text (#171B1E) — 8.1:1 AAA contrast</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold">Secondary Action Button</td>
                      <td className="p-3.5 flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-[#252A2E] border border-[#363C42] flex-shrink-0" /> Graphite Surface</td>
                      <td className="p-3.5 font-mono text-[#C6AD7B]">#252A2E</td>
                      <td className="p-3.5 text-[#8D9AA3]">Secondary button with warm white text — 15.2:1 AAA contrast</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold">Primary Light Background</td>
                      <td className="p-3.5 flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-[#F6F5F1] flex-shrink-0" /> Warm White</td>
                      <td className="p-3.5 font-mono text-[#C6AD7B]">#F6F5F1</td>
                      <td className="p-3.5 text-[#8D9AA3]">Homepage canvas, editorial articles, tournament rules</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold">Secondary Light Surface</td>
                      <td className="p-3.5 flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-[#D9DEE2] border border-[#CAD0D5] flex-shrink-0" /> Soft Silver</td>
                      <td className="p-3.5 font-mono text-[#C6AD7B]">#D9DEE2</td>
                      <td className="p-3.5 text-[#8D9AA3]">Editorial cards and content modules on warm white</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold">Subtle Structural Borders</td>
                      <td className="p-3.5 flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-[#363C42] flex-shrink-0" /> Graphite Border</td>
                      <td className="p-3.5 font-mono text-[#C6AD7B]">#363C42</td>
                      <td className="p-3.5 text-[#8D9AA3]">Dividers separating scoreboards, navigation, and cards</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold">Live Broadcast Indicator</td>
                      <td className="p-3.5 flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-[#C6AD7B] flex-shrink-0" /> Champagne Pulse</td>
                      <td className="p-3.5 font-mono text-[#C6AD7B]">#C6AD7B</td>
                      <td className="p-3.5 text-[#8D9AA3]">Live match beacons, active timers, telemetry deltas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        )}

        {/* SECTION 3: TYPOGRAPHY */}
        {activeNavTab === 'typography' && (
          <Container size="xl" className="py-6 sm:py-12 space-y-8 sm:space-y-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C6AD7B] mb-2 font-display">
                <Type className="w-4 h-4 text-[#C6AD7B]" />
                Editorial Hierarchy
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#F6F5F1] tracking-tight">
                Editorial Sports Typography System
              </h1>
              <p className="text-sm sm:text-base text-[#8D9AA3] mt-2 max-w-2xl">
                Outfit display headings, Plus Jakarta Sans body copy, and JetBrains Mono precision numerals for match scoreboards and sector telemetry.
              </p>
            </div>

            <div className="space-y-4">
              {typographyScale.map((item, idx) => (
                <Card key={idx} variant="standard" className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#363C42]">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#C6AD7B] uppercase tracking-wider">{item.level}</span>
                      <h4 className="text-xs sm:text-sm font-medium text-[#8D9AA3] mt-0.5">
                        Font: {item.font} • Size: {item.size} • Weight: {item.weight}
                      </h4>
                    </div>
                    <p className="text-xs text-[#8D9AA3] max-w-md">{item.usage}</p>
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
          <Container size="xl" className="py-6 sm:py-12 space-y-8 sm:space-y-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C6AD7B] mb-2 font-display">
                <Sliders className="w-4 h-4 text-[#C6AD7B]" />
                Component Library
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#F6F5F1] tracking-tight">
                Reusable Design System Components
              </h1>
            </div>

            {/* Buttons Showcase */}
            <Section title="Buttons & Actions" subtitle="Champagne primary buttons with dark text and Graphite secondary buttons">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Button variant="primary">Champagne Primary</Button>
                <Button variant="secondary">Graphite Secondary</Button>
                <Button variant="steel">Steel Accent</Button>
                <Button variant="silver">Soft Silver Button</Button>
                <Button variant="outline">Outline Border</Button>
                <Button variant="ghost">Ghost Link</Button>
                <Button variant="primary" isLoading={btnLoading} onClick={() => {
                  setBtnLoading(true)
                  setTimeout(() => setBtnLoading(false), 2000)
                }}>
                  {btnLoading ? 'Updating' : 'Interactive Loading'}
                </Button>
                <Button variant="primary" disabled>Disabled State</Button>
                <IconButton icon={<Bell className="w-4 h-4" />} ariaLabel="Notifications" variant="secondary" />
                <IconButton icon={<Trophy className="w-4 h-4 text-[#171B1E]" />} ariaLabel="Trophies" variant="primary" glow />
              </div>
            </Section>

            {/* Badges Showcase */}
            <Section title="Badges & Status Indicators" subtitle="Categorical chips, live indicators, and telemetry tags with Champagne active states">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <Badge variant="live" size="md">LIVE BROADCAST</Badge>
                <Badge variant="champagne" size="md">CHAMPAGNE ACCENT</Badge>
                <Badge variant="graphite" size="md">CHAMPIONS LEAGUE</Badge>
                <Badge variant="silver" size="md">EDITORIAL DESK</Badge>
                <Badge variant="neutral" size="md">SIMULATED 4K</Badge>
                <Badge variant="champagne" size="sm">SAMPLE DEMO</Badge>
                <Badge variant="outline" size="sm">STANDALONE CHIP</Badge>
              </div>
            </Section>

            {/* Cards Showcase */}
            <Section title="Flexible Card System" subtitle="Understated surfaces, soft silver editorial cards, and champagne accents">
              <Grid cols={cardCols as any} gap="md">
                <Card variant="standard" className="p-4 sm:p-5 space-y-3">
                  <Badge variant="neutral" size="sm">Graphite</Badge>
                  <CardTitle>Standard Graphite Card</CardTitle>
                  <CardDescription>Default surface (#252A2E) with neutral graphite border and soft shadow.</CardDescription>
                  <div className="pt-2">
                    <Button size="sm" variant="outline">Inspect Card</Button>
                  </div>
                </Card>

                <Card variant="deep" className="p-4 sm:p-5 space-y-3">
                  <Badge variant="champagne" size="sm">Deep Graphite</Badge>
                  <CardTitle>Deep Graphite Container</CardTitle>
                  <CardDescription>Deepest dark canvas (#171B1E) for broadcast stages and scoreboards.</CardDescription>
                  <div className="pt-2">
                    <Button size="sm" variant="primary">Launch Feed</Button>
                  </div>
                </Card>

                <Card variant="champagne-accent" className="p-4 sm:p-5 space-y-3">
                  <Badge variant="champagne" size="sm">Top Accent Card</Badge>
                  <CardTitle>Champagne Edge Card</CardTitle>
                  <CardDescription>Subtle 2px top border in Champagne (#C6AD7B) indicating priority.</CardDescription>
                  <div className="pt-2">
                    <Button size="sm" variant="secondary">View Schedule</Button>
                  </div>
                </Card>

                <Card variant="editorialLight" className="p-4 sm:p-5 space-y-3">
                  <Badge variant="graphite" size="sm">Soft Silver Card</Badge>
                  <CardTitle className="text-[#171B1E]">Soft Silver Editorial</CardTitle>
                  <CardDescription className="text-[#252A2E]">Secondary surface (#D9DEE2) designed for long-form sports reading.</CardDescription>
                  <div className="pt-2">
                    <Button size="sm" variant="primary">Read Story</Button>
                  </div>
                </Card>

                <Card variant="interactive" className="p-4 sm:p-5 space-y-3">
                  <Badge variant="neutral" size="sm">Interactive</Badge>
                  <CardTitle>Kinetic Hover Card</CardTitle>
                  <CardDescription>Hover over this card to preview the subtle translation lift and champagne border transition.</CardDescription>
                  <div className="pt-2">
                    <Button size="sm" variant="outline">Tap to Trigger</Button>
                  </div>
                </Card>

                <Card variant="elevated" className="p-4 sm:p-5 space-y-3">
                  <Badge variant="steel" size="sm">Elevated</Badge>
                  <CardTitle>Elevated Graphite Surface</CardTitle>
                  <CardDescription>Richer dark layer (#2E343A) for modal dialogs and elevated telemetry popovers.</CardDescription>
                  <div className="pt-2">
                    <Button size="sm" variant="secondary">Open Modal</Button>
                  </div>
                </Card>
              </Grid>
            </Section>

            {/* Form Inputs Showcase */}
            <Section title="Inputs, Search & Dropdowns" subtitle="Graphite dark surfaces, champagne focus indicator, and clear labels">
              <Grid cols={inputCols as any} gap="md">
                <Input
                  label="Match Identifier"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  helperText="Search by match or competition name"
                />
                <Input
                  label="Competition Passcode"
                  defaultValue="INV-2026-X"
                  errorText="Simulated validation: Access code verified"
                />
                <SearchInput
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onClear={() => setSearchVal('')}
                  placeholder="Filter fixtures, teams..."
                />
                <Select
                  label="Sport Category"
                  options={[
                    { value: 'f1', label: 'Motorsport (Formula 1)' },
                    { value: 'football', label: 'Football (UCL)' },
                    { value: 'basketball', label: 'Basketball (NBA)' },
                  ]}
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Editorial Debrief Note"
                    value={textareaVal}
                    onChange={(e) => setTextareaVal(e.target.value)}
                    maxCount={200}
                    helperText="Markdown formatted tactical debrief notes"
                  />
                </div>
              </Grid>
            </Section>

            {/* Navigation & Tabs */}
            <Section title="Tabs, Breadcrumbs & Pagination" subtitle="Navigation controls with refined champagne active indicators">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8D9AA3] mb-2 block">Pills Variant (Standard)</span>
                  <Tabs
                    variant="pills"
                    items={[
                      { id: 'live', label: 'Demo Arena', count: '3' },
                      { id: 'upcoming', label: 'Upcoming Fixtures', count: '12' },
                      { id: 'results', label: 'Simulated Results' },
                    ]}
                    activeId={activeCategoryTab}
                    onChange={setActiveCategoryTab}
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8D9AA3] mb-2 block">Underline Variant (Minimal)</span>
                  <Tabs
                    variant="underline"
                    items={[
                      { id: 'live', label: 'Telemetry Overview' },
                      { id: 'upcoming', label: 'Tactical Lineups' },
                      { id: 'results', label: 'Simulated Results' },
                    ]}
                    activeId={activeCategoryTab}
                    onChange={setActiveCategoryTab}
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8D9AA3] mb-2 block">Contained Segment Variant</span>
                  <Tabs
                    variant="contained"
                    items={[
                      { id: 'live', label: 'Sector 1' },
                      { id: 'upcoming', label: 'Sector 2' },
                      { id: 'results', label: 'Sector 3' },
                    ]}
                    activeId={activeCategoryTab}
                    onChange={setActiveCategoryTab}
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8D9AA3] mb-2 block">Editorial Breadcrumbs</span>
                  <Breadcrumbs
                    items={[
                      { id: 'home', label: 'Home' },
                      { id: 'sports', label: 'Sports Center' },
                      { id: 'ucl', label: 'Champions League' },
                    ]}
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8D9AA3] mb-2 block">Tabular Pagination</span>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={8}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </Section>

            {/* Dividers */}
            <Section title="Athletic Dividers" subtitle="Clean structural dividing lines and champagne accent breaks">
              <div className="space-y-4">
                <Divider variant="border" />
                <Divider variant="champagne" label="Champagne Brand Break" />
                <Divider variant="subtle" />
              </div>
            </Section>
          </Container>
        )}

        {/* SECTION 5: MIXED INTERFACE */}
        {activeNavTab === 'mixed' && (
          <Container size="xl" className="py-6 sm:py-12 space-y-8 sm:space-y-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C6AD7B] mb-2 font-display">
                <LayoutIcon className="w-4 h-4 text-[#C6AD7B]" />
                Mixed Interface
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#F6F5F1] tracking-tight">
                Deep Graphite Sports Center + Warm White Content Sections
              </h1>
              <p className="text-sm sm:text-base text-[#8D9AA3] mt-2 max-w-2xl leading-relaxed">
                The ORVIX interface dynamically pairs deep graphite broadcast telemetry surfaces with warm white editorial journalism panels and champagne focal points.
              </p>
            </div>

            {/* Side-by-Side Architectural Comparison */}
            <div className={`grid gap-6 ${viewportMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {/* Left: Dark Sports Center Preview */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#171B1E] border border-[#363C42] space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <Badge variant="live" size="sm">DARK SPORTS CENTER</Badge>
                  <span className="text-xs font-mono text-[#C6AD7B]">#171B1E CANVAS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[#F6F5F1]">High-Octane Telemetry Arena</h3>
                <p className="text-xs text-[#8D9AA3] leading-relaxed">
                  Immersive deep graphite environment for multi-angle video simulation, live lap timing, tactical formations, and high-contrast telemetry charts.
                </p>
                <div className="p-4 rounded-xl bg-[#252A2E] border border-[#363C42] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8D9AA3] block uppercase tracking-wider font-semibold">Pole Classification</span>
                    <span className="text-sm font-bold text-[#F6F5F1] font-display">Max Verstappen (Red Bull)</span>
                  </div>
                  <span className="text-lg font-mono-stats font-bold text-[#C6AD7B]">1:10.241</span>
                </div>
                <Button variant="primary" glow fullWidth>Watch Arena Telemetry</Button>
              </div>

              {/* Right: Lighter Editorial Content Preview */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#F6F5F1] text-[#171B1E] border border-[#D9DEE2] space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <Badge variant="silver" size="sm">LIGHT EDITORIAL DESK</Badge>
                  <span className="text-xs font-mono text-[#171B1E]">#F6F5F1 CANVAS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[#171B1E]">Curated Sports Journalism</h3>
                <p className="text-xs text-[#252A2E] leading-relaxed">
                  Tactile warm white surface with deep graphite typography, designed for reading in-depth tournament analysis, player interviews, and rules.
                </p>
                <div className="p-4 rounded-xl bg-[#D9DEE2] border border-[#CAD0D5] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#68737D] block uppercase tracking-wider font-semibold">Race Briefing</span>
                    <span className="text-sm font-bold text-[#171B1E] font-display">Monaco Sector Strategy Analysis</span>
                  </div>
                  <span className="text-xs font-semibold text-[#171B1E] bg-[#171B1E]/10 px-2.5 py-1 rounded-full">Editorial Read</span>
                </div>
                <Button variant="secondary" fullWidth>Read Full Debrief</Button>
              </div>
            </div>

            {/* Seamless Mixed In-Page Experience Simulation */}
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold font-display text-[#F6F5F1]">In-Situ Mixed Interface Flow</h3>
              <p className="text-xs text-[#8D9AA3]">Preview how an active page transitions seamlessly from deep graphite broadcasting telemetry directly into warm white and soft silver editorial analysis.</p>

              <div className="rounded-2xl border border-[#363C42] overflow-hidden shadow-xl">
                {/* 1. Dark Broadcast Telemetry Strip */}
                <div className="bg-[#171B1E] p-5 sm:p-6 border-b border-[#363C42]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C6AD7B] animate-pulse" />
                      <span className="text-xs font-bold text-[#C6AD7B] uppercase tracking-wider font-display">Live Match Telemetry</span>
                    </div>
                    <span className="text-xs font-mono text-[#C6AD7B]">78' MINUTE • SIMULATED</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-base sm:text-lg font-bold font-display text-[#F6F5F1]">Real Madrid</span>
                      <span className="text-xl sm:text-2xl font-mono-stats font-bold text-[#C6AD7B] bg-[#252A2E] px-3 py-1 rounded-lg border border-[#363C42]">2 - 1</span>
                      <span className="text-base sm:text-lg font-bold font-display text-[#F6F5F1]">Manchester City</span>
                    </div>
                    <Button variant="outline" size="sm">Arena Cam View</Button>
                  </div>
                </div>

                {/* 2. Transitioning directly into Light Editorial Article Canvas */}
                <div className="bg-[#F6F5F1] p-6 sm:p-8 text-[#171B1E]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#68737D] mb-2 font-display">
                    <Badge variant="silver" size="sm">TACTICAL BREAKDOWN</Badge>
                    <span>By Sports Analysis Desk</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold font-display text-[#171B1E] mb-3">
                    High Press and Half-Space Overloads: How Madrid Neutralized the Transition
                  </h4>
                  <p className="text-sm text-[#252A2E] leading-relaxed mb-4">
                    The strategic duel between Carlo Ancelotti and Pep Guardiola unfolded along the left half-space corridor. Madrid's targeted recovery traps effectively suppressed counter-pressing sequences, yielding a 14% uplift in box penetrations.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button variant="primary" size="sm">Read Full Match Analysis</Button>
                    <span className="text-xs text-[#68737D]">5 min read • Updated 12 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        )}
      </main>
    </div>
  )
}
