import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Building2,
  Megaphone,
  Sparkles,
  PhoneCall,
  ArrowRightLeft,
  Clock,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react'
import type { PageId } from '@/types'

export type NavCategory =
  | 'Overview'
  | 'Sales'
  | 'AI Calling'
  | 'Human Onboarding'
  | 'Analytics'
  | 'Settings'

export interface NavItemConfig {
  id: PageId
  path: string
  label: string
  shortLabel?: string
  description: string
  icon: LucideIcon
  badge?: string
  badgeVariant?: 'default' | 'success' | 'warning' | 'info'
}

export interface NavSectionConfig {
  category: NavCategory
  items: NavItemConfig[]
}

export const NAV_SECTIONS: NavSectionConfig[] = [
  {
    category: 'Overview',
    items: [
      {
        id: 'overview',
        path: '/overview',
        label: 'Dashboard Overview',
        shortLabel: 'Overview',
        description: 'Key metrics, pipeline health & today’s velocity',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    category: 'Sales',
    items: [
      {
        id: 'leads',
        path: '/leads',
        label: 'Hotelier Leads',
        shortLabel: 'Leads',
        description: 'Qualified hotel prospects and pipeline tracking',
        icon: Building2,
        badge: '24',
        badgeVariant: 'info',
      },
      {
        id: 'campaigns',
        path: '/campaigns',
        label: 'Outreach Campaigns',
        shortLabel: 'Campaigns',
        description: 'Automated AI voice & omnichannel outreach',
        icon: Megaphone,
      },
    ],
  },
  {
    category: 'AI Calling',
    items: [
      {
        id: 'agents',
        path: '/agents',
        label: 'AI Voice Agents',
        shortLabel: 'Voice Agents',
        description: 'Ava, Aria & Dev conversational agent fleet',
        icon: Sparkles,
        badge: '3 Live',
        badgeVariant: 'success',
      },
      {
        id: 'calls',
        path: '/calls',
        label: 'Call Logs & Transcripts',
        shortLabel: 'Call Logs',
        description: 'Recordings, AI summaries & sentiment scores',
        icon: PhoneCall,
      },
    ],
  },
  {
    category: 'Human Onboarding',
    items: [
      {
        id: 'handoffs',
        path: '/handoffs',
        label: 'Onboarding Handoff',
        shortLabel: 'Handoffs',
        description: 'High-intent leads flagged for human specialists',
        icon: ArrowRightLeft,
        badge: '8',
        badgeVariant: 'warning',
      },
      {
        id: 'followups',
        path: '/followups',
        label: 'Follow-up Tasks',
        shortLabel: 'Follow-ups',
        description: 'Scheduled callbacks, demos and check-ins',
        icon: Clock,
        badge: '12',
      },
      {
        id: 'team',
        path: '/team',
        label: 'Sales Team',
        shortLabel: 'Team',
        description: 'Specialists, assigned load & close rates',
        icon: Users,
      },
    ],
  },
  {
    category: 'Analytics',
    items: [
      {
        id: 'analytics',
        path: '/analytics',
        label: 'Pipeline Analytics',
        shortLabel: 'Analytics',
        description: 'Lead conversion ratios, call volume & sources',
        icon: BarChart3,
      },
    ],
  },
  {
    category: 'Settings',
    items: [
      {
        id: 'settings',
        path: '/settings',
        label: 'Agency Settings',
        shortLabel: 'Settings',
        description: 'Calling scripts, rules & workspace configuration',
        icon: Settings,
      },
    ],
  },
]

export interface OperatorProfile {
  name: string
  role: string
  email: string
  initials: string
  status: 'online' | 'busy' | 'away'
  workspace: string
}

export const MOCK_OPERATOR: OperatorProfile = {
  name: 'Atul Sharma',
  role: 'Growth Sales Lead',
  email: 'atul.sharma@jusbid.in',
  initials: 'AS',
  status: 'online',
  workspace: 'JusBid Hospitality · Growth Suite',
}

export function findNavMeta(pageId: PageId) {
  for (const section of NAV_SECTIONS) {
    const item = section.items.find((i) => i.id === pageId)
    if (item) {
      return { category: section.category, item }
    }
  }
  return {
    category: 'Overview' as NavCategory,
    item: NAV_SECTIONS[0].items[0],
  }
}

export function findNavMetaByPath(pathname: string) {
  // Check exact matches or prefixes
  if (pathname === '/' || pathname === '/overview') {
    return { category: 'Overview' as NavCategory, label: 'Dashboard Overview', parentPath: '/overview' }
  }
  if (pathname.startsWith('/leads/')) {
    return { category: 'Sales' as NavCategory, label: 'Lead Details', parentPath: '/leads' }
  }
  if (pathname.startsWith('/calls/')) {
    return { category: 'AI Calling' as NavCategory, label: 'Call Transcript & Recording', parentPath: '/calls' }
  }
  if (pathname.startsWith('/onboarding/')) {
    return { category: 'Human Onboarding' as NavCategory, label: 'Onboarding Details', parentPath: '/handoffs' }
  }

  for (const section of NAV_SECTIONS) {
    const item = section.items.find((i) => pathname === i.path || pathname.startsWith(i.path + '/'))
    if (item) {
      return { category: section.category, label: item.label, parentPath: item.path }
    }
  }

  return {
    category: 'JusBid Agency' as NavCategory,
    label: 'Not Found',
    parentPath: '/overview',
  }
}
