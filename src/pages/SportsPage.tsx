import React, { useState, useMemo } from 'react'
import {
  Trophy,
  Play,
  Calendar,
  Activity,
  Search,
  Filter,
  ChevronRight,
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  Shield,
  Star,
  CheckCircle2,
  BarChart2,
  Radio,
  Bell,
  Eye,
  Info,
  Layers,
  Award,
  Zap,
  Check,
  ChevronDown,
  Compass,
  Flame,
  Gauge,
  X,
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
  Grid,
  SearchInput,
} from '../design-system/components'
import { type NavigationSectionId } from '../layout/navigationConfig'
import { cn } from '../design-system/utils/cn'

export interface SportsPageProps {
  onSelectSection: (id: NavigationSectionId) => void
}

// Sport Categories
export type SportType = 'all' | 'football' | 'basketball' | 'motorsport' | 'tennis' | 'esports'

// View Tabs inside Sports Center
export type SportsCenterTab = 'fixtures' | 'results' | 'leagues' | 'teams'

// Match Status
export type MatchStatus = 'LIVE' | 'UPCOMING' | 'COMPLETED'

export interface MatchItem {
  id: string
  sport: SportType
  sportLabel: string
  leagueId: string
  leagueName: string
  teamHome: {
    name: string
    shortName: string
    score?: number
    logoColor: string
    scorers?: string[]
  }
  teamAway: {
    name: string
    shortName: string
    score?: number
    logoColor: string
    scorers?: string[]
  }
  status: MatchStatus
  statusText: string
  startTime: string
  venue: string
  city: string
  broadcastBadge: string
  stats?: {
    possession?: [number, number]
    shots?: [number, number]
    shotsOnTarget?: [number, number]
    corners?: [number, number]
    fouls?: [number, number]
    yellowCards?: [number, number]
    passAccuracy?: [string, string]
    // Basketball specific
    fieldGoalPct?: [string, string]
    threePointPct?: [string, string]
    rebounds?: [number, number]
    assists?: [number, number]
    turnovers?: [number, number]
    quarterScores?: {
      q1: [number, number]
      q2: [number, number]
      q3: [number, number]
      q4: [number, number]
      ot?: [number, number]
    }
    // Motorsport specific
    poleTime?: string
    gapToSecond?: string
    trackTemp?: string
    airTemp?: string
    fastestLap?: string
    pitStopsAvg?: string
  }
  lineupHome?: string[]
  lineupAway?: string[]
  formationHome?: string
  formationAway?: string
  headToHead?: {
    homeWins: number
    awayWins: number
    draws: number
    recentMatches: string[]
  }
}

export interface LeagueItem {
  id: string
  name: string
  sport: SportType
  sportLabel: string
  countryOrRegion: string
  currentPhase: string
  teamsCount: number
  activeSeason: string
  description: string
  badgeVariant: 'champagne' | 'steel' | 'neutral'
}

export interface TeamItem {
  id: string
  name: string
  shortName: string
  sport: SportType
  sportLabel: string
  league: string
  venue: string
  coach: string
  founded: string
  form: ('W' | 'D' | 'L')[]
  seasonRank: string
  keyStat: string
  statLabel: string
  accentColor: string
  roster: { name: string; position: string; number: number }[]
}

