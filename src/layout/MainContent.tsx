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
  Activity,
  CheckCircle2,
  Compass,
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
    <div className={cn('flex-1 py-6 sm:py-8 lg:py-10 bg-[#171B1E] text-[#F6F5F1] min-w-0', className)}>
      <Container size="xl" className="space-y-6 sm:space-y-8">
        {/* Breadcrumb Hierarchy */}
        <Breadcrumbs
          items={[
            { id: 'app', label: 'ORVIX Platform', onClick: () => onSelectSection('home') },
            { id: currentItem.id, label: currentItem.label },
          ]}
        />

        {/* Dynamic Section Layout: If Home, render HomePage; If Sports, render SportsPage */}
        {activeSection === 'home' ? (
          <HomePage onSelectSection={onSelectSection} />
        ) : activeSection === 'sports' ? (
          <SportsPage onSelectSection={onSelectSection} />
        ) : (
          <>
            {/* Section Header for secondary sections */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#363C42]/80 min-w-0">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                  <span className="p-2 rounded-lg bg-[#252A2E] border border-[#363C42] text-[#C6AD7B] flex-shrink-0">
                    {React.createElement(currentItem.icon, { className: 'w-5 h-5' })}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#F6F5F1] tracking-tight break-words">
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
                <p className="text-sm sm:text-base text-[#8D9AA3] max-w-2xl leading-relaxed break-words font-body">
                  {currentItem.description}
                </p>
              </div>

              {/* Quick Section Actions */}
              <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Activity className="w-4 h-4 text-[#C6AD7B]" />}
                  onClick={() => onSelectSection('sports')}
                >
                  Simulated Telemetry
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Play className="w-4 h-4" />}
                  onClick={() => onSelectSection('sports')}
                >
                  Watch Demo Arena
                </Button>
              </div>
            </div>
          </>
        )}

        {/* GAMES SECTION */}
        {activeSection === 'games' && (
          <div className="space-y-6">
            <Card variant="standard" className="p-6">
              <h3 className="text-lg font-bold font-display text-[#F6F5F1]">Interactive Entertainment & Esports</h3>
              <p className="text-xs sm:text-sm text-[#8D9AA3] mt-1 font-body">
                Participate in simulated fan arenas, community esports brackets, and non-monetary skill challenges.
              </p>
            </Card>

            <Grid cols={3} gap="md">
              {['Apex Esports Invitational', 'Global Speedrun Championship', 'Fan Match Arena'].map((title, i) => (
                <Card key={i} variant="standard">
                  <CardHeader action={<Badge variant="champagne" size="sm">FEATURED</Badge>}>
                    <span className="text-xs text-[#C6AD7B] font-semibold font-display uppercase tracking-wider">Community Arena</span>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>Simulated Tournament Stage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-[#8D9AA3] font-body">
                    <p>• 16 Global Teams Registered</p>
                    <p>• Simulated Spectator & Telemetry Feeds</p>
                  </CardContent>
                  <CardFooter>
                    <span className="text-xs text-[#C6AD7B] font-mono-stats font-bold">Reward: 5,000 XP</span>
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
              <h3 className="text-lg font-bold font-display text-[#F6F5F1]">Weekly Community Challenges</h3>
              <p className="text-xs sm:text-sm text-[#8D9AA3] mt-1 font-body">
                Complete sports trivia quests, knowledge sprints, and skill challenges to earn XP and trophy badges.
              </p>
            </Card>

            <Grid cols={2} gap="lg">
              <Card variant="standard">
                <CardHeader action={<Badge variant="champagne" size="sm">ACTIVE</Badge>}>
                  <CardTitle>Apex Monaco Telemetry Quiz</CardTitle>
                  <CardDescription>Answer 5 questions about qualifying sector records.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-[#8D9AA3] font-body">
                  <p>Reward: 500 Fan XP + Lap Master Badge</p>
                  <div className="w-full bg-[#171B1E] h-2 rounded-full overflow-hidden border border-[#363C42]">
                    <div className="bg-[#C6AD7B] h-full w-2/3 rounded-full" />
                  </div>
                  <p className="text-[11px] text-[#C6AD7B] font-mono-stats">66% Completed by Community</p>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-[#8D9AA3]">Ends in 2 days</span>
                  <Button size="sm" variant="primary">Start Quiz</Button>
                </CardFooter>
              </Card>

              <Card variant="standard">
                <CardHeader action={<Badge variant="neutral" size="sm">NEW</Badge>}>
                  <CardTitle>Championship Knowledge Sprint</CardTitle>
                  <CardDescription>Test your knowledge on tournament history and rules.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-[#8D9AA3] font-body">
                  <p>Reward: 750 Fan XP + Sprint Badge</p>
                  <div className="w-full bg-[#171B1E] h-2 rounded-full overflow-hidden border border-[#363C42]">
                    <div className="bg-[#8D9AA3] h-full w-1/4 rounded-full" />
                  </div>
                  <p className="text-[11px] text-[#8D9AA3] font-mono-stats">25% Community Completed</p>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-[#8D9AA3]">Starts Tomorrow</span>
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
              <h3 className="text-lg font-bold font-display text-[#F6F5F1]">Global Fan Standings</h3>
              <p className="text-xs sm:text-sm text-[#8D9AA3] mt-1 font-body">
                Seasonal fan standings and community XP progression.
              </p>
            </Card>

            <Card variant="standard" className="overflow-hidden">
              <div className="divide-y divide-[#363C42]/80">
                {[
                  { rank: '#1', name: 'Marcus Sterling', score: '18,420 XP', badge: 'DIAMOND TIER', icon: '👑' },
                  { rank: '#2', name: 'Elena Rostova', score: '16,910 XP', badge: 'PLATINUM TIER', icon: '🥈' },
                  { rank: '#3', name: 'Kenji Takahashi', score: '15,300 XP', badge: 'GOLD TIER', icon: '🥉' },
                  { rank: '#4', name: 'Alex Rivera (You)', score: '14,840 XP', badge: 'DIAMOND TIER', isUser: true },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      'p-3.5 xs:p-4 flex items-center justify-between gap-2.5 text-sm transition-colors min-w-0',
                      row.isUser ? 'bg-[#2E343A] border-l-4 border-l-[#C6AD7B]' : 'hover:bg-[#252A2E]/60'
                    )}
                  >
                    <div className="flex items-center gap-2.5 xs:gap-4 min-w-0 flex-1">
                      <span className="font-mono-stats font-bold text-sm xs:text-base text-[#C6AD7B] w-6 xs:w-8 flex-shrink-0">
                        {row.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#F6F5F1] flex items-center gap-1.5 xs:gap-2 truncate font-display">
                          <span className="truncate">{row.name}</span> {row.icon && <span className="flex-shrink-0">{row.icon}</span>}
                        </p>
                        <p className="text-[11px] xs:text-xs text-[#8D9AA3] truncate">{row.badge}</p>
                      </div>
                    </div>
                    <span className="font-mono-stats font-bold text-[#F6F5F1] flex-shrink-0 text-xs xs:text-sm pl-2">{row.score}</span>
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
              <h3 className="text-lg font-bold font-display text-[#F6F5F1]">Earned Badges & Trophies</h3>
              <p className="text-xs sm:text-sm text-[#8D9AA3] mt-1 font-body">
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
                <Card key={i} variant="standard" className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-[#252A2E] border border-[#363C42]">
                      <Medal className={cn('w-6 h-6', badge.unlocked ? 'text-[#C6AD7B]' : 'text-[#68737D]')} />
                    </span>
                    <Badge variant={badge.unlocked ? 'champagne' : 'neutral'} size="sm">
                      {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#F6F5F1] font-display">{badge.title}</h4>
                    <p className="text-xs text-[#8D9AA3] mt-1 leading-relaxed font-body">{badge.desc}</p>
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
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#2E343A] border-2 border-[#C6AD7B] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="font-display font-black text-xl text-[#C6AD7B]">
                    AR
                  </span>
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                    <h3 className="text-xl font-bold font-display text-[#F6F5F1] truncate">Alex Rivera</h3>
                    <Badge variant="champagne" size="sm" className="flex-shrink-0">LEVEL 14</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-[#8D9AA3] break-words font-body">
                    Community member since October 2026 • <span className="text-[#F6F5F1] break-all">alex.rivera@orvix.internal</span>
                  </p>
                </div>
              </div>
            </Card>

            <Grid cols={3} gap="md">
              <Card variant="standard" className="p-5 space-y-2">
                <span className="text-xs text-[#8D9AA3] uppercase tracking-wider font-semibold">Active Stream Quality</span>
                <p className="text-base font-bold font-display text-[#F6F5F1]">4K Ultra-HD 60FPS</p>
                <p className="text-xs text-[#729B79]">Spatial Audio Enabled</p>
              </Card>
              <Card variant="standard" className="p-5 space-y-2">
                <span className="text-xs text-[#8D9AA3] uppercase tracking-wider font-semibold">Fan Ranking</span>
                <p className="text-base font-bold font-display text-[#F6F5F1]">Top 2.5% Globally</p>
                <p className="text-xs text-[#C6AD7B] font-mono-stats font-semibold">14,840 Season XP</p>
              </Card>
              <Card variant="standard" className="p-5 space-y-2">
                <span className="text-xs text-[#8D9AA3] uppercase tracking-wider font-semibold">Account Status</span>
                <p className="text-base font-bold font-display text-[#C6AD7B]">Active Fan Account</p>
                <p className="text-xs text-[#8D9AA3]">Sample Fan Profile</p>
              </Card>
            </Grid>
          </div>
        )}

        {/* HELP & SUPPORT SECTION */}
        {activeSection === 'help' && (
          <div className="space-y-6">
            <Card variant="standard" className="p-6">
              <h3 className="text-lg font-bold font-display text-[#F6F5F1]">Help & Support</h3>
              <p className="text-xs sm:text-sm text-[#8D9AA3] mt-1 font-body">
                Technical assistance, stream guides, and platform troubleshooting.
              </p>
            </Card>

            <Grid cols={3} gap="md">
              <Card variant="standard" className="p-5 space-y-3">
                <h4 className="font-bold text-sm text-[#F6F5F1] font-display">Multicam Stream Setup</h4>
                <p className="text-xs text-[#8D9AA3] leading-relaxed font-body">
                  How to configure synchronized race telemetry and cockpit camera angles.
                </p>
                <Button size="sm" variant="outline" fullWidth>Read Guide</Button>
              </Card>

              <Card variant="standard" className="p-5 space-y-3">
                <h4 className="font-bold text-sm text-[#F6F5F1] font-display">Audio & Bitrate Settings</h4>
                <p className="text-xs text-[#8D9AA3] leading-relaxed font-body">
                  Troubleshoot hardware acceleration, spatial audio, and buffer smoothing.
                </p>
                <Button size="sm" variant="outline" fullWidth>Read Guide</Button>
              </Card>

              <Card variant="standard" className="p-5 space-y-3">
                <h4 className="font-bold text-sm text-[#F6F5F1] font-display">Technical Support Desk</h4>
                <p className="text-xs text-[#8D9AA3] leading-relaxed font-body">
                  Assistance with streaming, multicam setup, and platform navigation.
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
