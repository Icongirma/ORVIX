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
import type { BadgeVariant } from '../design-system/components/Badge'

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
  badgeVariant?: BadgeVariant
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
    description: 'Welcome hub, featured sports information, upcoming fixtures, and community highlights.',
  },
  {
    id: 'sports',
    label: 'Sports',
    href: '#sports',
    icon: Trophy,
    badge: 'DEMO',
    badgeVariant: 'champagne',
    category: 'core',
    description: 'Simulated multicam broadcasts, championship tournaments, and sample telemetry scores.',
  },
  {
    id: 'games',
    label: 'Games',
    href: '#games',
    icon: Gamepad2,
    badge: 'HOT',
    badgeVariant: 'champagne',
    category: 'core',
    description: 'Interactive sports entertainment, skill-based challenges, and community competitions.',
  },
  {
    id: 'challenges',
    label: 'Challenges',
    href: '#challenges',
    icon: Flame,
    badge: 'NEW',
    badgeVariant: 'champagne',
    category: 'core',
    description: 'Weekly tournament knowledge sprints, trivia quests, and non-monetary community challenges.',
  },

  // Progression & Community
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    href: '#leaderboard',
    icon: Award,
    category: 'progression',
    description: 'Global fan rankings, seasonal standings, and skill challenge rankings.',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    href: '#achievements',
    icon: Medal,
    badge: '12/48',
    badgeVariant: 'neutral',
    category: 'progression',
    description: 'Earned trophies, season milestones, skill badges, and fan rank collectibles.',
  },

  // Account & Support
  {
    id: 'profile',
    label: 'Profile',
    href: '#profile',
    icon: User,
    category: 'account',
    description: 'Personal profile, activity statistics, broadcast preferences, and fan status.',
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '#help',
    icon: HelpCircle,
    category: 'account',
    description: '24/7 technical assistance, stream troubleshooting, platform guides, and FAQs.',
  },
]

export const NAVIGATION_CATEGORIES = [
  { key: 'core', label: 'Explore & Play' },
  { key: 'progression', label: 'Progression' },
  { key: 'account', label: 'System & Support' },
] as const
