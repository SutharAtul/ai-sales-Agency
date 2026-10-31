export interface OverviewMetrics {
  callsAttempted: {
    value: string
    raw: number
    change: string
    trend: 'positive' | 'negative' | 'neutral'
    note: string
  }
  connectedCalls: {
    value: string
    raw: number
    rate: string
    change: string
    trend: 'positive' | 'negative' | 'neutral'
    note: string
  }
  interestedHoteliers: {
    value: string
    raw: number
    rate: string
    change: string
    trend: 'positive' | 'negative' | 'neutral'
    note: string
  }
  qualifiedLeads: {
    value: string
    raw: number
    change: string
    trend: 'positive' | 'negative' | 'neutral'
    note: string
  }
  pendingHandoffs: {
    value: string
    raw: number
    urgency: string
    change: string
    trend: 'positive' | 'negative' | 'neutral'
    note: string
  }
  conversionRate: {
    value: string
    rate: number
    change: string
    trend: 'positive' | 'negative' | 'neutral'
    note: string
  }
}

export const OVERVIEW_METRICS: OverviewMetrics = {
  callsAttempted: {
    value: '3,612',
    raw: 3612,
    change: '+18.4%',
    trend: 'positive',
    note: 'vs. previous 30 days',
  },
  connectedCalls: {
    value: '2,754',
    raw: 2754,
    rate: '76.2%',
    change: '+4.1%',
    trend: 'positive',
    note: '76.2% connect rate',
  },
  interestedHoteliers: {
    value: '942',
    raw: 942,
    rate: '34.2%',
    change: '+22.1%',
    trend: 'positive',
    note: '34.2% of connected calls',
  },
  qualifiedLeads: {
    value: '486',
    raw: 486,
    change: '+8.2%',
    trend: 'positive',
    note: 'Ready for demonstration',
  },
  pendingHandoffs: {
    value: '8',
    raw: 8,
    urgency: 'High Priority',
    change: '48 completed',
    trend: 'neutral',
    note: 'Avg response: 18 min',
  },
  conversionRate: {
    value: '13.5%',
    rate: 13.5,
    change: '+2.1%',
    trend: 'positive',
    note: 'Calls to qualified pipeline',
  },
}

export interface FunnelStep {
  id: string
  label: string
  sublabel: string
  count: number
  formattedCount: string
  percentage: number
  conversionFromPrev?: string
  color: string
}

export const LEAD_FUNNEL_STEPS: FunnelStep[] = [
  {
    id: 'attempted',
    label: '1. Outbound Calls Attempted',
    sublabel: 'Autonomous outreach by Ava, Aria & Dev',
    count: 3612,
    formattedCount: '3,612',
    percentage: 100,
    color: 'bg-indigo-600',
  },
  {
    id: 'connected',
    label: '2. Connected Conversations',
    sublabel: 'Decision-maker answered & verified identity',
    count: 2754,
    formattedCount: '2,754',
    percentage: 76.2,
    conversionFromPrev: '76.2% connect rate',
    color: 'bg-indigo-500',
  },
  {
    id: 'interested',
    label: '3. Direct-Booking Interest Expressed',
    sublabel: 'Expressed need to reduce 18–25% OTA commissions',
    count: 942,
    formattedCount: '942',
    percentage: 26.1,
    conversionFromPrev: '34.2% of connected',
    color: 'bg-sky-500',
  },
  {
    id: 'qualified',
    label: '4. AI Voice Qualified Prospects',
    sublabel: 'Verified inventory, rate parity & key volume',
    count: 486,
    formattedCount: '486',
    percentage: 13.5,
    conversionFromPrev: '51.6% of interested',
    color: 'bg-emerald-500',
  },
  {
    id: 'handoffs',
    label: '5. Demos Booked & Specialist Handoffs',
    sublabel: 'Screen share scheduled or live transfer completed',
    count: 186,
    formattedCount: '186',
    percentage: 5.1,
    conversionFromPrev: '38.3% of qualified',
    color: 'bg-emerald-600',
  },
]

export interface DailyActivityPoint {
  date: string
  dayLabel: string
  attempted: number
  connected: number
  qualified: number
}

export const CALL_ACTIVITY_14_DAYS: DailyActivityPoint[] = [
  { date: '2026-10-15', dayLabel: 'Oct 15', attempted: 220, connected: 168, qualified: 31 },
  { date: '2026-10-16', dayLabel: 'Oct 16', attempted: 245, connected: 184, qualified: 34 },
  { date: '2026-10-17', dayLabel: 'Oct 17', attempted: 260, connected: 201, qualified: 38 },
  { date: '2026-10-18', dayLabel: 'Oct 18', attempted: 190, connected: 142, qualified: 25 },
  { date: '2026-10-19', dayLabel: 'Oct 19', attempted: 160, connected: 120, qualified: 21 },
  { date: '2026-10-20', dayLabel: 'Oct 20', attempted: 280, connected: 218, qualified: 42 },
  { date: '2026-10-21', dayLabel: 'Oct 21', attempted: 295, connected: 229, qualified: 45 },
  { date: '2026-10-22', dayLabel: 'Oct 22', attempted: 310, connected: 241, qualified: 48 },
  { date: '2026-10-23', dayLabel: 'Oct 23', attempted: 325, connected: 253, qualified: 51 },
  { date: '2026-10-24', dayLabel: 'Oct 24', attempted: 290, connected: 222, qualified: 44 },
  { date: '2026-10-25', dayLabel: 'Oct 25', attempted: 210, connected: 158, qualified: 29 },
  { date: '2026-10-26', dayLabel: 'Oct 26', attempted: 275, connected: 212, qualified: 41 },
  { date: '2026-10-27', dayLabel: 'Oct 27', attempted: 322, connected: 248, qualified: 49 },
  { date: '2026-10-28', dayLabel: 'Today', attempted: 230, connected: 178, qualified: 36 },
]

export interface CampaignSummary {
  id: string
  name: string
  cluster: string
  agent: string
  agentInitials: string
  progress: number
  callsMade: number
  qualifiedLeads: number
  status: 'active' | 'scheduled'
  conversionRate: string
}

export const CAMPAIGN_SUMMARIES: CampaignSummary[] = [
  {
    id: 'north-india',
    name: 'North India Independent Heritage Blitz',
    cluster: 'Jaipur, Udaipur, Jodhpur & Shimla (48–80 keys)',
    agent: 'Ava · Lead Qualifier',
    agentInitials: 'AV',
    progress: 68,
    callsMade: 1248,
    qualifiedLeads: 186,
    status: 'active',
    conversionRate: '14.9%',
  },
  {
    id: 'goa-coastal',
    name: 'Goa Coastal Villa & Boutique Re-engagement',
    cluster: 'North & South Goa Luxury Resorts (20–60 keys)',
    agent: 'Aria · Concierge Specialist',
    agentInitials: 'AR',
    progress: 42,
    callsMade: 624,
    qualifiedLeads: 92,
    status: 'active',
    conversionRate: '14.7%',
  },
  {
    id: 'kerala-retreats',
    name: 'South India Boutique & Eco-Retreat Launch',
    cluster: 'Kochi, Wayanad & Munnar (15–45 keys)',
    agent: 'Dev · Follow-up Specialist',
    agentInitials: 'DV',
    progress: 15,
    callsMade: 240,
    qualifiedLeads: 32,
    status: 'active',
    conversionRate: '13.3%',
  },
]

