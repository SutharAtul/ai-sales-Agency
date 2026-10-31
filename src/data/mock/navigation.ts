import type { NavItem } from '@/types'

export const navigation: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'leads', label: 'Hotelier leads', icon: 'building', badge: '24' },
  { id: 'agents', label: 'AI voice agents', icon: 'spark' },
  { id: 'campaigns', label: 'Campaigns', icon: 'megaphone' },
  { id: 'calls', label: 'Call history', icon: 'phone' },
  { id: 'handoffs', label: 'Onboarding handoff', icon: 'handoff', badge: '8' },
  { id: 'followups', label: 'Follow-ups', icon: 'clock', badge: '12' },
  { id: 'team', label: 'Team', icon: 'users' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

