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

  // Fixtures data
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
      badgeVariant: 'blue' as const,
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
      badgeVariant: 'gold' as const,
      status: 'UPCOMING',
    },
    {
      id: 'fix-4',
      sport: 'motorsport',
      sportLabel: 'Apex Formula',
      teams: 'Silverstone Grand Prix Practice 1',
      event: 'Multi-cam Cockpit Feeds & Live Sector Timing',
      time: 'Friday 13:30 CET',
      venue: 'Silverstone Circuit • UK',
      badge: '4 CAM FEEDS',
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
      venue: 'Tokyo Dome Cyber Stage • Japan',
      badge: '120 FPS STREAM',
      badgeVariant: 'blue' as const,
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
        <div className="p-3 xs:p-3.5 rounded-xl bg-[#0E1C38]/90 border border-[#1C3364] flex items-center justify-between gap-3 text-xs text-[#94A3B8] min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-[#081329] border border-[#1C3364] text-[#D9BD83] flex-shrink-0">
              <Info className="w-4 h-4" />
            </span>
            <p className="leading-relaxed break-words text-[11px] xs:text-xs">
              <strong className="text-[#F4F6FA] font-display">Demonstration &amp; Simulation Mode:</strong> All sports feeds, match fixtures, and telemetry logs displayed across ORVIX are simulated demonstration data pending live provider integration.
            </p>
          </div>
          <Badge variant="neutral" size="sm" className="flex-shrink-0 hidden md:inline-flex">
            DEMO DATA
          </Badge>
        </div>

        <div className="p-4 xs:p-5 sm:p-7 lg:p-8 rounded-2xl bg-gradient-to-br from-[#0E1C38] via-[#081329] to-[#040A17] border border-[#1C3364] shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#267BFF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-[#D9BD83]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 min-w-0">
            {/* Left Column: Greeting & Summary */}
            <div className="space-y-3 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="live" size="sm" pulse>
                  SIMULATION ACTIVE
                </Badge>
                <Badge variant="gold" size="sm">
                  SEASON 3
                </Badge>
                <span className="text-xs text-[#64748B] hidden sm:inline">•</span>
                <span className="text-xs text-[#94A3B8] font-mono-stats hidden sm:inline">
                  Simulated Latency: 0.28s
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#F4F6FA] tracking-tight break-words">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F4F6FA] to-[#D9BD83]">Alex Rivera</span>
              </h1>

              <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed break-words">
                Your high-bitrate multicam broadcast hub is synchronized. Track today&apos;s Apex Monaco Grand Prix, join real-time community skill arenas, and inspect simulated race telemetry.
              </p>

              {/* Quick Actions Row */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                <Button
                  variant="primary"
                  glow
                  leftIcon={<Play className="w-4 h-4" />}
                  onClick={() => onSelectSection('sports')}
                >
                  Watch Apex Monaco Live
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Gamepad2 className="w-4 h-4 text-[#267BFF]" />}
                  onClick={() => onSelectSection('games')}
                >
                  Skill Arenas
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<Flame className="w-4 h-4 text-[#D9BD83]" />}
                  onClick={() => onSelectSection('challenges')}
                >
                  Weekly Quests
                </Button>
              </div>
            </div>

            {/* Right Column: User Level & XP Progress Card */}
            <div className="w-full lg:w-80 p-3.5 xs:p-4 sm:p-5 rounded-xl bg-[#081329]/90 border border-[#1C3364] space-y-3.5 xs:space-y-4 flex-shrink-0 min-w-0">
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#267BFF] to-[#D9BD83] p-[1.5px] flex-shrink-0">
                    <div className="w-full h-full rounded-[6px] bg-[#081329] flex items-center justify-center font-display font-black text-xs text-white">
                      AR
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#F4F6FA] font-display truncate">Alex Rivera</p>
                    <p className="text-[10px] text-[#267BFF] font-semibold uppercase tracking-wider">Fan Tier 14</p>
                  </div>
                </div>

                <Badge variant="blue" size="sm" className="flex-shrink-0">
                  #4 GLOBAL
                </Badge>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between text-xs min-w-0">
                  <span className="text-[#94A3B8] font-medium">Fan Progress to L15</span>
                  <span className="font-mono-stats font-bold text-[#00E599]">14,840 / 16,000 XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0E1C38] border border-[#1C3364] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#267BFF] to-[#00E599] rounded-full transition-all duration-500"
                    style={{ width: '92.7%' }}
                  />
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-tight truncate">
                  Next Unlock: <span className="text-[#D9BD83] font-medium">Monaco Paddock Director Suite</span>
                </p>
              </div>

              {/* Mini Stats Grid */}
              <div className="grid grid-cols-3 gap-1.5 xs:gap-2 pt-1 border-t border-[#1C3364]/70 text-center min-w-0">
                <div className="p-1.5 rounded-lg bg-[#0E1C38]/60 min-w-0">
                  <p className="text-xs font-bold text-[#F4F6FA] font-mono-stats">28</p>
                  <p className="text-[10px] text-[#94A3B8] truncate">Streams</p>
                </div>
                <div className="p-1.5 rounded-lg bg-[#0E1C38]/60 min-w-0">
                  <p className="text-xs font-bold text-[#D9BD83] font-mono-stats">42</p>
                  <p className="text-[10px] text-[#94A3B8] truncate">Quests</p>
                </div>
                <div className="p-1.5 rounded-lg bg-[#0E1C38]/60 min-w-0">
                  <p className="text-xs font-bold text-[#267BFF] font-mono-stats">12</p>
                  <p className="text-[10px] text-[#94A3B8] truncate">Badges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FEATURED SPORTS INFORMATION (Live Broadcast Showcase)
         ========================================================================= */}
      <section aria-label="Featured Sports Showcase" className="space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#1C3364]/70 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Radio className="w-5 h-5 text-[#FF3B56] flex-shrink-0 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F4F6FA] tracking-tight truncate">
              Featured Live Broadcast &amp; Telemetry
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="live" size="sm" pulse>
              148.4k Viewers
            </Badge>
            <Badge variant="blue" size="sm">
              4K 60FPS HDR
            </Badge>
          </div>
        </div>

        <Card variant="blue-accent" glow className="relative overflow-hidden bg-[#0A1428] border-[#1C3364]">
          {/* Main Showcase Layout */}
          <div className="p-5 sm:p-6 lg:p-7 space-y-6 min-w-0">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 min-w-0">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="live" size="sm">LAP 54 / 78</Badge>
                  <Badge variant="gold" size="sm">MONACO GRAND PRIX</Badge>
                  <span className="text-xs text-[#94A3B8] font-mono-stats">Monte Carlo Circuit</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight break-words">
                  Apex Championship: Grand Prix Monaco 2026
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed break-words">
                  Ultra-low latency multicam broadcast active. Synchronized cockpit onboard telemetry, sector speed deltas, and live pitwall audio channels.
                </p>
              </div>

              {/* Cam View Selection Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#040A17] border border-[#1C3364] max-w-full overflow-x-auto scrollbar-none flex-shrink-0">
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
                        'px-2.5 py-1.5 rounded-lg text-xs font-display font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0',
                        isSelected
                          ? 'bg-[#267BFF] text-white shadow-[0_0_10px_rgba(38,123,255,0.4)]'
                          : 'text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38]'
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
            <div className="relative w-full aspect-video sm:aspect-[21/9] max-h-[380px] rounded-xl bg-[#040A17] border border-[#1C3364] overflow-hidden flex flex-col justify-between p-3.5 sm:p-5">
              {/* Top Video Overlay Bar */}
              <div className="flex items-center justify-between gap-2 z-10 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B56] animate-pulse flex-shrink-0" />
                  <span className="text-[11px] xs:text-xs font-bold font-display uppercase tracking-wider text-white truncate min-w-0">
                    {activeCam === 'cockpit' && 'CAR #1 (VER) • COCKPIT ONBOARD CAM'}
                    {activeCam === 'director' && 'SIMULATED WORLD BROADCAST FEED'}
                    {activeCam === 'pitwall' && 'PITWALL STRATEGY DESK • SECTOR LOGS'}
                    {activeCam === 'heli' && 'CASINO SQUARE AERIAL TRACKER'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 xs:gap-2 flex-shrink-0">
                  <Badge variant="success" size="sm" className="hidden sm:inline-flex">
                    SUB-SECOND 0.28s
                  </Badge>
                  <span className="text-[10px] xs:text-xs font-mono-stats text-[#D9BD83] bg-[#0E1C38] px-1.5 xs:px-2 py-0.5 rounded border border-[#1C3364] whitespace-nowrap">
                    4K • 60 FPS
                  </span>
                </div>
              </div>

              {/* Center Play Button Graphic */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#267BFF]/20 border border-[#267BFF]/60 flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(38,123,255,0.4)]">
                  <Play className="w-6 h-6 sm:w-9 sm:h-9 text-white ml-0.5 sm:ml-1" />
                </div>
              </div>

              {/* Bottom Video Telemetry Banner */}
              <div className="z-10 bg-[#081329]/90 backdrop-blur-md rounded-lg p-2.5 sm:p-3 border border-[#1C3364]/80 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 text-xs min-w-0">
                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">LEADER</span>
                    <span className="font-bold text-white font-mono-stats text-xs sm:text-sm">M. Verstappen</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">INTERVAL</span>
                    <span className="font-bold text-[#00E599] font-mono-stats text-xs sm:text-sm">-0.482s</span>
                  </div>
                  <div className="hidden xs:block">
                    <span className="text-[10px] text-[#94A3B8] block">SECTOR 2</span>
                    <span className="font-bold text-[#D9BD83] font-mono-stats text-xs sm:text-sm">21.849s</span>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-[10px] text-[#94A3B8] block">TRACK TEMP</span>
                    <span className="font-bold text-[#F4F6FA] font-mono-stats text-xs sm:text-sm">38.4°C</span>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1C3364]/70 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Calendar className="w-5 h-5 text-[#267BFF] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F4F6FA] tracking-tight truncate">
              Upcoming Match Fixtures &amp; Broadcasts
            </h2>
            <Badge variant="neutral" size="sm" className="hidden sm:inline-flex flex-shrink-0">
              SAMPLE DATA
            </Badge>
          </div>

          {/* Sport Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0 max-w-full">
            {[
              { id: 'all', label: 'All Sports' },
              { id: 'football', label: 'Football' },
              { id: 'motorsport', label: 'Motorsport' },
              { id: 'basketball', label: 'Basketball' },
              { id: 'esports', label: 'Esports' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFixtureSport(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-colors whitespace-nowrap flex-shrink-0',
                  fixtureSport === tab.id
                    ? 'bg-[#267BFF] text-white font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F4F6FA] hover:bg-[#0E1C38]'
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
                className="hover:border-[#267BFF]/60 transition-all p-4 sm:p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                  {/* Left: Sport badge, Event title, Venue */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold font-display uppercase tracking-wider text-[#D9BD83]">
                        {fixture.sportLabel}
                      </span>
                      <span className="text-xs text-[#64748B]">•</span>
                      <span className="text-xs font-mono-stats text-[#267BFF] font-medium">
                        {fixture.time}
                      </span>
                      <Badge variant={fixture.badgeVariant} size="sm">
                        {fixture.badge}
                      </Badge>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold font-display text-white tracking-tight break-words">
                      {fixture.teams}
                    </h4>

                    <p className="text-xs text-[#94A3B8] leading-relaxed break-words">
                      {fixture.event} — <span className="text-[#64748B]">{fixture.venue}</span>
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-shrink-0 w-full md:w-auto">
                    <Button
                      size="sm"
                      variant={hasAlert ? 'secondary' : 'outline'}
                      className="flex-1 sm:flex-none"
                      leftIcon={hasAlert ? <Check className="w-3.5 h-3.5 text-[#00E599]" /> : <Bell className="w-3.5 h-3.5" />}
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
      </section>

      {/* =========================================================================
          SECTION 4: LATEST SPORTS RESULTS
         ========================================================================= */}
      <section aria-label="Latest Sports Results" className="space-y-4 min-w-0">
        <div className="flex items-center justify-between pb-2 border-b border-[#1C3364]/70 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Trophy className="w-5 h-5 text-[#D9BD83] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F4F6FA] tracking-tight truncate">
              Latest Sports Results &amp; Final Classifications
            </h2>
            <Badge variant="neutral" size="sm" className="hidden sm:inline-flex flex-shrink-0">
              SIMULATED
            </Badge>
          </div>
          <button
            type="button"
            onClick={() => onSelectSection('sports')}
            className="text-xs font-semibold text-[#267BFF] hover:underline flex items-center gap-1 flex-shrink-0"
          >
            All Results <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Grid cols={3} gap="md">
          {/* Result Card 1 */}
          <Card variant="standard" className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold font-display text-[#267BFF] truncate">FORMULA 1 QUALIFYING</span>
                <Badge variant="neutral" size="sm" className="flex-shrink-0">SIMULATED</Badge>
              </div>
              <h4 className="text-base font-bold font-display text-white break-words">Monaco GP Pole Shootout</h4>
              <p className="text-xs text-[#94A3B8]">Final Q3 Classification</p>

              <div className="p-2.5 rounded-lg bg-[#040A17] border border-[#1C3364] space-y-1.5 text-xs font-mono-stats">
                <div className="flex justify-between items-center text-white gap-2 min-w-0">
                  <span className="truncate">P1 Max Verstappen</span>
                  <span className="text-[#00E599] font-bold flex-shrink-0">1:10.241</span>
                </div>
                <div className="flex justify-between items-center text-[#94A3B8] gap-2 min-w-0">
                  <span className="truncate">P2 Charles Leclerc</span>
                  <span className="flex-shrink-0">+0.084s</span>
                </div>
                <div className="flex justify-between items-center text-[#94A3B8] gap-2 min-w-0">
                  <span className="truncate">P3 Lando Norris</span>
                  <span className="flex-shrink-0">+0.129s</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C3364]/60 flex items-center justify-between text-xs gap-2">
              <span className="text-[#94A3B8] truncate">Pole Delta: 0.084s</span>
              <Button size="sm" variant="outline" className="flex-shrink-0" onClick={() => onSelectSection('sports')}>
                Telemetry
              </Button>
            </div>
          </Card>

          {/* Result Card 2 */}
          <Card variant="standard" className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold font-display text-[#D9BD83] truncate">CHAMPIONS LEAGUE</span>
                <Badge variant="neutral" size="sm" className="flex-shrink-0">SIMULATED FINAL</Badge>
              </div>
              <h4 className="text-base font-bold font-display text-white break-words">Madrid FC 3 - 1 Bayern</h4>
              <p className="text-xs text-[#94A3B8]">Semi-Final Leg 1 • Final Whistle</p>

              <div className="p-2.5 rounded-lg bg-[#040A17] border border-[#1C3364] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#F4F6FA] gap-2">
                  <span>Ball Possession</span>
                  <span className="font-mono-stats font-bold flex-shrink-0">56% - 44%</span>
                </div>
                <div className="flex justify-between text-[#F4F6FA] gap-2">
                  <span>Total Shots (Target)</span>
                  <span className="font-mono-stats font-bold flex-shrink-0">18 (9) - 11 (4)</span>
                </div>
                <div className="flex justify-between text-[#F4F6FA] gap-2">
                  <span>Pass Accuracy</span>
                  <span className="font-mono-stats font-bold text-[#00E599] flex-shrink-0">91% - 87%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C3364]/60 flex items-center justify-between text-xs gap-2">
              <span className="text-[#94A3B8] truncate">Goals: 34&apos;, 68&apos;, 89&apos;</span>
              <Button size="sm" variant="outline" className="flex-shrink-0" onClick={() => onSelectSection('sports')}>
                Match Recap
              </Button>
            </div>
          </Card>

          {/* Result Card 3 */}
          <Card variant="standard" className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold font-display text-[#267BFF] truncate">NBA SHOWCASE</span>
                <Badge variant="neutral" size="sm" className="flex-shrink-0">FINAL / OT</Badge>
              </div>
              <h4 className="text-base font-bold font-display text-white break-words">Titans 112 - 108 Stars</h4>
              <p className="text-xs text-[#94A3B8]">Game 4 Overtime Thriller</p>

              <div className="p-2.5 rounded-lg bg-[#040A17] border border-[#1C3364] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#F4F6FA] gap-2">
                  <span>Lead Changes</span>
                  <span className="font-mono-stats font-bold text-[#D9BD83] flex-shrink-0">28 Changes</span>
                </div>
                <div className="flex justify-between text-[#F4F6FA] gap-2">
                  <span className="truncate">Top Scorer</span>
                  <span className="font-mono-stats font-bold flex-shrink-0">J. Tatum (38 pts)</span>
                </div>
                <div className="flex justify-between text-[#F4F6FA] gap-2">
                  <span>Fast Break Points</span>
                  <span className="font-mono-stats font-bold flex-shrink-0">24 - 18</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C3364]/60 flex items-center justify-between text-xs gap-2">
              <span className="text-[#94A3B8] truncate">Series Tied 2 - 2</span>
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
        <div className="flex items-center justify-between pb-2 border-b border-[#1C3364]/70 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Gamepad2 className="w-5 h-5 text-[#267BFF] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F4F6FA] tracking-tight truncate">
              Featured Skill-Based Arenas &amp; Esports
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSelectSection('games')}
            className="text-xs font-semibold text-[#267BFF] hover:underline flex items-center gap-1"
          >
            All Arenas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Grid cols={3} gap="md">
          {/* Game 1 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4 hover:border-[#267BFF]/50 transition-all">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="blue" size="sm">SIM CHALLENGE</Badge>
                <span className="text-xs text-[#00E599] font-mono-stats font-bold">+1,500 XP</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-display text-white">Apex Formula Sim Hotlap</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed break-words">
                Match real telemetry braking and throttle markers across virtual Monaco. Compete for sector timing leaderboards.
              </p>
              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#267BFF]" /> 1,420 Active
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
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4 hover:border-[#267BFF]/50 transition-all">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="gold" size="sm">TACTICAL IQ</Badge>
                <span className="text-xs text-[#00E599] font-mono-stats font-bold">+800 XP</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-display text-white">Tactical IQ Match Vision</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed break-words">
                Analyze freeze-frame soccer match situations in 10 seconds. Identify optimal passing routes and defensive gaps.
              </p>
              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#D9BD83]" /> 890 Active
                </span>
                <span>•</span>
                <span>All Fan Tiers</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              fullWidth
              leftIcon={<Zap className="w-3.5 h-3.5 text-[#D9BD83]" />}
              onClick={() => onSelectSection('games')}
            >
              Start IQ Sprint
            </Button>
          </Card>

          {/* Game 3 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4 hover:border-[#267BFF]/50 transition-all">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="live" size="sm">REFLEX ARENA</Badge>
                <span className="text-xs text-[#00E599] font-mono-stats font-bold">+1,000 XP</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-display text-white">Shot Clock Buzzer Reflex</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed break-words">
                Test audio and visual reaction speed down to the millisecond against simulated basketball shot clocks.
              </p>
              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#FF3B56]" /> 2,140 Active
                </span>
                <span>•</span>
                <span>Microsecond Speed</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              fullWidth
              leftIcon={<Timer className="w-3.5 h-3.5 text-[#267BFF]" />}
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
        <div className="flex items-center justify-between pb-2 border-b border-[#1C3364]/70 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Flame className="w-5 h-5 text-[#FF3B56] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F4F6FA] tracking-tight truncate">
              Weekly Fan Quests &amp; Knowledge Sprints
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSelectSection('challenges')}
            className="text-xs font-semibold text-[#267BFF] hover:underline flex items-center gap-1"
          >
            All Challenges <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Grid cols={3} gap="md">
          {/* Challenge 1 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="blue" size="sm">ACTIVE QUEST</Badge>
                <span className="text-xs text-[#94A3B8]">Ends in 2d</span>
              </div>
              <h4 className="text-base font-bold font-display text-white">Telemetry Analyst Quest</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Compare sector telemetry logs between the top 3 Monaco GP qualifying drivers.
              </p>

              {/* Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Progress: 2 / 3 Sectors</span>
                  <span className="text-[#267BFF] font-mono-stats font-bold">66%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#040A17] border border-[#1C3364] overflow-hidden">
                  <div className="h-full bg-[#267BFF] rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C3364]/60 flex items-center justify-between">
              <span className="text-xs text-[#00E599] font-mono-stats font-bold">+500 Fan XP</span>
              <Button size="sm" variant="primary" onClick={() => onSelectSection('challenges')}>
                Resume Quest
              </Button>
            </div>
          </Card>

          {/* Challenge 2 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="gold" size="sm">NEAR COMPLETION</Badge>
                <span className="text-xs text-[#94A3B8]">Ends in 4d</span>
              </div>
              <h4 className="text-base font-bold font-display text-white">Championship Tactician</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Solve 5 tactical match scenarios from recent European football matches.
              </p>

              {/* Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Progress: 4 / 5 Solved</span>
                  <span className="text-[#00E599] font-mono-stats font-bold">80%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#040A17] border border-[#1C3364] overflow-hidden">
                  <div className="h-full bg-[#00E599] rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C3364]/60 flex items-center justify-between">
              <span className="text-xs text-[#00E599] font-mono-stats font-bold">+750 Fan XP</span>
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
                <span className="text-xs text-[#94A3B8]">Ends in 5d</span>
              </div>
              <h4 className="text-base font-bold font-display text-white">Broadcast Marathon</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Stream 8 hours of live multicam sporting events with telemetry active.
              </p>

              {/* Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Progress: 6.5h / 8.0h</span>
                  <span className="text-[#D9BD83] font-mono-stats font-bold">81%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#040A17] border border-[#1C3364] overflow-hidden">
                  <div className="h-full bg-[#D9BD83] rounded-full" style={{ width: '81%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C3364]/60 flex items-center justify-between">
              <span className="text-xs text-[#00E599] font-mono-stats font-bold">+1,000 Fan XP</span>
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
            <div className="flex items-center justify-between pb-2 border-b border-[#1C3364]/70 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Trophy className="w-5 h-5 text-[#D9BD83] flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold font-display text-[#F4F6FA] tracking-tight truncate">
                  Seasonal Fan Leaderboard (Top 5)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSelectSection('leaderboard')}
                className="text-xs font-semibold text-[#267BFF] hover:underline flex items-center gap-1"
              >
                Full Standings <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <Card variant="standard" className="overflow-hidden">
              <div className="divide-y divide-[#1C3364]/70">
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
                        ? 'bg-[#15274D]/90 border-l-4 border-l-[#267BFF]'
                        : 'hover:bg-[#0E1C38]/50'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="font-mono-stats font-bold text-sm text-[#D9BD83] w-6 flex-shrink-0">
                        {row.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white flex items-center gap-1.5 truncate">
                          <span className="truncate">{row.name}</span>
                          <span className="flex-shrink-0">{row.icon}</span>
                        </p>
                        <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">{row.tier} TIER</p>
                      </div>
                    </div>
                    <span className="font-mono-stats font-bold text-[#00E599] flex-shrink-0 pl-2">
                      {row.score}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#040A17] border-t border-[#1C3364] flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Season 3 ends in 18 days</span>
                <span className="text-[#267BFF] font-medium">+1,450 XP earned this week</span>
              </div>
            </Card>
          </div>

          {/* SECTION 8: USER ACHIEVEMENT PREVIEW */}
          <div className="space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-[#1C3364]/70 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Medal className="w-5 h-5 text-[#267BFF] flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold font-display text-[#F4F6FA] tracking-tight truncate">
                  Your Badges &amp; Trophies (12 / 24)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSelectSection('achievements')}
                className="text-xs font-semibold text-[#267BFF] hover:underline flex items-center gap-1"
              >
                All Badges <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              {/* Badge 1 (Unlocked) */}
              <Card variant="standard" className="p-3.5 space-y-2 border-[#D9BD83]/40 bg-[#0E1C38]/90">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#081329] border border-[#D9BD83]/30 text-[#D9BD83]">
                    <Award className="w-5 h-5" />
                  </div>
                  <Badge variant="gold" size="sm">UNLOCKED</Badge>
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-white font-display truncate">Monaco GP Pioneer</h5>
                  <p className="text-[11px] sm:text-xs text-[#94A3B8] leading-relaxed break-words">
                    Watched 10 live Formula 1 broadcasts with telemetry.
                  </p>
                </div>
                <span className="text-[10px] text-[#00E599] font-mono-stats block">Earned Yesterday</span>
              </Card>

              {/* Badge 2 (Unlocked) */}
              <Card variant="standard" className="p-3.5 space-y-2 border-[#267BFF]/40 bg-[#0E1C38]/90">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#081329] border border-[#267BFF]/30 text-[#267BFF]">
                    <Video className="w-5 h-5" />
                  </div>
                  <Badge variant="blue" size="sm">UNLOCKED</Badge>
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-white font-display truncate">Multicam Director</h5>
                  <p className="text-[11px] sm:text-xs text-[#94A3B8] leading-relaxed break-words">
                    Switched between 4 synchronized camera feeds.
                  </p>
                </div>
                <span className="text-[10px] text-[#00E599] font-mono-stats block">Earned 3d ago</span>
              </Card>

              {/* Badge 3 (In Progress) */}
              <Card variant="standard" className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#040A17] border border-[#1C3364] text-[#64748B]">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">16 / 20</Badge>
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-white font-display truncate">Telemetry Savant</h5>
                  <p className="text-[11px] sm:text-xs text-[#94A3B8] leading-relaxed break-words">
                    Analyze 20 qualifying sectors during live weekends.
                  </p>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#040A17] overflow-hidden">
                  <div className="h-full bg-[#267BFF] rounded-full" style={{ width: '80%' }} />
                </div>
              </Card>

              {/* Badge 4 (In Progress) */}
              <Card variant="standard" className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#040A17] border border-[#1C3364] text-[#64748B]">
                    <Timer className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">5 / 10</Badge>
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-white font-display truncate">Buzzer Beater Reflex</h5>
                  <p className="text-[11px] sm:text-xs text-[#94A3B8] leading-relaxed break-words">
                    Score 10 consecutive sub-200ms reaction times.
                  </p>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#040A17] overflow-hidden">
                  <div className="h-full bg-[#D9BD83] rounded-full" style={{ width: '50%' }} />
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
        <div className="flex items-center justify-between pb-2 border-b border-[#1C3364]/70 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Info className="w-5 h-5 text-[#267BFF] flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#F4F6FA] tracking-tight truncate">
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
                <Badge variant="blue" size="sm">BROADCAST TECH</Badge>
                <span className="text-xs text-[#94A3B8]">2h ago</span>
              </div>
              <h4 className="text-base font-bold font-display text-white">Stream Engine v2.4 Launched</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed break-words">
                Sub-second 4K multicam latency pipeline is now active for all motorsport and football feeds, featuring spatial 5.1 channel acoustic isolation.
              </p>
            </div>

            <div className="pt-2 border-t border-[#1C3364]/60 flex items-center justify-between text-xs">
              <span className="text-[#267BFF] font-medium">Read Technical Specs &rarr;</span>
            </div>
          </Card>

          {/* Announcement 2 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="gold" size="sm">COMMUNITY CUP</Badge>
                <span className="text-xs text-[#94A3B8]">1d ago</span>
              </div>
              <h4 className="text-base font-bold font-display text-white">Apex Sim Cup 2026 Open</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed break-words">
                Registrations are open for the annual community sim racing championship. 64 team slots available across 4 global regional brackets.
              </p>
            </div>

            <div className="pt-2 border-t border-[#1C3364]/60 flex items-center justify-between text-xs">
              <span className="text-[#D9BD83] font-medium">View Registration Info &rarr;</span>
            </div>
          </Card>

          {/* Announcement 3 */}
          <Card variant="standard" className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="success" size="sm">FEATURE UPDATE</Badge>
                <span className="text-xs text-[#94A3B8]">3d ago</span>
              </div>
              <h4 className="text-base font-bold font-display text-white">Live Tire Heatmap Telemetry</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed break-words">
                Direct tire carcass and surface temperature overlays are now accessible in the cockpit cam telemetry pane for all Grand Prix events.
              </p>
            </div>

            <div className="pt-2 border-t border-[#1C3364]/60 flex items-center justify-between text-xs">
              <span className="text-[#00E599] font-medium">Inspect Feature Demo &rarr;</span>
            </div>
          </Card>
        </Grid>
      </section>
    </div>
  )
}
