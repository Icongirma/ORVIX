import React, { useState } from 'react'
import {
  Play,
  Trophy,
  Flame,
  Gamepad2,
  Award,
  Medal,
  Radio,
  Activity,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Eye,
  Sparkles,
  Volume2,
  Video,
  BarChart2,
  Zap,
  Shield,
  Info,
  Bell,
  Filter,
  Users,
  Timer,
  Check,
  Star,
  RefreshCw,
  Sliders,
  ExternalLink,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
  Tabs,
  Grid,
} from '../design-system/components'
import { type NavigationSectionId } from '../layout/navigationConfig'
import { cn } from '../design-system/utils/cn'

export interface HomePageProps {
  onSelectSection: (id: NavigationSectionId) => void
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectSection }) => {
  // State for interactive multicam feed selection in Featured Sports
  const [activeCam, setActiveCam] = useState<'director' | 'cockpit' | 'pitwall' | 'heli'>('cockpit')

  // State for upcoming fixtures filter tab
  const [fixtureSport, setFixtureSport] = useState<string>('all')

  // State for alerts toggled on upcoming fixtures
  const [alertSetFixtures, setAlertSetFixtures] = useState<Record<string, boolean>>({
    'fix-1': true,
  })

  const toggleAlert = (fixtureId: string) => {
    setAlertSetFixtures((prev) => ({
      ...prev,
      [fixtureId]: !prev[fixtureId],
    }))
  }

  // Sample sports fixtures data
  const fixturesData = [
    {
      id: 'fix-1',
      sport: 'football',
      sportLabel: 'UEFA Champions League',
      teams: 'Madrid FC vs. Bayern Munich',
      event: 'Semi-Final Leg 2 • Aggregate: 2 - 2',
      time: 'Today 20:45 CET',
      venue: 'Santiago Bernabéu • Madrid',
      badge: '4K 60FPS',
      badgeVariant: 'champagne' as const,
      status: 'PRE-MATCH READY',
    },
    {
      id: 'fix-2',
      sport: 'motorsport',
      sportLabel: 'Apex Grand Prix',
      teams: 'Monaco GP Qualifying Highlights & Analysis',
      event: 'Simulated Telemetry Debrief with Pitwall Engineers',
      time: 'Today 22:30 CET',
      venue: 'Circuit de Monaco • Monte Carlo',
      badge: 'TELEMETRY LIVE',
      badgeVariant: 'live' as const,
      status: 'LIVE STREAM',
    },
    {
      id: 'fix-3',
      sport: 'basketball',
      sportLabel: 'NBA Showcase',
      teams: 'London Thunder vs. Pacific Stars',
      event: 'Championship Series • Game 5',
      time: 'Tomorrow 02:00 CET',
      venue: 'O2 Arena • London',
      badge: 'SPATIAL AUDIO',
      badgeVariant: 'neutral' as const,
      status: 'UPCOMING',
    },
    {
      id: 'fix-4',
      sport: 'tennis',
      sportLabel: 'Grand Slam Masters',
      teams: 'Carlos Alcaraz vs. Jannik Sinner',
      event: 'Men\'s Singles Semi-Final • Best of 5 Sets',
      time: 'Thursday 15:00 CET',
      venue: 'Court Philippe-Chatrier • Paris',
      badge: 'BALL TRACKING',
      badgeVariant: 'neutral' as const,
      status: 'UPCOMING',
    },
    {
      id: 'fix-5',
      sport: 'esports',
      sportLabel: 'Apex Esports League',
      teams: 'Cyber Titans vs. Solar Phoenix',
      event: 'Grand Finals 5v5 • Best of 5 Maps',
      time: 'Saturday 18:00 CET',
      venue: 'Tokyo Cyber Arena • Japan',
      badge: '120 FPS STREAM',
      badgeVariant: 'champagne' as const,
      status: 'UPCOMING',
    },
  ]

  const filteredFixtures =
    fixtureSport === 'all'
      ? fixturesData
      : fixturesData.filter((fix) => fix.sport === fixtureSport)

  return (
    <div className="space-y-10 sm:space-y-12 lg:space-y-14 min-w-0">
      {/* =========================================================================
          SECTION 1: WELCOME & FAN LEVEL OVERVIEW
         ========================================================================= */}
      <section aria-label="Welcome Section" className="space-y-4 min-w-0">
        {/* Sample / Demo Data Platform Notice */}
        <div className="p-3 xs:p-3.5 rounded-xl bg-[#252A2E] border border-[#363C42] flex items-center justify-between gap-3 text-xs text-[#8D9AA3] min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-[#171B1E] border border-[#363C42] text-[#C6AD7B] flex-shrink-0">
              <Info className="w-4 h-4" />
            </span>
            <p className="leading-relaxed break-words text-[11px] xs:text-xs font-body">
              <strong className="text-[#F6F5F1] font-display">Demonstration &amp; Simulation Platform:</strong> All sports feeds, match fixtures, and telemetry logs displayed across ORVIX are simulated demonstration data for platform preview purposes.
            </p>
          </div>
          <Badge variant="neutral" size="sm" className="flex-shrink-0 hidden md:inline-flex">
            DEMO DATA
          </Badge>
        </div>

        {/* Hero Welcome Card */}
        <div className="p-5 xs:p-6 sm:p-7 lg:p-8 rounded-2xl bg-[#252A2E] border border-[#363C42] shadow-sport relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#C6AD7B]">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 min-w-0">
            {/* Left Column: Greeting, Mission & Action Buttons */}
            <div className="space-y-3.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="live" size="sm" pulse>
                  SIMULATION ACTIVE
                </Badge>
                <Badge variant="champagne" size="sm">
                  SEASON 3 FAN LEAGUE
                </Badge>
                <span className="text-xs text-[#68737D] hidden sm:inline">•</span>
                <span className="text-xs text-[#8D9AA3] font-mono-stats hidden sm:inline">
                  Simulated Latency: 0.28s
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#F6F5F1] tracking-tight break-words">
                Welcome back, <span className="text-[#C6AD7B]">Alex Rivera</span>
              </h1>

              <p className="text-sm sm:text-base text-[#8D9AA3] max-w-2xl leading-relaxed break-words font-body">
                Your sports media and telemetry platform is synchronized. Explore today&apos;s Apex Monaco Grand Prix multicam stream, track UEFA Champions League fixtures, join skill arenas, and inspect simulated race telemetry.
              </p>

              {/* Quick Actions Row */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                <Button
                  variant="primary"
                  glow
                  leftIcon={<Play className="w-4 h-4" />}
                  onClick={() => onSelectSection('sports')}
                >
                  Watch Apex Monaco Demo
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Gamepad2 className="w-4 h-4 text-[#C6AD7B]" />}
                  onClick={() => onSelectSection('games')}
                >
                  Skill Arenas
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<Flame className="w-4 h-4 text-[#8D9AA3]" />}
                  onClick={() => onSelectSection('challenges')}
                >
                  Weekly Quests
                </Button>
              </div>
            </div>

            {/* Right Column: User Level & XP Progress Card */}
            <div className="w-full lg:w-80 p-4 sm:p-5 rounded-xl bg-[#171B1E] border border-[#363C42] space-y-4 flex-shrink-0 min-w-0 shadow-sm">
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#2E343A] border-2 border-[#C6AD7B] flex items-center justify-center font-display font-black text-xs text-[#C6AD7B] flex-shrink-0">
                    AR
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#F6F5F1] font-display truncate">Alex Rivera</p>
                    <p className="text-[10px] text-[#C6AD7B] font-semibold uppercase tracking-wider">Fan Tier 14</p>
                  </div>
                </div>

                <Badge variant="champagne" size="sm" className="flex-shrink-0">
                  #4 GLOBAL
                </Badge>
              </div>

              {/* Virtual XP Progress Bar */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between text-xs min-w-0">
                  <span className="text-[#8D9AA3] font-medium font-body">Tier Progress</span>
                  <span className="font-mono-stats font-bold text-[#C6AD7B]">14,840 / 16,000 XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#252A2E] border border-[#363C42] overflow-hidden">
                  <div
                    className="h-full bg-[#C6AD7B] rounded-full transition-all duration-500"
                    style={{ width: '92.7%' }}
                  />
                </div>
                <p className="text-[11px] text-[#8D9AA3] leading-tight truncate font-body">
                  Next Milestone: <span className="text-[#F6F5F1] font-medium">Monaco Paddock Telemetry Suite</span>
                </p>
              </div>

              {/* Mini Stats Grid */}
              <div className="grid grid-cols-3 gap-1.5 xs:gap-2 pt-1 border-t border-[#363C42]/80 text-center min-w-0">
                <div className="p-2 rounded-lg bg-[#252A2E] border border-[#363C42]/60 min-w-0">
                  <p className="text-xs font-bold text-[#F6F5F1] font-mono-stats">28</p>
                  <p className="text-[10px] text-[#8D9AA3] truncate">Streams</p>
                </div>
                <div className="p-2 rounded-lg bg-[#252A2E] border border-[#363C42]/60 min-w-0">
                  <p className="text-xs font-bold text-[#C6AD7B] font-mono-stats">42</p>
                  <p className="text-[10px] text-[#8D9AA3] truncate">Quests</p>
                </div>
                <div className="p-2 rounded-lg bg-[#252A2E] border border-[#363C42]/60 min-w-0">
                  <p className="text-xs font-bold text-[#F6F5F1] font-mono-stats">12</p>
                  <p className="text-[10px] text-[#8D9AA3] truncate">Badges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FEATURED SPORTS (5 Sport Categories)
         ========================================================================= */}
      <section aria-label="Featured Sports Showcase" className="space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#363C42]/80 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Radio className="w-5 h-5 text-[#C6AD7B] flex-shrink-0 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F6F5F1] tracking-tight truncate">
              Featured Sports &amp; Simulated Telemetry
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="live" size="sm" pulse>
              148.4k Viewers
            </Badge>
            <Badge variant="neutral" size="sm">
              SIMULATED 4K
            </Badge>
          </div>
        </div>

        {/* 5 Distinct Sports Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 min-w-0">
          {[
            {
              id: 'motorsport',
              title: 'Motorsport',
              subtitle: 'Apex Grand Prix Series',
              badge: 'DEMO 4K',
              badgeVariant: 'champagne' as const,
              metric: 'Monaco GP • Lap 54/78',
              icon: Activity,
            },
            {
              id: 'football',
              title: 'Football',
              subtitle: 'UEFA Champions League',
              badge: 'TODAY 20:45',
              badgeVariant: 'champagne' as const,
              metric: 'Madrid FC vs. Bayern',
              icon: Trophy,
            },
            {
              id: 'basketball',
              title: 'Basketball',
              subtitle: 'NBA Showcase',
              badge: 'FINALS G5',
              badgeVariant: 'neutral' as const,
              metric: 'Thunder vs. Stars',
              icon: Flame,
            },
            {
              id: 'tennis',
              title: 'Tennis',
              subtitle: 'Grand Slam Masters',
              badge: 'SEMI-FINAL',
              badgeVariant: 'neutral' as const,
              metric: 'Alcaraz vs. Sinner',
              icon: Medal,
            },
            {
              id: 'esports',
              title: 'Esports',
              subtitle: 'Apex Esports League',
              badge: 'GRAND FINALS',
              badgeVariant: 'champagne' as const,
              metric: 'Titans vs. Phoenix',
              icon: Gamepad2,
            },
          ].map((sport) => {
            const Icon = sport.icon
            return (
              <Card
                key={sport.id}
                variant="interactive"
                onClick={() => onSelectSection('sports')}
                className="p-4 sm:p-5 flex flex-col justify-between space-y-3 min-w-0"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="p-2 rounded-lg bg-[#171B1E] border border-[#363C42] text-[#C6AD7B] flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <Badge variant={sport.badgeVariant} size="sm">
                      {sport.badge}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-bold text-base font-display text-[#F6F5F1] truncate">{sport.title}</h3>
                    <p className="text-xs text-[#8D9AA3] truncate">{sport.subtitle}</p>
                  </div>
                  <p className="text-[11px] font-mono-stats text-[#C6AD7B] pt-1 truncate">{sport.metric}</p>
                </div>

                <div className="pt-2 border-t border-[#363C42]/60 flex items-center justify-between text-xs text-[#8D9AA3]">
                  <span>Explore Stream</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C6AD7B]" />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Live Multicam Stage Showcase */}
        <Card variant="champagne-accent" className="relative overflow-hidden bg-[#252A2E] border-[#363C42] mt-4">
          <div className="p-5 sm:p-6 lg:p-7 space-y-6 min-w-0">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 min-w-0">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="live" size="sm">LAP 54 / 78</Badge>
                  <Badge variant="champagne" size="sm">MONACO GRAND PRIX</Badge>
                  <span className="text-xs text-[#8D9AA3] font-mono-stats">Monte Carlo Circuit</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F6F5F1] tracking-tight break-words">
                  Apex Championship: Grand Prix Monaco 2026
                </h3>
                <p className="text-xs sm:text-sm text-[#8D9AA3] max-w-2xl leading-relaxed break-words font-body">
                  Simulated multicam broadcast active. Synchronized cockpit onboard telemetry, sector speed deltas, and sample pitwall telemetry feeds.
                </p>
              </div>

              {/* Cam View Selection Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#171B1E] border border-[#363C42] max-w-full overflow-x-auto scrollbar-none flex-shrink-0">
                {[
                  { id: 'cockpit' as const, label: 'Cockpit Onboard', icon: Video },
                  { id: 'director' as const, label: 'Main Director', icon: Play },
                  { id: 'pitwall' as const, label: 'Pitwall Strategy', icon: Activity },
                  { id: 'heli' as const, label: 'Helicopter Cam', icon: Eye },
                ].map((cam) => {
                  const Icon = cam.icon
                  const isSelected = activeCam === cam.id
                  return (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => setActiveCam(cam.id)}
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-xs font-display font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-[#C6AD7B]',
                        isSelected
                          ? 'bg-[#C6AD7B] text-[#171B1E] font-bold shadow-sm'
                          : 'text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#2E343A]'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{cam.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Video Stage Simulation Container */}
            <div className="relative w-full aspect-video sm:aspect-[21/9] max-h-[360px] rounded-xl bg-[#171B1E] border border-[#363C42] overflow-hidden flex flex-col justify-between p-3.5 sm:p-5">
              {/* Top Video Overlay Bar */}
              <div className="flex items-center justify-between gap-2 z-10 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C6AD7B] animate-pulse flex-shrink-0" />
                  <span className="text-[11px] xs:text-xs font-bold font-display uppercase tracking-wider text-[#F6F5F1] truncate min-w-0">
                    {activeCam === 'cockpit' && 'CAR #1 (VER) • COCKPIT ONBOARD CAM'}
                    {activeCam === 'director' && 'SIMULATED WORLD BROADCAST FEED'}
                    {activeCam === 'pitwall' && 'PITWALL STRATEGY DESK • SECTOR LOGS'}
                    {activeCam === 'heli' && 'MONTE CARLO HARBOR AERIAL TRACKER'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 xs:gap-2 flex-shrink-0">
                  <Badge variant="champagne" size="sm" className="hidden sm:inline-flex">
                    SUB-SECOND 0.28s
                  </Badge>
                  <span className="text-[10px] xs:text-xs font-mono-stats text-[#C6AD7B] bg-[#252A2E] px-1.5 xs:px-2 py-0.5 rounded border border-[#363C42] whitespace-nowrap">
                    4K • 60 FPS
                  </span>
                </div>
              </div>

              {/* Center Play Button Graphic */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-[#171B1E]/80 border-2 border-[#C6AD7B] flex items-center justify-center backdrop-blur-sm shadow-sport">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-[#C6AD7B] ml-0.5 sm:ml-1" />
                </div>
              </div>

              {/* Bottom Video Telemetry Banner */}
              <div className="z-10 bg-[#252A2E]/95 backdrop-blur-md rounded-lg p-2.5 sm:p-3 border border-[#363C42] flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 text-xs min-w-0">
                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                  <div>
                    <span className="text-[10px] text-[#8D9AA3] block font-body">LEADER</span>
                    <span className="font-bold text-[#F6F5F1] font-mono-stats text-xs sm:text-sm">M. Verstappen</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8D9AA3] block font-body">INTERVAL</span>
                    <span className="font-bold text-[#C6AD7B] font-mono-stats text-xs sm:text-sm">-0.482s</span>
                  </div>
                  <div className="hidden xs:block">
                    <span className="text-[10px] text-[#8D9AA3] block font-body">SECTOR 2</span>
                    <span className="font-bold text-[#8D9AA3] font-mono-stats text-xs sm:text-sm">21.849s</span>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-[10px] text-[#8D9AA3] block font-body">TRACK TEMP</span>
                    <span className="font-bold text-[#F6F5F1] font-mono-stats text-xs sm:text-sm">38.4°C</span>
                  </div>
                </div>

                <div className="w-full xs:w-auto flex justify-end">
                  <Button
                    size="sm"
                    variant="primary"
                    glow
                    className="w-full xs:w-auto"
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                    onClick={() => onSelectSection('sports')}
                  >
                    Open Arena
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* =========================================================================
          SECTION 3: UPCOMING FIXTURES (Filterable Schedule)
         ========================================================================= */}
      <section aria-label="Upcoming Fixtures" className="space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#363C42]/80 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Calendar className="w-5 h-5 text-[#C6AD7B] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F6F5F1] tracking-tight truncate">
              Upcoming Match Fixtures &amp; Broadcasts
            </h2>
            <Badge variant="neutral" size="sm" className="hidden sm:inline-flex flex-shrink-0">
              SIMULATED
            </Badge>
          </div>

          {/* Sport Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0 max-w-full">
            {[
              { id: 'all', label: 'All Sports' },
              { id: 'football', label: 'Football' },
              { id: 'motorsport', label: 'Motorsport' },
              { id: 'basketball', label: 'Basketball' },
              { id: 'tennis', label: 'Tennis' },
              { id: 'esports', label: 'Esports' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFixtureSport(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-colors whitespace-nowrap flex-shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-[#C6AD7B]',
                  fixtureSport === tab.id
                    ? 'bg-[#C6AD7B] text-[#171B1E] font-bold shadow-sm'
                    : 'text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#252A2E]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fixtures List */}
        <div className="space-y-3 min-w-0">
          {filteredFixtures.map((fixture) => {
            const hasAlert = alertSetFixtures[fixture.id]

            return (
              <Card
                key={fixture.id}
                variant="standard"
                className="hover:border-[#C6AD7B]/50 transition-all p-4 sm:p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                  {/* Left: Sport badge, Event title, Venue */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold font-display uppercase tracking-wider text-[#C6AD7B]">
                        {fixture.sportLabel}
                      </span>
                      <span className="text-xs text-[#68737D]">•</span>
                      <span className="text-xs font-mono-stats text-[#F6F5F1] font-medium">
                        {fixture.time}
                      </span>
                      <Badge variant={fixture.badgeVariant} size="sm">
                        {fixture.badge}
                      </Badge>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1] tracking-tight break-words">
                      {fixture.teams}
                    </h4>

                    <p className="text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                      {fixture.event} — <span className="text-[#68737D]">{fixture.venue}</span>
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-shrink-0 w-full md:w-auto">
                    <Button
                      size="sm"
                      variant={hasAlert ? 'secondary' : 'outline'}
                      className="flex-1 sm:flex-none"
                      leftIcon={hasAlert ? <Check className="w-3.5 h-3.5 text-[#729B79]" /> : <Bell className="w-3.5 h-3.5" />}
                      onClick={() => toggleAlert(fixture.id)}
                    >
                      {hasAlert ? 'Alert Scheduled' : 'Notify Me'}
                    </Button>

                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 sm:flex-none"
                      onClick={() => onSelectSection('sports')}
                    >
                      Fixture Details
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="text-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectSection('sports')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Explore Complete Sports Schedule
          </Button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: LATEST SPORTS RESULTS
         ========================================================================= */}
      <section aria-label="Latest Sports Results" className="space-y-4 min-w-0">
        <div className="flex items-center justify-between pb-2 border-b border-[#363C42]/80 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Trophy className="w-5 h-5 text-[#C6AD7B] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F6F5F1] tracking-tight truncate">
              Latest Sports Results &amp; Final Classifications
            </h2>
            <Badge variant="neutral" size="sm" className="hidden sm:inline-flex flex-shrink-0">
              SIMULATED
            </Badge>
          </div>
          <button
            type="button"
            onClick={() => onSelectSection('sports')}
            className="text-xs font-semibold text-[#C6AD7B] hover:underline flex items-center gap-1 flex-shrink-0"
          >
            All Results <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Grid cols={3} gap="md">
          {/* Result Card 1 */}
          <Card variant="standard" className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold font-display text-[#C6AD7B] truncate">FORMULA 1 QUALIFYING</span>
                <Badge variant="neutral" size="sm" className="flex-shrink-0">SIMULATED</Badge>
              </div>
              <h4 className="text-base font-bold font-display text-[#F6F5F1] break-words">Monaco GP Pole Shootout</h4>
              <p className="text-xs text-[#8D9AA3] font-body">Final Q3 Classification</p>

              <div className="p-2.5 rounded-lg bg-[#171B1E] border border-[#363C42] space-y-1.5 text-xs font-mono-stats">
                <div className="flex justify-between items-center text-[#F6F5F1] gap-2 min-w-0">
                  <span className="truncate">P1 Max Verstappen</span>
                  <span className="text-[#C6AD7B] font-bold flex-shrink-0">1:10.241</span>
                </div>
                <div className="flex justify-between items-center text-[#8D9AA3] gap-2 min-w-0">
                  <span className="truncate">P2 Charles Leclerc</span>
                  <span className="flex-shrink-0">+0.084s</span>
                </div>
                <div className="flex justify-between items-center text-[#8D9AA3] gap-2 min-w-0">
                  <span className="truncate">P3 Lando Norris</span>
                  <span className="flex-shrink-0">+0.129s</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#363C42]/60 flex items-center justify-between text-xs gap-2">
              <span className="text-[#8D9AA3] truncate font-body">Pole Delta: 0.084s</span>
              <Button size="sm" variant="outline" className="flex-shrink-0" onClick={() => onSelectSection('sports')}>
                Telemetry
              </Button>
            </div>
          </Card>

          {/* Result Card 2 */}
          <Card variant="standard" className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold font-display text-[#C6AD7B] truncate">CHAMPIONS LEAGUE</span>
                <Badge variant="neutral" size="sm" className="flex-shrink-0">SIMULATED FINAL</Badge>
              </div>
              <h4 className="text-base font-bold font-display text-[#F6F5F1] break-words">Madrid FC 3 - 1 Bayern</h4>
              <p className="text-xs text-[#8D9AA3] font-body">Semi-Final Leg 1 • Final Whistle</p>

              <div className="p-2.5 rounded-lg bg-[#171B1E] border border-[#363C42] space-y-1.5 text-xs font-body">
                <div className="flex justify-between text-[#F6F5F1] gap-2">
                  <span>Ball Possession</span>
                  <span className="font-mono-stats font-bold flex-shrink-0 text-[#C6AD7B]">56% - 44%</span>
                </div>
                <div className="flex justify-between text-[#F6F5F1] gap-2">
                  <span>Total Shots (Target)</span>
                  <span className="font-mono-stats font-bold flex-shrink-0">18 (9) - 11 (4)</span>
                </div>
                <div className="flex justify-between text-[#F6F5F1] gap-2">
                  <span>Pass Accuracy</span>
                  <span className="font-mono-stats font-bold text-[#729B79] flex-shrink-0">91% - 87%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#363C42]/60 flex items-center justify-between text-xs gap-2">
              <span className="text-[#8D9AA3] truncate font-body">Goals: 34&apos;, 68&apos;, 89&apos;</span>
              <Button size="sm" variant="outline" className="flex-shrink-0" onClick={() => onSelectSection('sports')}>
                Match Recap
              </Button>
            </div>
          </Card>

          {/* Result Card 3 */}
          <Card variant="standard" className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold font-display text-[#C6AD7B] truncate">NBA SHOWCASE</span>
                <Badge variant="neutral" size="sm" className="flex-shrink-0">FINAL / OT</Badge>
              </div>
              <h4 className="text-base font-bold font-display text-[#F6F5F1] break-words">Titans 112 - 108 Stars</h4>
              <p className="text-xs text-[#8D9AA3] font-body">Game 4 Overtime Thriller</p>

              <div className="p-2.5 rounded-lg bg-[#171B1E] border border-[#363C42] space-y-1.5 text-xs font-body">
                <div className="flex justify-between text-[#F6F5F1] gap-2">
                  <span>Lead Changes</span>
                  <span className="font-mono-stats font-bold text-[#C6AD7B] flex-shrink-0">28 Changes</span>
                </div>
                <div className="flex justify-between text-[#F6F5F1] gap-2">
                  <span className="truncate">Top Scorer</span>
                  <span className="font-mono-stats font-bold flex-shrink-0">J. Tatum (38 pts)</span>
                </div>
                <div className="flex justify-between text-[#F6F5F1] gap-2">
                  <span>Fast Break Points</span>
                  <span className="font-mono-stats font-bold flex-shrink-0">24 - 18</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#363C42]/60 flex items-center justify-between text-xs gap-2">
              <span className="text-[#8D9AA3] truncate font-body">Series Tied 2 - 2</span>
              <Button size="sm" variant="outline" className="flex-shrink-0" onClick={() => onSelectSection('sports')}>
                Box Score
              </Button>
            </div>
          </Card>
        </Grid>
      </section>

      {/* =========================================================================
          SECTION 5: FEATURED SKILL-BASED GAMES
         ========================================================================= */}
      <section aria-label="Skill-Based Games" className="space-y-4 min-w-0">
        <div className="flex items-center justify-between pb-2 border-b border-[#363C42]/80 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Gamepad2 className="w-5 h-5 text-[#C6AD7B] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F6F5F1] tracking-tight truncate">
              Featured Skill-Based Arenas &amp; Esports
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSelectSection('games')}
            className="text-xs font-semibold text-[#C6AD7B] hover:underline flex items-center gap-1"
          >
            All Arenas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Grid cols={3} gap="md">
          {/* Game 1 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4 hover:border-[#C6AD7B]/50 transition-all">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="champagne" size="sm">SIM CHALLENGE</Badge>
                <span className="text-xs text-[#C6AD7B] font-mono-stats font-bold">+1,500 XP</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1]">Apex Formula Sim Hotlap</h4>
              <p className="text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                Match real telemetry braking and throttle markers across virtual Monaco. Compete for sector timing leaderboards.
              </p>
              <div className="flex items-center gap-3 text-xs text-[#8D9AA3] font-body">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#C6AD7B]" /> 1,420 Active
                </span>
                <span>•</span>
                <span>Tier: Gold+</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="primary"
              fullWidth
              leftIcon={<Play className="w-3.5 h-3.5" />}
              onClick={() => onSelectSection('games')}
            >
              Enter Sim Challenge
            </Button>
          </Card>

          {/* Game 2 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4 hover:border-[#C6AD7B]/50 transition-all">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="neutral" size="sm">TACTICAL IQ</Badge>
                <span className="text-xs text-[#C6AD7B] font-mono-stats font-bold">+800 XP</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1]">Tactical IQ Match Vision</h4>
              <p className="text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                Analyze freeze-frame football match situations in 10 seconds. Identify optimal passing routes and defensive gaps.
              </p>
              <div className="flex items-center gap-3 text-xs text-[#8D9AA3] font-body">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#8D9AA3]" /> 890 Active
                </span>
                <span>•</span>
                <span>All Fan Tiers</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              fullWidth
              leftIcon={<Zap className="w-3.5 h-3.5 text-[#C6AD7B]" />}
              onClick={() => onSelectSection('games')}
            >
              Start IQ Sprint
            </Button>
          </Card>

          {/* Game 3 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4 hover:border-[#C6AD7B]/50 transition-all">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="live" size="sm">REFLEX ARENA</Badge>
                <span className="text-xs text-[#C6AD7B] font-mono-stats font-bold">+1,000 XP</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1]">Shot Clock Buzzer Reflex</h4>
              <p className="text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                Test audio and visual reaction speed down to the millisecond against simulated basketball shot clocks.
              </p>
              <div className="flex items-center gap-3 text-xs text-[#8D9AA3] font-body">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#C6AD7B]" /> 2,140 Active
                </span>
                <span>•</span>
                <span>Sub-200ms Reaction</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              fullWidth
              leftIcon={<Timer className="w-3.5 h-3.5 text-[#C6AD7B]" />}
              onClick={() => onSelectSection('games')}
            >
              Test Reaction Speed
            </Button>
          </Card>
        </Grid>
      </section>

      {/* =========================================================================
          SECTION 6: WEEKLY CHALLENGES
         ========================================================================= */}
      <section aria-label="Weekly Challenges" className="space-y-4 min-w-0">
        <div className="flex items-center justify-between pb-2 border-b border-[#363C42]/80 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Flame className="w-5 h-5 text-[#C6AD7B] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F6F5F1] tracking-tight truncate">
              Weekly Fan Quests &amp; Knowledge Sprints
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSelectSection('challenges')}
            className="text-xs font-semibold text-[#C6AD7B] hover:underline flex items-center gap-1"
          >
            All Challenges <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Grid cols={3} gap="md">
          {/* Challenge 1 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="champagne" size="sm">ACTIVE QUEST</Badge>
                <span className="text-xs text-[#8D9AA3]">Ends in 2d</span>
              </div>
              <h4 className="text-base font-bold font-display text-[#F6F5F1]">Telemetry Analyst Quest</h4>
              <p className="text-xs text-[#8D9AA3] leading-relaxed font-body">
                Compare sector telemetry logs between the top 3 Monaco GP qualifying drivers.
              </p>

              {/* Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8D9AA3]">Progress: 2 / 3 Sectors</span>
                  <span className="text-[#C6AD7B] font-mono-stats font-bold">66%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#171B1E] border border-[#363C42] overflow-hidden">
                  <div className="h-full bg-[#C6AD7B] rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#363C42]/60 flex items-center justify-between">
              <span className="text-xs text-[#C6AD7B] font-mono-stats font-bold">+500 Fan XP</span>
              <Button size="sm" variant="primary" onClick={() => onSelectSection('challenges')}>
                Resume Quest
              </Button>
            </div>
          </Card>

          {/* Challenge 2 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="neutral" size="sm">NEAR COMPLETION</Badge>
                <span className="text-xs text-[#8D9AA3]">Ends in 4d</span>
              </div>
              <h4 className="text-base font-bold font-display text-[#F6F5F1]">Championship Tactician</h4>
              <p className="text-xs text-[#8D9AA3] leading-relaxed font-body">
                Solve 5 tactical match scenarios from recent European football matches.
              </p>

              {/* Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8D9AA3]">Progress: 4 / 5 Solved</span>
                  <span className="text-[#C6AD7B] font-mono-stats font-bold">80%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#171B1E] border border-[#363C42] overflow-hidden">
                  <div className="h-full bg-[#C6AD7B] rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#363C42]/60 flex items-center justify-between">
              <span className="text-xs text-[#C6AD7B] font-mono-stats font-bold">+750 Fan XP</span>
              <Button size="sm" variant="secondary" onClick={() => onSelectSection('challenges')}>
                Solve Final
              </Button>
            </div>
          </Card>

          {/* Challenge 3 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="neutral" size="sm">ENDURANCE</Badge>
                <span className="text-xs text-[#8D9AA3]">Ends in 5d</span>
              </div>
              <h4 className="text-base font-bold font-display text-[#F6F5F1]">Broadcast Marathon</h4>
              <p className="text-xs text-[#8D9AA3] leading-relaxed font-body">
                Stream 8 hours of live multicam sporting events with telemetry active.
              </p>

              {/* Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8D9AA3]">Progress: 6.5h / 8.0h</span>
                  <span className="text-[#C6AD7B] font-mono-stats font-bold">81%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#171B1E] border border-[#363C42] overflow-hidden">
                  <div className="h-full bg-[#C6AD7B] rounded-full" style={{ width: '81%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#363C42]/60 flex items-center justify-between">
              <span className="text-xs text-[#C6AD7B] font-mono-stats font-bold">+1,000 Fan XP</span>
              <Button size="sm" variant="outline" onClick={() => onSelectSection('sports')}>
                Stream Now
              </Button>
            </div>
          </Card>
        </Grid>
      </section>

      {/* =========================================================================
          SECTIONS 7 & 8: LEADERBOARD PREVIEW & USER ACHIEVEMENTS PREVIEW (2-Col Grid)
         ========================================================================= */}
      <section aria-label="Progression & Community Hub" className="min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 min-w-0">
          {/* SECTION 7: LEADERBOARD PREVIEW */}
          <div className="space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-[#363C42]/80 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Trophy className="w-5 h-5 text-[#C6AD7B] flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1] tracking-tight truncate">
                  Seasonal Fan Leaderboard (Top 5)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSelectSection('leaderboard')}
                className="text-xs font-semibold text-[#C6AD7B] hover:underline flex items-center gap-1"
              >
                Full Standings <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <Card variant="standard" className="overflow-hidden">
              <div className="divide-y divide-[#363C42]/80">
                {[
                  { rank: '#1', name: 'Marcus Sterling', score: '18,420 XP', tier: 'DIAMOND', icon: '👑', isUser: false },
                  { rank: '#2', name: 'Elena Rostova', score: '16,910 XP', tier: 'PLATINUM', icon: '🥈', isUser: false },
                  { rank: '#3', name: 'Kenji Takahashi', score: '15,300 XP', tier: 'GOLD', icon: '🥉', isUser: false },
                  { rank: '#4', name: 'Alex Rivera (You)', score: '14,840 XP', tier: 'DIAMOND', icon: '⚡', isUser: true },
                  { rank: '#5', name: 'Sofia Martinez', score: '14,210 XP', tier: 'GOLD', icon: '⭐', isUser: false },
                ].map((row) => (
                  <div
                    key={row.rank}
                    className={cn(
                      'p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm transition-colors min-w-0',
                      row.isUser
                        ? 'bg-[#2E343A] border-l-4 border-l-[#C6AD7B]'
                        : 'hover:bg-[#252A2E]/60'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="font-mono-stats font-bold text-sm text-[#C6AD7B] w-6 flex-shrink-0">
                        {row.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#F6F5F1] flex items-center gap-1.5 truncate font-display">
                          <span className="truncate">{row.name}</span>
                          <span className="flex-shrink-0">{row.icon}</span>
                        </p>
                        <p className="text-[10px] text-[#8D9AA3] uppercase tracking-wider">{row.tier} TIER</p>
                      </div>
                    </div>
                    <span className="font-mono-stats font-bold text-[#F6F5F1] flex-shrink-0 pl-2">
                      {row.score}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#171B1E] border-t border-[#363C42] flex items-center justify-between text-xs text-[#8D9AA3] font-body">
                <span>Season 3 ends in 18 days</span>
                <span className="text-[#C6AD7B] font-medium">+1,450 XP earned this week</span>
              </div>
            </Card>
          </div>

          {/* SECTION 8: USER ACHIEVEMENT PREVIEW */}
          <div className="space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-[#363C42]/80 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Medal className="w-5 h-5 text-[#C6AD7B] flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1] tracking-tight truncate">
                  Your Badges &amp; Trophies (12 / 24)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSelectSection('achievements')}
                className="text-xs font-semibold text-[#C6AD7B] hover:underline flex items-center gap-1"
              >
                All Badges <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              {/* Badge 1 (Unlocked) */}
              <Card variant="standard" className="p-3.5 space-y-2 border-[#C6AD7B]/40 bg-[#252A2E]">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#171B1E] border border-[#C6AD7B]/30 text-[#C6AD7B]">
                    <Award className="w-5 h-5" />
                  </div>
                  <Badge variant="champagne" size="sm">UNLOCKED</Badge>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#F6F5F1] font-display truncate">Monaco GP Pioneer</h4>
                  <p className="text-[11px] sm:text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                    Watched 10 live Formula 1 broadcasts with telemetry.
                  </p>
                </div>
                <span className="text-[10px] text-[#C6AD7B] font-mono-stats block">Earned Yesterday</span>
              </Card>

              {/* Badge 2 (Unlocked) */}
              <Card variant="standard" className="p-3.5 space-y-2 border-[#C6AD7B]/40 bg-[#252A2E]">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#171B1E] border border-[#C6AD7B]/30 text-[#C6AD7B]">
                    <Video className="w-5 h-5" />
                  </div>
                  <Badge variant="champagne" size="sm">UNLOCKED</Badge>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#F6F5F1] font-display truncate">Multicam Director</h4>
                  <p className="text-[11px] sm:text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                    Switched between 4 synchronized camera feeds.
                  </p>
                </div>
                <span className="text-[10px] text-[#C6AD7B] font-mono-stats block">Earned 3d ago</span>
              </Card>

              {/* Badge 3 (In Progress) */}
              <Card variant="standard" className="p-3.5 space-y-2 bg-[#252A2E]">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#171B1E] border border-[#363C42] text-[#8D9AA3]">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">16 / 20</Badge>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#F6F5F1] font-display truncate">Telemetry Savant</h4>
                  <p className="text-[11px] sm:text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                    Analyze 20 qualifying sectors during live weekends.
                  </p>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#171B1E] overflow-hidden">
                  <div className="h-full bg-[#C6AD7B] rounded-full" style={{ width: '80%' }} />
                </div>
              </Card>

              {/* Badge 4 (In Progress) */}
              <Card variant="standard" className="p-3.5 space-y-2 bg-[#252A2E]">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#171B1E] border border-[#363C42] text-[#8D9AA3]">
                    <Timer className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">5 / 10</Badge>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#F6F5F1] font-display truncate">Buzzer Beater Reflex</h4>
                  <p className="text-[11px] sm:text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                    Score 10 consecutive sub-200ms reaction times.
                  </p>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#171B1E] overflow-hidden">
                  <div className="h-full bg-[#8D9AA3] rounded-full" style={{ width: '50%' }} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: ANNOUNCEMENTS & PLATFORM NOTICES
         ========================================================================= */}
      <section aria-label="Announcements & Platform News" className="space-y-4 min-w-0">
        <div className="flex items-center justify-between pb-2 border-b border-[#363C42]/80 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Info className="w-5 h-5 text-[#C6AD7B] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F6F5F1] tracking-tight truncate">
              Platform Announcements &amp; Broadcast Updates
            </h2>
          </div>
          <Badge variant="neutral" size="sm">
            ENGINE V2.4
          </Badge>
        </div>

        <Grid cols={3} gap="md">
          {/* Announcement 1 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="champagne" size="sm">BROADCAST TECH</Badge>
                <span className="text-xs text-[#8D9AA3]">2h ago</span>
              </div>
              <h4 className="text-base font-bold font-display text-[#F6F5F1]">Stream Engine v2.4 Launched</h4>
              <p className="text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                Sub-second 4K multicam latency pipeline is now active for all motorsport and football feeds, featuring spatial 5.1 channel acoustic isolation.
              </p>
            </div>

            <div className="pt-2 border-t border-[#363C42]/60 flex items-center justify-between text-xs">
              <span className="text-[#C6AD7B] font-medium font-body">Technical Specs Active</span>
            </div>
          </Card>

          {/* Announcement 2 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="neutral" size="sm">COMMUNITY CUP</Badge>
                <span className="text-xs text-[#8D9AA3]">1d ago</span>
              </div>
              <h4 className="text-base font-bold font-display text-[#F6F5F1]">Apex Sim Cup 2026 Open</h4>
              <p className="text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                Registrations are open for the annual community sim racing championship. 64 team slots available across 4 global regional brackets.
              </p>
            </div>

            <div className="pt-2 border-t border-[#363C42]/60 flex items-center justify-between text-xs">
              <span className="text-[#C6AD7B] font-medium font-body">Registration Info Available</span>
            </div>
          </Card>

          {/* Announcement 3 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="champagne" size="sm">FEATURE UPDATE</Badge>
                <span className="text-xs text-[#8D9AA3]">3d ago</span>
              </div>
              <h4 className="text-base font-bold font-display text-[#F6F5F1]">Live Tire Heatmap Telemetry</h4>
              <p className="text-xs text-[#8D9AA3] leading-relaxed break-words font-body">
                Direct tire carcass and surface temperature overlays are now accessible in the cockpit cam telemetry pane for all Grand Prix events.
              </p>
            </div>

            <div className="pt-2 border-t border-[#363C42]/60 flex items-center justify-between text-xs">
              <span className="text-[#C6AD7B] font-medium font-body">Feature Demo Active</span>
            </div>
          </Card>
        </Grid>
      </section>
    </div>
  )
}