export const SportsPage: React.FC<SportsPageProps> = ({ onSelectSection }) => {
  // Navigation & Sub-Tab State
  const [activeSport, setActiveSport] = useState<SportType>('all')
  const [activeTab, setActiveTab] = useState<SportsCenterTab>('fixtures')

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState<string>('all')

  // Selected Match for Detailed View Modal
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null)
  const [matchDetailsTab, setMatchDetailsTab] = useState<'overview' | 'stats' | 'lineups' | 'h2h'>('overview')

  // Selected Team for Detailed View Modal
  const [selectedTeam, setSelectedTeam] = useState<TeamItem | null>(null)

  // Reminder toggles on upcoming fixtures
  const [reminders, setReminders] = useState<Record<string, boolean>>({})

  const toggleReminder = (id: string) => {
    setReminders((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Handle Sport Filter change with smart league reset
  const handleSportChange = (sport: SportType) => {
    setActiveSport(sport)
    if (selectedLeagueFilter !== 'all') {
      const currentLeague = leaguesData.find((l) => l.id === selectedLeagueFilter)
      if (currentLeague && sport !== 'all' && currentLeague.sport !== sport) {
        setSelectedLeagueFilter('all')
      }
    }
  }

  // Handle Keyboard accessibility & Body scroll lock when modals are active
  React.useEffect(() => {
    const isModalOpen = Boolean(selectedMatch || selectedTeam)
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMatch(null)
        setSelectedTeam(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedMatch, selectedTeam])

  // Sports Categories List with category icons
  const sportsCategories = [
    { id: 'all' as SportType, label: 'All Sports', count: 24, icon: Trophy },
    { id: 'football' as SportType, label: 'Football', count: 9, icon: Activity },
    { id: 'basketball' as SportType, label: 'Basketball', count: 6, icon: Flame },
    { id: 'motorsport' as SportType, label: 'Motorsport', count: 4, icon: Gauge },
    { id: 'tennis' as SportType, label: 'Tennis', count: 3, icon: Zap },
    { id: 'esports' as SportType, label: 'Esports', count: 2, icon: Layers },
  ]

  // Mock Leagues Data
  const leaguesData: LeagueItem[] = [
    {
      id: 'ucl',
      name: 'UEFA Champions League',
      sport: 'football',
      sportLabel: 'Football',
      countryOrRegion: 'Europe',
      currentPhase: 'Semi-Finals Leg 2',
      teamsCount: 32,
      activeSeason: '2025/2026',
      description: 'The pinnacle of European club football featuring the champions and top teams across Europe.',
      badgeVariant: 'champagne',
    },
    {
      id: 'epl',
      name: 'Premier League',
      sport: 'football',
      sportLabel: 'Football',
      countryOrRegion: 'England',
      currentPhase: 'Matchweek 34',
      teamsCount: 20,
      activeSeason: '2025/2026',
      description: 'The top tier of English football, known for intensity, global viewership, and fast transitions.',
      badgeVariant: 'steel',
    },
    {
      id: 'laliga',
      name: 'La Liga EA Sports',
      sport: 'football',
      sportLabel: 'Football',
      countryOrRegion: 'Spain',
      currentPhase: 'Matchday 33',
      teamsCount: 20,
      activeSeason: '2025/2026',
      description: 'Top professional football division in Spain, highlighting elite technical skill and tactical mastery.',
      badgeVariant: 'neutral',
    },
    {
      id: 'nba',
      name: 'NBA Showcase League',
      sport: 'basketball',
      sportLabel: 'Basketball',
      countryOrRegion: 'North America',
      currentPhase: 'Conference Finals Game 5',
      teamsCount: 30,
      activeSeason: '2025/2026',
      description: 'Premier professional basketball league showcasing the world’s most dynamic athletic basketball stars.',
      badgeVariant: 'champagne',
    },
    {
      id: 'euroleague',
      name: 'EuroLeague Basketball',
      sport: 'basketball',
      sportLabel: 'Basketball',
      countryOrRegion: 'Europe',
      currentPhase: 'Final Four Playoffs',
      teamsCount: 18,
      activeSeason: '2025/2026',
      description: 'Top-tier European professional club basketball tournament featuring strategic team play.',
      badgeVariant: 'steel',
    },
    {
      id: 'f1',
      name: 'Apex Formula Championship',
      sport: 'motorsport',
      sportLabel: 'Motorsport',
      countryOrRegion: 'Global',
      currentPhase: 'Round 8: Monaco Grand Prix',
      teamsCount: 10,
      activeSeason: '2026 Season',
      description: 'The premier single-seater auto racing championship with multi-cam synchronized pitwall telemetry.',
      badgeVariant: 'champagne',
    },
    {
      id: 'atp',
      name: 'ATP Masters 1000 Tour',
      sport: 'tennis',
      sportLabel: 'Tennis',
      countryOrRegion: 'Global',
      currentPhase: 'Madrid Open Semi-Finals',
      teamsCount: 64,
      activeSeason: '2026 Tour',
      description: 'Elite professional tennis tournament series with simulated Hawk-Eye spatial shot tracking.',
      badgeVariant: 'neutral',
    },
    {
      id: 'esports-pro',
      name: 'Apex Esports Pro Series',
      sport: 'esports',
      sportLabel: 'Esports',
      countryOrRegion: 'Global',
      currentPhase: 'Grand Finals 5v5',
      teamsCount: 16,
      activeSeason: 'Spring Split 2026',
      description: 'High-octane tactical esports championship streamed in 120 FPS with spectator director feeds.',
      badgeVariant: 'steel',
    },
  ]

  // Mock Teams Data
  const teamsData: TeamItem[] = [
    {
      id: 'madrid',
      name: 'Madrid FC',
      shortName: 'MAD',
      sport: 'football',
      sportLabel: 'Football',
      league: 'UEFA Champions League',
      venue: 'Santiago Bernabéu (Madrid)',
      coach: 'Carlo Ancelotti',
      founded: '1902',
      form: ['W', 'W', 'W', 'D', 'W'],
      seasonRank: '#1 League / UCL Semi-Finalist',
      keyStat: '2.84 Goals/Game',
      statLabel: 'Scoring Rate',
      accentColor: '#C6AD7B',
      roster: [
        { name: 'Thibaut Courtois', position: 'Goalkeeper', number: 1 },
        { name: 'Dani Carvajal', position: 'Defender', number: 2 },
        { name: 'Antonio Rüdiger', position: 'Defender', number: 22 },
        { name: 'Jude Bellingham', position: 'Midfielder', number: 5 },
        { name: 'Federico Valverde', position: 'Midfielder', number: 8 },
        { name: 'Vinícius Júnior', position: 'Forward', number: 7 },
        { name: 'Kylian Mbappé', position: 'Forward', number: 9 },
      ],
    },
    {
      id: 'bayern',
      name: 'Bayern Munich',
      shortName: 'BAY',
      sport: 'football',
      sportLabel: 'Football',
      league: 'UEFA Champions League',
      venue: 'Allianz Arena (Munich)',
      coach: 'Vincent Kompany',
      founded: '1900',
      form: ['W', 'L', 'W', 'W', 'D'],
      seasonRank: '#1 Bundesliga / UCL Semi-Finalist',
      keyStat: '64.2% Possession',
      statLabel: 'Ball Control',
      accentColor: '#E47D5B',
      roster: [
        { name: 'Manuel Neuer', position: 'Goalkeeper', number: 1 },
        { name: 'Dayot Upamecano', position: 'Defender', number: 2 },
        { name: 'Joshua Kimmich', position: 'Midfielder', number: 6 },
        { name: 'Jamal Musiala', position: 'Midfielder', number: 42 },
        { name: 'Leroy Sané', position: 'Forward', number: 10 },
        { name: 'Harry Kane', position: 'Forward', number: 9 },
      ],
    },
    {
      id: 'mancity',
      name: 'Manchester City',
      shortName: 'MCI',
      sport: 'football',
      sportLabel: 'Football',
      league: 'Premier League',
      venue: 'Etihad Stadium (Manchester)',
      coach: 'Pep Guardiola',
      founded: '1894',
      form: ['W', 'W', 'W', 'W', 'W'],
      seasonRank: '#1 Premier League',
      keyStat: '91.8% Passing',
      statLabel: 'Accuracy Rate',
      accentColor: '#8D9AA3',
      roster: [
        { name: 'Ederson', position: 'Goalkeeper', number: 31 },
        { name: 'Rúben Dias', position: 'Defender', number: 3 },
        { name: 'Rodri', position: 'Midfielder', number: 16 },
        { name: 'Kevin De Bruyne', position: 'Midfielder', number: 17 },
        { name: 'Phil Foden', position: 'Forward', number: 47 },
        { name: 'Erling Haaland', position: 'Forward', number: 9 },
      ],
    },
    {
      id: 'titans',
      name: 'Metro Titans',
      shortName: 'MTN',
      sport: 'basketball',
      sportLabel: 'Basketball',
      league: 'NBA Showcase League',
      venue: 'TD Garden (Boston)',
      coach: 'Joe Mazzulla',
      founded: '1946',
      form: ['W', 'W', 'W', 'L', 'W'],
      seasonRank: '#1 Eastern Conference',
      keyStat: '118.4 PPG',
      statLabel: 'Offensive Rating',
      accentColor: '#729B79',
      roster: [
        { name: 'Jayson Tatum', position: 'Forward', number: 0 },
        { name: 'Jaylen Brown', position: 'Guard', number: 7 },
        { name: 'Kristaps Porzingis', position: 'Center', number: 8 },
        { name: 'Jrue Holiday', position: 'Guard', number: 4 },
        { name: 'Derrick White', position: 'Guard', number: 9 },
      ],
    },
    {
      id: 'stars',
      name: 'Pacific Stars',
      shortName: 'PST',
      sport: 'basketball',
      sportLabel: 'Basketball',
      league: 'NBA Showcase League',
      venue: 'Chase Center (San Francisco)',
      coach: 'Steve Kerr',
      founded: '1946',
      form: ['L', 'W', 'W', 'W', 'L'],
      seasonRank: '#2 Western Conference',
      keyStat: '39.8% 3PT',
      statLabel: 'Perimeter Accuracy',
      accentColor: '#C6AD7B',
      roster: [
        { name: 'Stephen Curry', position: 'Guard', number: 30 },
        { name: 'Klay Thompson', position: 'Guard', number: 11 },
        { name: 'Draymond Green', position: 'Forward', number: 23 },
        { name: 'Andrew Wiggins', position: 'Forward', number: 22 },
        { name: 'Kevon Looney', position: 'Center', number: 5 },
      ],
    },
    {
      id: 'redbull',
      name: 'Oracle Red Bull Apex',
      shortName: 'RBR',
      sport: 'motorsport',
      sportLabel: 'Motorsport',
      league: 'Apex Formula Championship',
      venue: 'Milton Keynes (UK HQ)',
      coach: 'Christian Horner (Principal)',
      founded: '2005',
      form: ['W', 'W', 'W', 'W', 'W'],
      seasonRank: '#1 Constructors Championship',
      keyStat: '1:10.241',
      statLabel: 'Monaco Pole Time',
      accentColor: '#8D9AA3',
      roster: [
        { name: 'Max Verstappen', position: 'Lead Driver', number: 1 },
        { name: 'Sergio Pérez', position: 'Second Driver', number: 11 },
        { name: 'Gianpiero Lambiase', position: 'Race Engineer', number: 0 },
      ],
    },
  ]

  // Mock Matches & Fixtures Data
  const matchesData: MatchItem[] = [
    // Completed Match 1 (UCL Semi-Final)
    {
      id: 'match-1',
      sport: 'football',
      sportLabel: 'Football',
      leagueId: 'ucl',
      leagueName: 'UEFA Champions League',
      teamHome: {
        name: 'Madrid FC',
        shortName: 'MAD',
        score: 3,
        logoColor: '#C6AD7B',
        scorers: ['Vinícius Jr 34’', 'J. Bellingham 68’', 'K. Mbappé 89’'],
      },
      teamAway: {
        name: 'Bayern Munich',
        shortName: 'BAY',
        score: 1,
        logoColor: '#E47D5B',
        scorers: ['H. Kane 52’'],
      },
      status: 'COMPLETED',
      statusText: 'Simulated Final',
      startTime: 'Yesterday 21:00 CET',
      venue: 'Santiago Bernabéu',
      city: 'Madrid',
      broadcastBadge: '4K REPLAY AVAILABLE',
      stats: {
        possession: [56, 44],
        shots: [18, 11],
        shotsOnTarget: [9, 4],
        corners: [7, 3],
        fouls: [10, 14],
        yellowCards: [2, 3],
        passAccuracy: ['91%', '87%'],
      },
      formationHome: '4-3-3 Attacking',
      formationAway: '4-2-3-1 Balanced',
      lineupHome: [
        'T. Courtois (GK)',
        'D. Carvajal',
        'A. Rüdiger',
        'É. Militão',
        'F. Mendy',
        'F. Valverde',
        'A. Tchouaméni',
        'J. Bellingham (G: 68’)',
        'Rodrygo',
        'K. Mbappé (G: 89’)',
        'Vinícius Jr (G: 34’)',
      ],
      lineupAway: [
        'M. Neuer (GK)',
        'K. Laimer',
        'D. Upamecano',
        'Kim Min-jae',
        'A. Davies',
        'J. Kimmich',
        'A. Pavlović',
        'L. Sané',
        'J. Musiala',
        'S. Gnabry',
        'H. Kane (G: 52’)',
      ],
      headToHead: {
        homeWins: 13,
        awayWins: 11,
        draws: 4,
        recentMatches: ['MAD 3 - 1 BAY', 'BAY 2 - 2 MAD', 'BAY 1 - 2 MAD', 'MAD 2 - 2 BAY', 'BAY 1 - 2 MAD'],
      },
    },

    // Upcoming Match 2 (UCL Semi-Final Leg 2)
    {
      id: 'match-2',
      sport: 'football',
      sportLabel: 'Football',
      leagueId: 'ucl',
      leagueName: 'UEFA Champions League',
      teamHome: {
        name: 'Bayern Munich',
        shortName: 'BAY',
        logoColor: '#E47D5B',
      },
      teamAway: {
        name: 'Madrid FC',
        shortName: 'MAD',
        logoColor: '#C6AD7B',
      },
      status: 'UPCOMING',
      statusText: 'Today 20:45 CET',
      startTime: 'Today 20:45 CET',
      venue: 'Allianz Arena',
      city: 'Munich',
      broadcastBadge: '4K 60FPS DEMO ARENA',
      formationHome: '4-2-3-1 High Press',
      formationAway: '4-3-3 Counter-Attack',
      headToHead: {
        homeWins: 11,
        awayWins: 13,
        draws: 4,
        recentMatches: ['MAD 3 - 1 BAY', 'BAY 2 - 2 MAD'],
      },
    },

    // Live Match 3 (Apex Monaco Grand Prix)
    {
      id: 'match-3',
      sport: 'motorsport',
      sportLabel: 'Motorsport',
      leagueId: 'f1',
      leagueName: 'Apex Formula Championship',
      teamHome: {
        name: 'Max Verstappen (Red Bull)',
        shortName: 'VER',
        score: 1, // P1
        logoColor: '#8D9AA3',
      },
      teamAway: {
        name: 'Lando Norris (McLaren)',
        shortName: 'NOR',
        score: 2, // P2
        logoColor: '#C6AD7B',
      },
      status: 'LIVE',
      statusText: 'Lap 54 / 78',
      startTime: 'Live Now',
      venue: 'Circuit de Monaco',
      city: 'Monte Carlo',
      broadcastBadge: 'MULTICAM DIRECTOR ACTIVE',
      stats: {
        poleTime: '1:10.241 (VER)',
        gapToSecond: '-0.482s',
        trackTemp: '38.4°C',
        airTemp: '24.2°C',
        fastestLap: '1:12.890 (Lap 42)',
        pitStopsAvg: '2.34s',
      },
    },

    // Completed Match 4 (NBA Finals G4)
    {
      id: 'match-4',
      sport: 'basketball',
      sportLabel: 'Basketball',
      leagueId: 'nba',
      leagueName: 'NBA Showcase League',
      teamHome: {
        name: 'Metro Titans',
        shortName: 'MTN',
        score: 112,
        logoColor: '#729B79',
      },
      teamAway: {
        name: 'Pacific Stars',
        shortName: 'PST',
        score: 108,
        logoColor: '#C6AD7B',
      },
      status: 'COMPLETED',
      statusText: 'Final / OT',
      startTime: '2 days ago',
      venue: 'TD Garden',
      city: 'Boston',
      broadcastBadge: 'BOX SCORE COMPLETE',
      stats: {
        fieldGoalPct: ['48.2%', '45.6%'],
        threePointPct: ['39.4%', '35.1%'],
        rebounds: [46, 41],
        assists: [28, 23],
        turnovers: [11, 14],
        quarterScores: {
          q1: [28, 26],
          q2: [24, 27],
          q3: [26, 25],
          q4: [22, 22],
          ot: [12, 8],
        },
      },
      lineupHome: ['J. Tatum (38 pts, 11 reb)', 'J. Brown (24 pts)', 'K. Porzingis (18 pts)', 'J. Holiday (14 pts, 8 ast)', 'D. White (12 pts)'],
      lineupAway: ['S. Curry (34 pts, 7 3PM)', 'K. Thompson (22 pts)', 'A. Wiggins (16 pts)', 'D. Green (12 pts, 9 ast)', 'K. Looney (8 pts, 12 reb)'],
      headToHead: {
        homeWins: 18,
        awayWins: 14,
        draws: 0,
        recentMatches: ['MTN 112 - 108 PST (OT)', 'PST 104 - 98 MTN', 'PST 115 - 110 MTN', 'MTN 120 - 102 PST'],
      },
    },

    // Upcoming Match 5 (NBA Finals G5)
    {
      id: 'match-5',
      sport: 'basketball',
      sportLabel: 'Basketball',
      leagueId: 'nba',
      leagueName: 'NBA Showcase League',
      teamHome: {
        name: 'London Thunder',
        shortName: 'LTH',
        logoColor: '#8D9AA3',
      },
      teamAway: {
        name: 'Pacific Stars',
        shortName: 'PST',
        logoColor: '#C6AD7B',
      },
      status: 'UPCOMING',
      statusText: 'Tomorrow 02:00 CET',
      startTime: 'Tomorrow 02:00 CET',
      venue: 'O2 Arena',
      city: 'London',
      broadcastBadge: 'SPATIAL AUDIO 5.1',
    },

    // Upcoming Match 6 (ATP Tennis Masters)
    {
      id: 'match-6',
      sport: 'tennis',
      sportLabel: 'Tennis',
      leagueId: 'atp',
      leagueName: 'ATP Masters 1000 Tour',
      teamHome: {
        name: 'Carlos Alcaraz',
        shortName: 'ALC',
        logoColor: '#C6AD7B',
      },
      teamAway: {
        name: 'Jannik Sinner',
        shortName: 'SIN',
        logoColor: '#8D9AA3',
      },
      status: 'UPCOMING',
      statusText: 'Saturday 15:30 CET',
      startTime: 'Saturday 15:30 CET',
      venue: 'Caja Mágica Center Court',
      city: 'Madrid',
      broadcastBadge: 'HAWK-EYE 3D LOGS',
    },
  ]

  // Available Leagues for Dropdown based on active sport
  const availableLeaguesForDropdown = useMemo(() => {
    if (activeSport === 'all') return leaguesData
    return leaguesData.filter((l) => l.sport === activeSport)
  }, [activeSport])

  // Filtered Matches based on sport, tab, league, and search query
  const filteredMatches = useMemo(() => {
    return matchesData.filter((match) => {
      // 1. Sport filter
      if (activeSport !== 'all' && match.sport !== activeSport) return false

      // 2. League filter
      if (selectedLeagueFilter !== 'all' && match.leagueId !== selectedLeagueFilter) return false

      // 3. Status tab filter
      if (activeTab === 'fixtures' && match.status === 'COMPLETED') return false
      if (activeTab === 'results' && match.status !== 'COMPLETED') return false

      // 4. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          match.teamHome.name.toLowerCase().includes(q) ||
          match.teamAway.name.toLowerCase().includes(q) ||
          match.teamHome.shortName.toLowerCase().includes(q) ||
          match.teamAway.shortName.toLowerCase().includes(q) ||
          match.leagueName.toLowerCase().includes(q) ||
          match.venue.toLowerCase().includes(q) ||
          match.city.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }

      return true
    })
  }, [activeSport, activeTab, selectedLeagueFilter, searchQuery])

  // Filtered Leagues based on active sport
  const filteredLeagues = useMemo(() => {
    return leaguesData.filter((league) => {
      if (activeSport !== 'all' && league.sport !== activeSport) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          league.name.toLowerCase().includes(q) ||
          league.countryOrRegion.toLowerCase().includes(q) ||
          league.description.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activeSport, searchQuery])

  // Filtered Teams based on active sport
  const filteredTeams = useMemo(() => {
    return teamsData.filter((team) => {
      if (activeSport !== 'all' && team.sport !== activeSport) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          team.name.toLowerCase().includes(q) ||
          team.league.toLowerCase().includes(q) ||
          team.venue.toLowerCase().includes(q) ||
          team.coach.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activeSport, searchQuery])

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 pb-20 lg:pb-12 text-[#F6F5F1]">
      {/* =========================================================================
          DISCLAIMER & SIMULATION NOTICE BANNER
         ========================================================================= */}
      <div className="p-3 xs:p-3.5 rounded-xl bg-[#252A2E] border border-[#363C42] flex items-center justify-between gap-3 text-xs text-[#8D9AA3] min-w-0 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="p-1.5 rounded-lg bg-[#171B1E] border border-[#363C42] text-[#C6AD7B] flex-shrink-0">
            <Info className="w-4 h-4" />
          </span>
          <p className="leading-relaxed break-words text-[11px] xs:text-xs text-[#8D9AA3]">
            <strong className="text-[#F6F5F1] font-display font-bold">ORVIX Sports Center (Simulated Data Preview):</strong> All leagues, squad rosters, fixture telemetry, and final scores are simulated demonstration data. Non-monetary, informational preview — no betting, wagering, or real-money gaming.
          </p>
        </div>
        <Badge variant="champagne" size="sm" className="flex-shrink-0 hidden md:inline-flex">
          SIMULATED TELEMETRY
        </Badge>
      </div>

      {/* =========================================================================
          SECTION 1: SPORTS CENTER HEADER & CATEGORY NAVIGATION
         ========================================================================= */}
      <div className="space-y-5 min-w-0">
        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#363C42] min-w-0">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 min-w-0">
              <span className="p-2 rounded-lg bg-[#252A2E] border border-[#363C42] text-[#C6AD7B] flex-shrink-0 shadow-sm">
                <Trophy className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#F6F5F1] tracking-tight break-words">
                Sports Center
              </h1>
              <Badge variant="champagne" size="sm" className="flex-shrink-0">
                DEMO ARENA
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#8D9AA3] max-w-2xl leading-relaxed break-words">
              Explore simulated football, basketball, motorsport, tennis, and esports. Inspect simulated match telemetry, sample league standings, and sample squad rosters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Activity className="w-4 h-4 text-[#C6AD7B]" />}
              onClick={() => {
                setActiveSport('motorsport')
                setActiveTab('fixtures')
              }}
            >
              Simulated Telemetry
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Play className="w-4 h-4" />}
              onClick={() => {
                const liveMatch = matchesData.find((m) => m.status === 'LIVE')
                if (liveMatch) setSelectedMatch(liveMatch)
              }}
            >
              Watch Arena Feeds
            </Button>
          </div>
        </div>

        {/* Sports Category Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 max-w-full">
          {sportsCategories.map((cat) => {
            const isActive = activeSport === cat.id
            const CategoryIcon = cat.icon
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSportChange(cat.id)}
                className={cn(
                  'px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-semibold transition-all flex items-center gap-2 whitespace-nowrap select-none flex-shrink-0 border',
                  isActive
                    ? 'bg-[#C6AD7B] text-[#171B1E] border-[#C6AD7B] shadow-sm font-bold'
                    : 'bg-[#252A2E] text-[#8D9AA3] border-[#363C42] hover:text-[#F6F5F1] hover:bg-[#2C3237] hover:border-[#424950]'
                )}
              >
                <CategoryIcon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-[#171B1E]' : 'text-[#8D9AA3]')} />
                <span>{cat.label}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-mono-stats font-bold',
                    isActive ? 'bg-[#171B1E]/20 text-[#171B1E]' : 'bg-[#171B1E] text-[#8D9AA3]'
                  )}
                >
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: SEARCH, FILTERING & SUB-VIEW TABS
         ========================================================================= */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#252A2E] border border-[#363C42] space-y-4 min-w-0 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 min-w-0">
          {/* Main Sub-Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0 max-w-full">
            {[
              { id: 'fixtures' as SportsCenterTab, label: 'Upcoming Fixtures', icon: Calendar },
              { id: 'results' as SportsCenterTab, label: 'Completed Results', icon: CheckCircle2 },
              { id: 'leagues' as SportsCenterTab, label: 'Leagues & Tournaments', icon: Award },
              { id: 'teams' as SportsCenterTab, label: 'Teams & Rosters', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-xs font-display font-medium transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0 border',
                    isSelected
                      ? 'bg-[#171B1E] text-[#F6F5F1] font-bold border-[#C6AD7B]/70 shadow-sm'
                      : 'border-transparent text-[#8D9AA3] hover:text-[#F6F5F1] hover:bg-[#2C3237]'
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', isSelected ? 'text-[#C6AD7B]' : 'text-[#8D9AA3]')} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="w-full lg:w-72 min-w-0">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search sports, teams, leagues..."
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1 & 2: FIXTURES & MATCH RESULTS
         ========================================================================= */}
      {(activeTab === 'fixtures' || activeTab === 'results') && (
        <div className="space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 min-w-0">
            <div className="flex items-center gap-2.5 truncate">
              <h3 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1] tracking-tight truncate">
                {activeTab === 'fixtures' ? 'Simulated & Scheduled Fixtures' : 'Simulated Final Scores & Telemetry'}
              </h3>
              <Badge variant="steel" size="sm" className="hidden sm:inline-flex">
                {filteredMatches.length} Available
              </Badge>
            </div>

            {/* League Dropdown Filter */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-[#8D9AA3] hidden md:inline">Competition:</span>
              <select
                aria-label="Filter by League"
                value={selectedLeagueFilter}
                onChange={(e) => setSelectedLeagueFilter(e.target.value)}
                className="bg-[#252A2E] border border-[#363C42] text-xs text-[#F6F5F1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#C6AD7B] transition-colors"
              >
                <option value="all">
                  {activeSport === 'all' ? 'All Competitions' : `All ${activeSport.toUpperCase()} Competitions`}
                </option>
                {availableLeaguesForDropdown.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredMatches.length === 0 ? (
            <Card variant="standard" className="p-8 text-center space-y-3">
              <Search className="w-8 h-8 text-[#68737D] mx-auto" />
              <h4 className="text-base font-bold font-display text-[#F6F5F1]">No matches found</h4>
              <p className="text-xs text-[#8D9AA3] max-w-sm mx-auto">
                No fixtures or results matched your search criteria. Try selecting &quot;All Sports&quot; or clearing your filter.
              </p>
              <Button size="sm" variant="outline" onClick={() => { setActiveSport('all'); setSearchQuery(''); setSelectedLeagueFilter('all') }}>
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-3 min-w-0">
              {filteredMatches.map((match) => {
                const isLive = match.status === 'LIVE'
                const isCompleted = match.status === 'COMPLETED'
                const hasReminder = reminders[match.id]

                return (
                  <Card
                    key={match.id}
                    variant="standard"
                    className={cn(
                      'p-4 sm:p-5 transition-all hover:border-[#C6AD7B]/60 cursor-pointer min-w-0 relative',
                      isLive && 'border-[#C6AD7B]/70 bg-[#252A2E]'
                    )}
                    onClick={() => setSelectedMatch(match)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
                      {/* Left: Tournament Badge, Venue & Status */}
                      <div className="space-y-2.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold font-display uppercase tracking-wider text-[#C6AD7B]">
                            {match.leagueName}
                          </span>
                          <span className="text-xs text-[#68737D]">•</span>
                          <span className="text-xs text-[#8D9AA3] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#C6AD7B]" />
                            {match.venue}, {match.city}
                          </span>
                          {isLive && (
                            <Badge variant="live" size="sm" pulse>
                              {match.statusText}
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="steel" size="sm">
                              {match.statusText}
                            </Badge>
                          )}
                          {!isLive && !isCompleted && (
                            <span className="text-xs font-mono-stats text-[#D9DEE2] font-semibold">
                              {match.startTime}
                            </span>
                          )}
                          <Badge variant="neutral" size="sm">
                            {match.broadcastBadge}
                          </Badge>
                        </div>

                        {/* Teams Board */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1 min-w-0">
                          {/* Home Team */}
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-[#171B1E] flex-shrink-0 shadow-sm"
                              style={{ backgroundColor: match.teamHome.logoColor }}
                            >
                              {match.teamHome.shortName}
                            </div>
                            <span className="font-bold text-sm sm:text-base text-[#F6F5F1] font-display truncate">
                              {match.teamHome.name}
                            </span>
                          </div>

                          {/* Score / VS Center Divider */}
                          <div className="flex items-center justify-center px-3.5 py-1.5 rounded-lg bg-[#171B1E] border border-[#363C42] flex-shrink-0">
                            {match.teamHome.score !== undefined && match.teamAway.score !== undefined ? (
                              <span className="font-mono-stats font-bold text-base sm:text-lg text-[#F6F5F1] tracking-tight">
                                {match.teamHome.score} - {match.teamAway.score}
                              </span>
                            ) : (
                              <span className="font-display font-semibold text-xs text-[#C6AD7B]">VS</span>
                            )}
                          </div>

                          {/* Away Team */}
                          <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-start sm:justify-end">
                            <span className="font-bold text-sm sm:text-base text-[#F6F5F1] font-display truncate order-2 sm:order-1 text-left sm:text-right">
                              {match.teamAway.name}
                            </span>
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-[#171B1E] flex-shrink-0 order-1 sm:order-2 shadow-sm"
                              style={{ backgroundColor: match.teamAway.logoColor }}
                            >
                              {match.teamAway.shortName}
                            </div>
                          </div>
                        </div>

                        {/* Scorers / Telemetry Preview Snippet */}
                        {match.teamHome.scorers && (
                          <p className="text-[11px] text-[#8D9AA3] font-mono-stats truncate">
                            Goals: {match.teamHome.scorers.join(', ')} | {match.teamAway.scorers?.join(', ')}
                          </p>
                        )}
                        {match.stats?.gapToSecond && (
                          <p className="text-[11px] text-[#C6AD7B] font-mono-stats">
                            Gap to P2: {match.stats.gapToSecond} • Sector 2 Record Active
                          </p>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div
                        className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-shrink-0 pt-2 lg:pt-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!isCompleted && !isLive && (
                          <Button
                            size="sm"
                            variant={hasReminder ? 'secondary' : 'outline'}
                            className="flex-1 sm:flex-none"
                            leftIcon={hasReminder ? <Check className="w-3.5 h-3.5 text-[#C6AD7B]" /> : <Bell className="w-3.5 h-3.5" />}
                            onClick={() => toggleReminder(match.id)}
                          >
                            {hasReminder ? 'Alert Set' : 'Set Alert'}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant={isLive ? 'primary' : 'outline'}
                          className="flex-1 sm:flex-none"
                          leftIcon={isLive ? <Play className="w-3.5 h-3.5" /> : <BarChart2 className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedMatch(match)}
                        >
                          {isLive ? 'Demo Arena' : 'Match Details'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: LEAGUES & COMPETITIONS DIRECTORY
         ========================================================================= */}
      {activeTab === 'leagues' && (
        <div className="space-y-4 min-w-0">
          <div className="flex items-center justify-between pb-1 min-w-0">
            <div className="flex items-center gap-2.5 truncate">
              <h3 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1] tracking-tight truncate">
                Global Leagues &amp; Sample Tournaments
              </h3>
              <Badge variant="steel" size="sm">
                {filteredLeagues.length} Active
              </Badge>
            </div>
          </div>

          <Grid cols={3} gap="md">
            {filteredLeagues.map((league) => (
              <Card
                key={league.id}
                variant="standard"
                className="p-5 flex flex-col justify-between space-y-4 hover:border-[#C6AD7B]/50 transition-all min-w-0"
              >
                <div className="space-y-3 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={league.badgeVariant} size="sm">
                      {league.sportLabel}
                    </Badge>
                    <span className="text-xs text-[#8D9AA3] font-mono-stats">{league.activeSeason}</span>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1] break-words">
                      {league.name}
                    </h4>
                    <span className="text-xs text-[#C6AD7B] font-semibold">{league.countryOrRegion}</span>
                  </div>

                  <p className="text-xs text-[#8D9AA3] leading-relaxed break-words">
                    {league.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#171B1E] border border-[#363C42] flex items-center justify-between text-xs font-mono-stats">
                    <span className="text-[#8D9AA3]">Current Phase</span>
                    <span className="text-[#F6F5F1] font-bold">{league.currentPhase}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#363C42] flex items-center justify-between text-xs">
                  <span className="text-[#8D9AA3]">{league.teamsCount} Competing Teams</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedLeagueFilter(league.id)
                      setActiveTab('fixtures')
                    }}
                  >
                    View Fixtures
                  </Button>
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TEAMS & ROSTERS DIRECTORY
         ========================================================================= */}
      {activeTab === 'teams' && (
        <div className="space-y-4 min-w-0">
          <div className="flex items-center justify-between pb-1 min-w-0">
            <div className="flex items-center gap-2.5 truncate">
              <h3 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1] tracking-tight truncate">
                Team Profiles &amp; Sample Squad Rosters
              </h3>
              <Badge variant="steel" size="sm">
                {filteredTeams.length} Teams
              </Badge>
            </div>
          </div>

          <Grid cols={3} gap="md">
            {filteredTeams.map((team) => (
              <Card
                key={team.id}
                variant="standard"
                className="p-5 flex flex-col justify-between space-y-4 hover:border-[#C6AD7B]/50 transition-all cursor-pointer min-w-0"
                onClick={() => setSelectedTeam(team)}
              >
                <div className="space-y-3 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs text-[#171B1E] flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: team.accentColor }}
                      >
                        {team.shortName}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-bold font-display text-[#F6F5F1] truncate">
                          {team.name}
                        </h4>
                        <p className="text-[10px] text-[#8D9AA3] truncate">{team.league}</p>
                      </div>
                    </div>
                    <Badge variant="neutral" size="sm" className="flex-shrink-0">
                      {team.sportLabel}
                    </Badge>
                  </div>

                  {/* Form & Arena */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8D9AA3]">Recent Form:</span>
                      <div className="flex items-center gap-1 font-mono-stats font-bold text-[10px]">
                        {team.form.map((res, i) => (
                          <span
                            key={i}
                            className={cn(
                              'w-4 h-4 rounded flex items-center justify-center font-bold',
                              res === 'W' && 'bg-[#729B79]/80 text-[#171B1E]',
                              res === 'D' && 'bg-[#C6AD7B]/80 text-[#171B1E]',
                              res === 'L' && 'bg-[#E47D5B]/80 text-[#171B1E]'
                            )}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[#8D9AA3] truncate">
                      <span>Venue:</span>
                      <span className="text-[#F6F5F1] truncate max-w-[140px]">{team.venue}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#8D9AA3]">
                      <span>Head Coach:</span>
                      <span className="text-[#F6F5F1] truncate">{team.coach}</span>
                    </div>
                  </div>

                  {/* Key Stat Box */}
                  <div className="p-2.5 rounded-lg bg-[#171B1E] border border-[#363C42] flex items-center justify-between text-xs">
                    <span className="text-[#8D9AA3]">{team.statLabel}</span>
                    <span className="text-[#C6AD7B] font-mono-stats font-bold">{team.keyStat}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#363C42] flex items-center justify-between text-xs">
                  <span className="text-[#C6AD7B] font-semibold">{team.seasonRank}</span>
                  <Button size="sm" variant="outline" onClick={() => setSelectedTeam(team)}>
                    Inspect Roster
                  </Button>
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      )}

      {/* =========================================================================
          MATCH DETAILS VIEW (Full Screen Overlay Modal)
         ========================================================================= */}
      {selectedMatch && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedMatch.teamHome.name} vs ${selectedMatch.teamAway.name} Match Details`}
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 xs:p-3 sm:p-6 bg-[#0B0D0E]/80 backdrop-blur-md overflow-y-auto animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMatch(null)
          }}
        >
          <div
            className="relative w-full max-w-4xl bg-[#252A2E] border border-[#363C42] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="p-3.5 xs:p-4 sm:p-5 border-b border-[#363C42] bg-[#1E2327] flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="p-1.5 rounded-lg bg-[#252A2E] border border-[#363C42] text-[#8D9AA3] hover:text-[#F6F5F1] transition-colors flex-shrink-0"
                  aria-label="Back to matches"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6AD7B] block truncate font-display">
                    {selectedMatch.leagueName}
                  </span>
                  <h3 className="text-xs xs:text-sm sm:text-base font-bold font-display text-[#F6F5F1] truncate">
                    {selectedMatch.teamHome.name} vs. {selectedMatch.teamAway.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={selectedMatch.status === 'LIVE' ? 'live' : 'steel'} size="sm" className="hidden xs:inline-flex">
                  {selectedMatch.statusText}
                </Badge>
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="text-[#8D9AA3] hover:text-[#F6F5F1] p-1.5 rounded-lg hover:bg-[#252A2E] transition-colors"
                  aria-label="Close match details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Demonstration Disclaimer Notice */}
            <div className="px-3.5 xs:px-4 py-2 bg-[#171B1E] border-b border-[#363C42] flex items-center justify-between text-[11px] text-[#8D9AA3]">
              <span className="flex items-center gap-1.5 min-w-0 truncate">
                <Info className="w-3.5 h-3.5 text-[#C6AD7B] flex-shrink-0" />
                <span className="truncate">Simulated Match Data — Demonstration Dataset</span>
              </span>
              <Badge variant="neutral" size="sm" className="flex-shrink-0 ml-2">DEMO PREVIEW</Badge>
            </div>

            {/* Scoreboard Hero Banner */}
            <div className="p-4 xs:p-5 sm:p-7 bg-[#1E2327] border-b border-[#363C42] text-center space-y-3 sm:space-y-4">
              <div className="flex items-center justify-around gap-2 sm:gap-4 max-w-2xl mx-auto">
                {/* Team Home */}
                <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-display font-black text-xs xs:text-sm sm:text-2xl text-[#171B1E] shadow-lg flex-shrink-0"
                    style={{ backgroundColor: selectedMatch.teamHome.logoColor }}
                  >
                    {selectedMatch.teamHome.shortName}
                  </div>
                  <h4 className="font-bold text-xs xs:text-sm sm:text-lg text-[#F6F5F1] font-display truncate max-w-[85px] xs:max-w-[120px] sm:max-w-none text-center">
                    {selectedMatch.teamHome.name}
                  </h4>
                </div>

                {/* Score or VS Display */}
                <div className="flex flex-col items-center justify-center px-3 xs:px-5 py-2 rounded-xl bg-[#171B1E] border border-[#363C42] shadow-inner flex-shrink-0">
                  {selectedMatch.teamHome.score !== undefined && selectedMatch.teamAway.score !== undefined ? (
                    <span className="font-mono-stats font-black text-xl xs:text-2xl sm:text-4xl text-[#F6F5F1] tracking-tight">
                      {selectedMatch.teamHome.score} - {selectedMatch.teamAway.score}
                    </span>
                  ) : (
                    <span className="font-display font-bold text-base xs:text-lg sm:text-xl text-[#C6AD7B]">VS</span>
                  )}
                  <span className="text-[9px] xs:text-[10px] text-[#C6AD7B] mt-0.5 sm:mt-1 font-mono-stats uppercase whitespace-nowrap font-bold">
                    {selectedMatch.statusText}
                  </span>
                </div>

                {/* Team Away */}
                <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-display font-black text-xs xs:text-sm sm:text-2xl text-[#171B1E] shadow-lg flex-shrink-0"
                    style={{ backgroundColor: selectedMatch.teamAway.logoColor }}
                  >
                    {selectedMatch.teamAway.shortName}
                  </div>
                  <h4 className="font-bold text-xs xs:text-sm sm:text-lg text-[#F6F5F1] font-display truncate max-w-[85px] xs:max-w-[120px] sm:max-w-none text-center">
                    {selectedMatch.teamAway.name}
                  </h4>
                </div>
              </div>

              {/* Venue & Broadcast Specs */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#8D9AA3]">
                <span className="break-words">{selectedMatch.venue} ({selectedMatch.city})</span>
                <span className="hidden xs:inline text-[#68737D]">•</span>
                <span className="text-[#C6AD7B] font-semibold">{selectedMatch.broadcastBadge}</span>
              </div>
            </div>

            {/* Modal Internal Navigation Tabs */}
            <div className="px-5 border-b border-[#363C42] bg-[#1E2327]/60 flex items-center gap-4 overflow-x-auto scrollbar-none">
              {[
                { id: 'overview' as const, label: 'Match Overview' },
                { id: 'stats' as const, label: 'Match Statistics' },
                { id: 'lineups' as const, label: 'Lineups & Formations' },
                { id: 'h2h' as const, label: 'Head-to-Head Form' },
              ].map((subTab) => (
                <button
                  key={subTab.id}
                  type="button"
                  onClick={() => setMatchDetailsTab(subTab.id)}
                  className={cn(
                    'py-3 border-b-2 font-display text-xs font-semibold whitespace-nowrap transition-colors',
                    matchDetailsTab === subTab.id
                      ? 'border-[#C6AD7B] text-[#F6F5F1] font-bold'
                      : 'border-transparent text-[#8D9AA3] hover:text-[#F6F5F1]'
                  )}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* SUB-VIEW 1: OVERVIEW */}
              {matchDetailsTab === 'overview' && (
                <div className="space-y-5">
                  <Card variant="standard" className="p-4 space-y-3">
                    <h5 className="font-bold text-sm text-[#F6F5F1] font-display flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C6AD7B]" />
                      Match Events &amp; Timeline
                    </h5>

                    {selectedMatch.teamHome.scorers || selectedMatch.teamAway.scorers ? (
                      <div className="space-y-2 text-xs">
                        {selectedMatch.teamHome.scorers?.map((scorer, i) => (
                          <div key={i} className="flex items-center gap-2 text-[#F6F5F1]">
                            <span className="w-2 h-2 rounded-full bg-[#C6AD7B]" />
                            <span className="font-semibold">{selectedMatch.teamHome.name}:</span>
                            <span className="text-[#8D9AA3] font-mono-stats">{scorer}</span>
                          </div>
                        ))}
                        {selectedMatch.teamAway.scorers?.map((scorer, i) => (
                          <div key={i} className="flex items-center gap-2 text-[#F6F5F1]">
                            <span className="w-2 h-2 rounded-full bg-[#E47D5B]" />
                            <span className="font-semibold">{selectedMatch.teamAway.name}:</span>
                            <span className="text-[#8D9AA3] font-mono-stats">{scorer}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#8D9AA3]">
                        Kickoff scheduled for {selectedMatch.startTime}. Simulated match telemetry and event timeline will update as simulation unfolds.
                      </p>
                    )}
                  </Card>

                  {/* Formations */}
                  {selectedMatch.formationHome && (
                    <Card variant="standard" className="p-4 space-y-2">
                      <h5 className="font-bold text-sm text-[#F6F5F1] font-display">Tactical Formations</h5>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono-stats">
                        <div className="p-2.5 rounded bg-[#171B1E] border border-[#363C42]">
                          <span className="text-[#8D9AA3] block">{selectedMatch.teamHome.name}</span>
                          <span className="font-bold text-[#F6F5F1]">{selectedMatch.formationHome}</span>
                        </div>
                        <div className="p-2.5 rounded bg-[#171B1E] border border-[#363C42]">
                          <span className="text-[#8D9AA3] block">{selectedMatch.teamAway.name}</span>
                          <span className="font-bold text-[#F6F5F1]">{selectedMatch.formationAway}</span>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* SUB-VIEW 2: STATISTICS */}
              {matchDetailsTab === 'stats' && (
                <div className="space-y-4">
                  {selectedMatch.stats?.possession ? (
                    <div className="space-y-4">
                      {/* Possession Bar */}
                      <Card variant="standard" className="p-4 space-y-2">
                        <div className="flex justify-between text-xs font-mono-stats font-bold text-[#F6F5F1]">
                          <span>{selectedMatch.stats.possession[0]}%</span>
                          <span className="font-display font-medium text-[#8D9AA3]">Ball Possession</span>
                          <span>{selectedMatch.stats.possession[1]}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#171B1E] overflow-hidden flex border border-[#363C42]">
                          <div
                            className="h-full bg-[#C6AD7B]"
                            style={{ width: `${selectedMatch.stats.possession[0]}%` }}
                          />
                          <div
                            className="h-full bg-[#E47D5B]"
                            style={{ width: `${selectedMatch.stats.possession[1]}%` }}
                          />
                        </div>
                      </Card>

                      {/* Stat Breakdown Grid */}
                      <Card variant="standard" className="p-4 divide-y divide-[#363C42] text-xs">
                        {[
                          { label: 'Total Shots', val: selectedMatch.stats.shots },
                          { label: 'Shots on Target', val: selectedMatch.stats.shotsOnTarget },
                          { label: 'Corner Kicks', val: selectedMatch.stats.corners },
                          { label: 'Fouls Committed', val: selectedMatch.stats.fouls },
                          { label: 'Yellow Cards', val: selectedMatch.stats.yellowCards },
                          { label: 'Pass Accuracy', val: selectedMatch.stats.passAccuracy },
                        ].map((stat, i) => (
                          <div key={i} className="py-2.5 flex justify-between items-center text-[#F6F5F1] font-mono-stats">
                            <span className="font-bold">{stat.val?.[0]}</span>
                            <span className="font-display text-[#8D9AA3] text-center">{stat.label}</span>
                            <span className="font-bold">{stat.val?.[1]}</span>
                          </div>
                        ))}
                      </Card>
                    </div>
                  ) : selectedMatch.stats?.fieldGoalPct ? (
                    /* Basketball Statistics */
                    <Card variant="standard" className="p-4 divide-y divide-[#363C42] text-xs">
                      {[
                        { label: 'Field Goal %', val: selectedMatch.stats.fieldGoalPct },
                        { label: '3-Point %', val: selectedMatch.stats.threePointPct },
                        { label: 'Total Rebounds', val: selectedMatch.stats.rebounds },
                        { label: 'Assists', val: selectedMatch.stats.assists },
                        { label: 'Turnovers', val: selectedMatch.stats.turnovers },
                      ].map((stat, i) => (
                        <div key={i} className="py-2.5 flex justify-between items-center text-[#F6F5F1] font-mono-stats">
                          <span className="font-bold">{stat.val?.[0]}</span>
                          <span className="font-display text-[#8D9AA3] text-center">{stat.label}</span>
                          <span className="font-bold">{stat.val?.[1]}</span>
                        </div>
                      ))}
                    </Card>
                  ) : selectedMatch.stats?.poleTime ? (
                    /* Motorsport Statistics */
                    <Grid cols={3} gap="md">
                      <Card variant="standard" className="p-4 text-center space-y-1">
                        <span className="text-[10px] text-[#8D9AA3] uppercase">Pole Shootout Time</span>
                        <p className="text-base font-bold text-[#C6AD7B] font-mono-stats">{selectedMatch.stats.poleTime}</p>
                      </Card>
                      <Card variant="standard" className="p-4 text-center space-y-1">
                        <span className="text-[10px] text-[#8D9AA3] uppercase">Track Temperature</span>
                        <p className="text-base font-bold text-[#D9DEE2] font-mono-stats">{selectedMatch.stats.trackTemp}</p>
                      </Card>
                      <Card variant="standard" className="p-4 text-center space-y-1">
                        <span className="text-[10px] text-[#8D9AA3] uppercase">Avg Pit Stop</span>
                        <p className="text-base font-bold text-[#F6F5F1] font-mono-stats">{selectedMatch.stats.pitStopsAvg}</p>
                      </Card>
                    </Grid>
                  ) : (
                    <p className="text-xs text-[#8D9AA3] text-center py-6">
                      Pre-match simulation active. In-depth telemetry and shot maps will calibrate at kickoff.
                    </p>
                  )}
                </div>
              )}

              {/* SUB-VIEW 3: LINEUPS */}
              {matchDetailsTab === 'lineups' && (
                <div className="space-y-4">
                  {selectedMatch.lineupHome && selectedMatch.lineupAway ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Home Lineup */}
                      <Card variant="standard" className="p-4 space-y-3">
                        <h5 className="font-bold text-xs sm:text-sm text-[#F6F5F1] font-display border-b border-[#363C42] pb-2">
                          {selectedMatch.teamHome.name} (Starting Roster)
                        </h5>
                        <ul className="space-y-1.5 text-xs text-[#8D9AA3]">
                          {selectedMatch.lineupHome.map((player, i) => (
                            <li key={i} className="flex items-center justify-between text-[#F6F5F1] font-mono-stats">
                              <span>{player}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>

                      {/* Away Lineup */}
                      <Card variant="standard" className="p-4 space-y-3">
                        <h5 className="font-bold text-xs sm:text-sm text-[#F6F5F1] font-display border-b border-[#363C42] pb-2">
                          {selectedMatch.teamAway.name} (Starting Roster)
                        </h5>
                        <ul className="space-y-1.5 text-xs text-[#8D9AA3]">
                          {selectedMatch.lineupAway.map((player, i) => (
                            <li key={i} className="flex items-center justify-between text-[#F6F5F1] font-mono-stats">
                              <span>{player}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  ) : (
                    <p className="text-xs text-[#8D9AA3] text-center py-6">
                      Sample starting lineups are generated for match simulation.
                    </p>
                  )}
                </div>
              )}

              {/* SUB-VIEW 4: HEAD TO HEAD */}
              {matchDetailsTab === 'h2h' && (
                <div className="space-y-4">
                  {selectedMatch.headToHead ? (
                    <div className="space-y-4">
                      <Card variant="standard" className="p-4 text-center">
                        <span className="text-xs text-[#8D9AA3] uppercase tracking-wider font-display font-semibold">
                          All-Time Competitive Series
                        </span>
                        <div className="flex items-center justify-center gap-6 mt-2 text-sm sm:text-base font-bold font-mono-stats">
                          <span className="text-[#C6AD7B]">{selectedMatch.headToHead.homeWins} Wins</span>
                          <span className="text-[#8D9AA3]">{selectedMatch.headToHead.draws} Draws</span>
                          <span className="text-[#E47D5B]">{selectedMatch.headToHead.awayWins} Wins</span>
                        </div>
                      </Card>

                      <Card variant="standard" className="p-4 space-y-2">
                        <h5 className="font-bold text-xs sm:text-sm text-[#F6F5F1] font-display">Recent Head-to-Head Encounters</h5>
                        <ul className="divide-y divide-[#363C42] text-xs text-[#8D9AA3]">
                          {selectedMatch.headToHead.recentMatches.map((past, i) => (
                            <li key={i} className="py-2.5 flex items-center justify-between text-[#F6F5F1] font-mono-stats">
                              <span>{past}</span>
                              <span className="text-[10px] text-[#8D9AA3]">Simulated UCL Classification</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  ) : (
                    <p className="text-xs text-[#8D9AA3] text-center py-6">
                      Historical match archive calibration in progress.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#363C42] bg-[#1E2327] flex items-center justify-between">
              <span className="text-[11px] text-[#8D9AA3] font-mono-stats">ORVIX Synchronized Multicam Simulation Engine</span>
              <Button size="sm" variant="secondary" onClick={() => setSelectedMatch(null)}>
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TEAM ROSTER VIEW (Modal)
         ========================================================================= */}
      {selectedTeam && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedTeam.name} Squad Roster and Profile`}
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 xs:p-3 sm:p-6 bg-[#0B0D0E]/80 backdrop-blur-md overflow-y-auto animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTeam(null)
          }}
        >
          <div
            className="relative w-full max-w-2xl bg-[#252A2E] border border-[#363C42] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Team Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#363C42] bg-[#1E2327] flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-[#171B1E] flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: teamAccentHex(selectedTeam.accentColor) }}
                >
                  {selectedTeam.shortName}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold font-display text-[#F6F5F1] truncate">
                    {selectedTeam.name}
                  </h3>
                  <p className="text-xs text-[#8D9AA3] truncate">{selectedTeam.league} • Founded {selectedTeam.founded}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="text-[#8D9AA3] hover:text-[#F6F5F1] p-1.5 rounded-lg hover:bg-[#252A2E] transition-colors"
                aria-label="Close team profile"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Team Modal Demonstration Disclaimer Notice */}
            <div className="px-3.5 xs:px-4 py-2 bg-[#171B1E] border-b border-[#363C42] flex items-center justify-between text-[11px] text-[#8D9AA3]">
              <span className="flex items-center gap-1.5 min-w-0 truncate">
                <Info className="w-3.5 h-3.5 text-[#C6AD7B] flex-shrink-0" />
                <span className="truncate">Sample Squad Roster — Demonstration Dataset</span>
              </span>
              <Badge variant="neutral" size="sm" className="flex-shrink-0 ml-2">DEMO PREVIEW</Badge>
            </div>

            {/* Team Modal Info */}
            <div className="p-4 xs:p-5 sm:p-6 overflow-y-auto space-y-4 xs:space-y-5">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 xs:gap-3 text-xs font-mono-stats">
                <div className="p-3 rounded-xl bg-[#171B1E] border border-[#363C42]">
                  <span className="text-[#8D9AA3] block text-[10px]">HEAD COACH</span>
                  <span className="font-bold text-[#F6F5F1] text-sm">{selectedTeam.coach}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#171B1E] border border-[#363C42]">
                  <span className="text-[#8D9AA3] block text-[10px]">HOME ARENA</span>
                  <span className="font-bold text-[#F6F5F1] text-sm truncate block">{selectedTeam.venue}</span>
                </div>
              </div>

              {/* Sample Squad Roster */}
              <Card variant="standard" className="p-4 space-y-3">
                <h4 className="font-bold text-sm text-[#F6F5F1] font-display flex items-center justify-between">
                  <span>Sample Squad Roster &amp; Starting Personnel</span>
                  <Badge variant="steel" size="sm">{selectedTeam.roster.length} Players</Badge>
                </h4>

                <div className="divide-y divide-[#363C42]">
                  {selectedTeam.roster.map((player, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs text-[#F6F5F1]">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono-stats text-[#C6AD7B] w-5 text-right font-bold">
                          #{player.number}
                        </span>
                        <span className="font-semibold">{player.name}</span>
                      </div>
                      <span className="text-[11px] text-[#8D9AA3] font-mono-stats">{player.position}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#363C42] bg-[#1E2327] flex justify-end">
              <Button size="sm" variant="secondary" onClick={() => setSelectedTeam(null)}>
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper to normalize team accent color
function teamAccentHex(color: string): string {
  if (color.startsWith('#')) return color
  return '#C6AD7B'
}
