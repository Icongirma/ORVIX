import React from 'react'
import {
  Trophy,
  Play,
  Flame,
  Gamepad2,
  Award,
  Medal,
  User,
  HelpCircle,
  ArrowRight,
  Shield,
  Activity,
  Radio,
  Clock,
  Compass,
  CheckCircle2,
} from 'lucide-react'
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
  Breadcrumbs,
} from '../design-system/components'
import {
  NAVIGATION_ITEMS,
  type NavigationSectionId,
} from './navigationConfig'
import { HomePage, SportsPage } from '../pages'
import { cn } from '../design-system/utils/cn'

export interface MainContentProps {
  activeSection: NavigationSectionId
  onSelectSection: (id: NavigationSectionId) => void
  className?: string
}

export const MainContent: React.FC<MainContentProps> = ({
  activeSection,
  onSelectSection,
  className,
}) => {
  const currentItem = NAVIGATION_ITEMS.find((item) => item.id === activeSection) || NAVIGATION_ITEMS[0]

  return (
    <div className={cn('flex-1 py-6 sm:py-8 lg:py-10', className)}>
      <Container size="xl" className="space-y-8">
        {/* Breadcrumb Hierarchy */}
        <Breadcrumbs
          items={[
            { id: 'app', label: 'ORVIX Platform', onClick: () => onSelectSection('home') },
            { id: currentItem.id, label: currentItem.label },
          ]}
        />

        {/* Dynamic Section Layout: If Home, render complete 9-section Homepage Suite */}
        {activeSection === 'home' ? (
          <HomePage onSelectSection={onSelectSection} />
        ) : activeSection === 'sports' ? (
          <SportsPage onSelectSection={onSelectSection} />
        ) : (
          <>
            {/* Section Header for secondary sections */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1C3364]/70 min-w-0">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                  <span className="p-2 rounded-lg bg-[#0E1C38] border border-[#1C3364] text-[#267BFF] flex-shrink-0">
                    {React.createElement(currentItem.icon, { className: 'w-5 h-5' })}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#F4F6FA] tracking-tight break-words">
                    {currentItem.label}
                  </h1>
                  {currentItem.badge && (
                    <Badge
                      variant={currentItem.badgeVariant || 'neutral'}
                      size="md"
                      pulse={currentItem.badgeVariant === 'live'}
                      className="flex-shrink-0"
                    >
                      {currentItem.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed break-words">
                  {currentItem.description}
                </p>
              </div>

              {/* Quick Section Actions */}
              <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Activity className="w-4 h-4 text-[#267BFF]" />}
                  onClick={() => onSelectSection('sports')}
                >
                  Live Telemetry
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  glow
                  leftIcon={<Play className="w-4 h-4" />}
                  onClick={() => onSelectSection('sports')}
                >
                  Watch Arena
                </Button>
              </div>
            </div>
          </>
        )}

        {/* GAMES SECTION */}
        {activeSection === 'games' && (
          <div className="space-y-6">
            <Card variant="standard" className="p-6">
              <h3 className="text-lg font-bold font-display text-white">Interactive Entertainment &amp; Esports</h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Compete in real-time fan arenas, community esports tournaments, and interactive game challenges.
              </p>
            </Card>

            <Grid cols={3} gap="md">
              {['Apex Esports Invitational', 'Global Speedrun Championship', 'Fan Match Arena'].map((title, i) => (
                <Card key={i} variant="standard">
                  <CardHeader action={<Badge variant="blue" size="sm">HOT</Badge>}>
                    <span className="text-xs text-[#267BFF] font-semibold font-display">ESPORTS ARENA</span>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>Community Tournament Stage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-[#94A3B8]">
                    <p>• 16 Global Teams Registered</p>
                    <p>• Sample Tournament Rules &amp; Spectator Feeds</p>
                  </CardContent>
                  <CardFooter>
                    <span className="text-xs text-[#00E599] font-mono-stats">Award: 5,000 XP</span>
                    <Button size="sm" variant="outline">Enter Arena</Button>
                  </CardFooter>
                </Card>
              ))}
            </Grid>
          </div>
        )}

        {/* CHALLENGES SECTION */}
        {activeSection === 'challenges' && (
          <div className="space-y-6">
            <Card variant="standard" className="p-6">
              <h3 className="text-lg font-bold font-display text-white">Weekly Community Challenges</h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Complete sports trivia quests, knowledge sprints, and skill challenges to earn XP and trophy badges.
              </p>
            </Card>

            <Grid cols={2} gap="lg">
              <Card variant="standard">
                <CardHeader action={<Badge variant="blue" size="sm">ACTIVE</Badge>}>
                  <CardTitle>Apex Monaco Telemetry Quiz</CardTitle>
                  <CardDescription>Answer 5 questions about qualifying sector records.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-[#94A3B8]">
                  <p>Reward: 500 Fan XP + Lap Master Badge</p>
                  <div className="w-full bg-[#081329] h-2 rounded-full overflow-hidden border border-[#1C3364]">
                    <div className="bg-[#267BFF] h-full w-2/3" />
                  </div>
                  <p className="text-[11px] text-[#267BFF] font-mono-stats">66% Completed by Community</p>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-[#94A3B8]">Ends in 2 days</span>
                  <Button size="sm" variant="primary">Start Quiz</Button>
                </CardFooter>
              </Card>

              <Card variant="standard">
                <CardHeader action={<Badge variant="neutral" size="sm">NEW</Badge>}>
                  <CardTitle>Championship Knowledge Sprint</CardTitle>
                  <CardDescription>Test your knowledge on tournament history and rules.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-[#94A3B8]">
                  <p>Reward: 750 Fan XP + Sprint Badge</p>
                  <div className="w-full bg-[#081329] h-2 rounded-full overflow-hidden border border-[#1C3364]">
                    <div className="bg-[#00E599] h-full w-1/4" />
                  </div>
                  <p className="text-[11px] text-[#00E599] font-mono-stats">25% Community Completed</p>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-[#94A3B8]">Starts Tomorrow</span>
                  <Button size="sm" variant="outline">Enter Sprint</Button>
                </CardFooter>
              </Card>
            </Grid>
          </div>
        )}

        {/* LEADERBOARD SECTION */}
        {activeSection === 'leaderboard' && (
          <div className="space-y-6">
            <Card variant="standard" className="p-6">
              <h3 className="text-lg font-bold font-display text-white">Global Fan Standings</h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Seasonal fan standings and community XP progression.
              </p>
            </Card>

            <Card variant="standard" className="overflow-hidden">
              <div className="divide-y divide-[#1C3364]/70">
                {[
                  { rank: '#1', name: 'Marcus Sterling', score: '18,420 XP', badge: 'DIAMOND TIER', icon: '👑' },
                  { rank: '#2', name: 'Elena Rostova', score: '16,910 XP', badge: 'PLATINUM TIER', icon: '🥈' },
                  { rank: '#3', name: 'Kenji Takahashi', score: '15,300 XP', badge: 'GOLD TIER', icon: '🥉' },
                  { rank: '#4', name: 'Alex Rivera (You)', score: '14,840 XP', badge: 'DIAMOND TIER', isUser: true },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      'p-3 xs:p-4 flex items-center justify-between gap-2.5 text-sm transition-colors min-w-0',
                      row.isUser ? 'bg-[#15274D]/80 border-l-4 border-l-[#267BFF]' : 'hover:bg-[#0E1C38]/60'
                    )}
                  >
                    <div className="flex items-center gap-2.5 xs:gap-4 min-w-0 flex-1">
                      <span className="font-mono-stats font-bold text-sm xs:text-base text-[#D9BD83] w-6 xs:w-8 flex-shrink-0">
                        {row.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#F4F6FA] flex items-center gap-1.5 xs:gap-2 truncate">
                          <span className="truncate">{row.name}</span> {row.icon && <span className="flex-shrink-0">{row.icon}</span>}
                        </p>
                        <p className="text-[11px] xs:text-xs text-[#94A3B8] truncate">{row.badge}</p>
                      </div>
                    </div>
                    <span className="font-mono-stats font-bold text-[#00E599] flex-shrink-0 text-xs xs:text-sm pl-2">{row.score}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ACHIEVEMENTS SECTION */}
        {activeSection === 'achievements' && (
          <div className="space-y-6">
            <Card variant="standard" className="p-6">
              <h3 className="text-lg font-bold font-display text-white">Earned Badges &amp; Trophies</h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Your collectible milestone awards across sports broadcasts and community challenges.
              </p>
            </Card>

            <Grid cols={3} gap="md">
              {[
                { title: 'Grand Prix Pioneer', desc: 'Watched 10 live Formula 1 broadcasts with telemetry.', unlocked: true },
                { title: 'Championship Expert', desc: 'Completed 5 tournament knowledge challenges.', unlocked: true },
                { title: 'Arena Veteran', desc: 'Streamed 50 hours of live championship broadcasts.', unlocked: true },
                { title: 'Midnight Marathoner', desc: 'Streamed 24 hours of live entertainment.', unlocked: false },
                { title: 'Stadium Pioneer', desc: 'First 1,000 members during platform launch.', unlocked: true },
                { title: 'Multi-Cam Master', desc: 'Switched between 4 synchronized camera feeds.', unlocked: true },
              ].map((badge, i) => (
                <Card key={i} variant={badge.unlocked ? 'standard' : 'standard'} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-[#0E1C38] border border-[#1C3364]">
                      <Medal className={cn('w-6 h-6', badge.unlocked ? 'text-[#D9BD83]' : 'text-[#64748B]')} />
                    </span>
                    <Badge variant={badge.unlocked ? 'blue' : 'neutral'} size="sm">
                      {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#F4F6FA] font-display">{badge.title}</h4>
                    <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{badge.desc}</p>
                  </div>
                </Card>
              ))}
            </Grid>
          </div>
        )}

        {/* PROFILE SECTION */}
        {activeSection === 'profile' && (
          <div className="space-y-6">
            <Card variant="standard" className="p-5 sm:p-6">
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4 sm:gap-5 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#267BFF] to-[#D9BD83] p-[2px] flex-shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-[#081329] flex items-center justify-center font-display font-black text-xl text-white">
                    AR
                  </div>
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                    <h3 className="text-xl font-bold font-display text-white truncate">Alex Rivera</h3>
                    <Badge variant="blue" size="sm" className="flex-shrink-0">LEVEL 14</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-[#94A3B8] break-words">
                    Community member since October 2026 • <span className="text-[#F4F6FA] break-all">alex.rivera@orvix.internal</span>
                  </p>
                </div>
              </div>
            </Card>

            <Grid cols={3} gap="md">
              <Card variant="standard" className="p-5 space-y-2">
                <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Active Stream Quality</span>
                <p className="text-base font-bold font-display text-white">4K Ultra-HD 60FPS</p>
                <p className="text-xs text-[#00E599]">Spatial Audio Enabled</p>
              </Card>
              <Card variant="standard" className="p-5 space-y-2">
                <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Fan Ranking</span>
                <p className="text-base font-bold font-display text-white">Top 2.5% Globally</p>
                <p className="text-xs text-[#267BFF]">14,840 Season XP</p>
              </Card>
              <Card variant="standard" className="p-5 space-y-2">
                <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Account Status</span>
                <p className="text-base font-bold font-display text-[#D9BD83]">Active Fan Account</p>
                <p className="text-xs text-[#94A3B8]">Verified Member</p>
              </Card>
            </Grid>
          </div>
        )}

        {/* HELP & SUPPORT SECTION */}
        {activeSection === 'help' && (
          <div className="space-y-6">
            <Card variant="standard" className="p-6">
              <h3 className="text-lg font-bold font-display text-white">Help &amp; Support</h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Technical assistance, stream guides, and platform troubleshooting.
              </p>
            </Card>

            <Grid cols={3} gap="md">
              <Card variant="standard" className="p-5 space-y-3">
                <h4 className="font-bold text-sm text-white font-display">Multicam Stream Setup</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  How to configure synchronized race telemetry and cockpit camera angles.
                </p>
                <Button size="sm" variant="outline" fullWidth>Read Guide</Button>
              </Card>

              <Card variant="standard" className="p-5 space-y-3">
                <h4 className="font-bold text-sm text-white font-display">Audio &amp; Bitrate Settings</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Troubleshoot hardware acceleration, spatial audio, and buffer smoothing.
                </p>
                <Button size="sm" variant="outline" fullWidth>Read Guide</Button>
              </Card>

              <Card variant="standard" className="p-5 space-y-3">
                <h4 className="font-bold text-sm text-white font-display">Technical Support Desk</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Live assistance with streaming, multicam setup, and platform navigation.
                </p>
                <Button size="sm" variant="primary" fullWidth>Start Support Chat</Button>
              </Card>
            </Grid>
          </div>
        )}
      </Container>
    </div>
  )
}
