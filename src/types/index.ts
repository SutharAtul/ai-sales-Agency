// ─── Core domain types for JusBid AI Sales Agency ───
// NOTE: These are strictly frontend-only demo types for the simulated agency dashboard.
// They do not reflect the internal production JusBid database schema.

export type IconName =
  | 'grid' | 'building' | 'spark' | 'megaphone' | 'phone' | 'handoff'
  | 'clock' | 'users' | 'chart' | 'settings' | 'search' | 'bell'
  | 'arrow' | 'trend' | 'check' | 'more' | 'play' | 'pause'
  | 'calendar' | 'mail' | 'close' | 'filter' | 'plus' | 'chevron'

export type PageId =
  | 'overview' | 'leads' | 'agents' | 'campaigns' | 'calls'
  | 'handoffs' | 'followups' | 'team' | 'analytics' | 'settings'

export type LeadInterest = 'High' | 'Medium' | 'Low' | 'Undecided'

export interface Lead {
  id: string
  name: string
  property: string
  location: string
  city: string
  state: string
  initials: string
  color: string
  score: number
  status: string
  interest: LeadInterest
  source: string
  lastContact: string
  phone: string
  email: string
  rooms: number
  adr?: string
  notes?: string
  createdAt?: string
  assignedCampaignId?: string
  assignedAgentId?: string
}

export type CampaignStatus = 'active' | 'scheduled' | 'paused' | 'completed' | 'draft'

export interface Campaign {
  id: string
  name: string
  description: string
  status: CampaignStatus
  targetAudience: string
  targetRegion: string[]
  audienceSize: number
  callsAttempted: number
  callsConnected: number
  leadsQualified: number
  interestRate: number
  assignedAgentId: string
  assignedAgentName: string
  scheduleWindow: string
  scheduleDays: string[]
  maxAttemptsPerLead: number
  suppressionRules: string[]
  createdAt: string
  isSimulatedDemo: boolean
}

export interface CallTranscriptTurn {
  id: string
  speaker: 'agent' | 'user'
  speakerName: string
  timestamp: string
  text: string
}

export interface CallTechnicalStatus {
  sttModel: string
  llmModel: string
  ttsVoice: string
  latencyMs: number
  sttConfidence: string
  packetLoss: string
  completionReason: string
  sipCode: number
}

export interface Call {
  id: string
  leadId?: string
  name: string
  property: string
  city: string
  phone: string
  time: string
  date: string
  duration: string
  durationSeconds: number
  outcome: string
  agent: string
  agentId: string
  campaign: string
  campaignId: string
  interestClassification: 'High' | 'Medium' | 'Low' | 'Unresponsive'
  intentScore: number
  tone: string
  aiSummary: string
  objections: string[]
  extractedNextAction: string
  technicalStatus: CallTechnicalStatus
  transcript: CallTranscriptTurn[]
  isSimulatedDemo: boolean
}

export interface AgentFaq {
  id: string
  question: string
  answer: string
}

export interface AgentEscalationConfig {
  triggerOnCustomPricing: boolean
  triggerOnNegativeSentiment: boolean
  triggerOnDemoRequest: boolean
  triggerOnMaxQuestions: boolean
  maxUnansweredTurns: number
  primaryHandoffTarget: string
  fallbackAction: 'voicemail' | 'whatsapp' | 'sms'
}

export interface AgentProviderConfig {
  sttProvider: string
  llmModel: string
  ttsVoice: string
  telephonyTrunk: string
  isDemoPlaceholder: boolean
}

export interface AiAgent {
  id: string
  name: string
  role: string
  purpose: string
  language: string
  supportedLanguages: string[]
  voiceTone: string
  isEnabled: boolean
  lastTestStatus: 'Passed' | 'Degraded' | 'Pending'
  lastTestedAt: string
  testLatencyMs: number
  callsCount: number
  qualificationRate: number
  avgDuration: string
  greetingPrompt: string
  approvedPitch: string
  faqs: AgentFaq[]
  escalation: AgentEscalationConfig
  provider: AgentProviderConfig
}

export type HandoffStatus =
  | 'unassigned'
  | 'assigned'
  | 'contacted'
  | 'follow-up required'
  | 'completed'

export interface HandoffNote {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface OnboardingMilestone {
  id: string
  label: string
  description: string
  completed: boolean
  requiresHumanVerification: boolean
  completedAt?: string
  completedBy?: string
}

export interface ContactAttempt {
  id: string
  type: 'call' | 'whatsapp' | 'email' | 'demo'
  outcome: string
  time: string
  agent: string
  notes?: string
}

export interface OnboardingActivity {
  id: string
  title: string
  description: string
  timestamp: string
  actor: string
  type: 'ai' | 'human' | 'system'
}

export interface HandoffItem {
  id: string
  leadId?: string
  callId?: string
  name: string
  property: string
  city: string
  phone: string
  rooms: number
  reason: string
  callSummary: string
  interestLevel: 'High' | 'Medium' | 'Low'
  requestedCallbackWindow: string
  assignedAgentId?: string | null
  assignedAgent: string | null
  assignedAgentRole?: string
  priority: 'High' | 'Medium' | 'Low'
  status: HandoffStatus
  age: string
  time: string
  initials: string
  color: string
  notes: HandoffNote[]
  checklist?: OnboardingMilestone[]
  contactAttempts?: ContactAttempt[]
  activityLog?: OnboardingActivity[]
  createdAt: string
  isSimulatedDemo: boolean
}

export type FollowupStatus = 'due' | 'upcoming' | 'overdue' | 'completed' | 'cancelled'

export interface FollowupItem {
  id: string
  leadId?: string
  handoffId?: string
  assignedAgentId?: string
  name: string
  property: string
  city: string
  phone: string
  assignedAgent: string
  preferredCallbackWindow: string
  scheduledDate: string
  scheduledTime: string
  reason: string
  priority: 'High' | 'Medium' | 'Low'
  status: FollowupStatus
  taskType: string
  initials: string
  color: string
  notes?: string
  completedAt?: string
  completionOutcome?: string
  time: string
  type: string
  isSimulatedDemo: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  initials: string
  color: string
  assigned: number
  inProgress?: number
  closed: number
  rate: number
  status: string
  focus?: string
  avgSpeed?: string
  assignedProperties?: string[]
}

export interface NavItem {
  id: PageId
  label: string
  icon: IconName
  badge?: string
}

