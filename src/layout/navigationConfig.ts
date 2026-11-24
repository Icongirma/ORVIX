import React from 'react'
import {
  Home,
  Trophy,
  Gamepad2,
  Flame,
  Award,
  Medal,
  User,
  HelpCircle,
} from 'lucide-react'

export type NavigationSectionId =
  | 'home'
  | 'sports'
  | 'games'
  | 'challenges'
  | 'leaderboard'
  | 'achievements'
  | 'profile'
  | 'help'

export interface NavSectionItem {
  id: NavigationSectionId
  label: string
  href: string
  icon: React.ElementType
  badge?: string
  badgeVariant?: 'live' | 'gold' | 'blue' | 'neutral'
  category: 'core' | 'progression' | 'account'
  description: string
}

export const NAVIGATION_ITEMS: NavSectionItem[] = [
  // Core Platform
  {
    id: 'home',
    label: 'Home',
    href: '#home',
    icon: Home,
    category: 'core',
    description: 'Welcome hub, featured streams, trending fixtures, and top highlights.',
  },
  {
    id: 'sports',
    label: 'Sports',
    href: '#sports',
    icon: Trophy,
    badge: 'LIVE',
    badgeVariant: 'live',
    category: 'core',
    description: 'Live multicam broadcasts, championship tournaments, and telemetry scores.',
  },
  {
    id: 'games',
    label: 'Games',
    href: '#games',
    icon: Gamepad2,
    badge: 'HOT',
    badgeVariant: 'blue',
    category: 'core',
    description: 'Interactive entertainment, esports arenas, and community tournaments.',
  },
  {
    id: 'challenges',
    label: 'Challenges',
    href: '#challenges',
    icon: Flame,
    badge: 'NEW',
    badgeVariant: 'blue',
    category: 'core',
    description: 'Weekly tournaments, fan quests, and community sports challenges.',
  },

  // Progression & Community
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    href: '#leaderboard',
    icon: Award,
    category: 'progression',
    description: 'Global fan rankings, season standings, and club leaderboards.',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    href: '#achievements',
    icon: Medal,
    badge: '12/48',
    badgeVariant: 'neutral',
    category: 'progression',
    description: 'Earned trophies, season milestones, skill badges, and collectible rewards.',
  },

  // Account & Support
  {
    id: 'profile',
    label: 'Profile',
    href: '#profile',
    icon: User,
    category: 'account',
    description: 'Personal profile, activity statistics, and stream preferences.',
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '#help',
    icon: HelpCircle,
    category: 'account',
    description: '24/7 technical assistance, stream troubleshooting, FAQs, and guides.',
  },
]

export const NAVIGATION_CATEGORIES = [
  { key: 'core', label: 'Explore & Play' },
  { key: 'progression', label: 'Progression' },
  { key: 'account', label: 'System' },
] as const
