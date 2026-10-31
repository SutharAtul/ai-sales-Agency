export interface SettingsRolePermission {
  id: string
  name: string
  description: string
  admin: boolean
  salesAgent: boolean
  onboardingSpecialist: boolean
  auditor: boolean
}

export interface SettingsTeamMember {
  id: string
  name: string
  role: 'Admin' | 'Sales Director' | 'Senior Onboarding Specialist' | 'Integration Lead' | 'Auditor'
  email: string
  phone: string
  status: 'Active' | 'Invited' | 'Suspended'
  lastActive: string
  avatarColor: string
}

export interface ApprovedClaim {
  id: string
  claim: string
  category: 'Pricing' | 'Value Proposition' | 'Product Control' | 'Compliance'
  verificationSource: string
  isApproved: boolean
}

export interface ProhibitedClaim {
  id: string
  claim: string
  reason: string
  riskLevel: 'Critical' | 'High' | 'Medium'
}

export interface ApprovedFAQ {
  id: string
  question: string
  answer: string
  category: 'Commission & Payouts' | 'Guest Bidding Mechanics' | 'PMS Integration' | 'Contract Terms'
  lastUpdated: string
}

export interface BlacklistEntry {
  id: string
  phone: string
  property: string
  reason: string
  addedBy: string
  addedAt: string
  status: 'Permanent' | '90-Day Cooldown'
}

export interface IntegrationService {
  id: string
  name: string
  category: 'Voice Telephony' | 'CRM Sync' | 'Messaging' | 'PMS Channel Manager' | 'Webhooks'
  provider: string
  status: 'demo_active' | 'disabled' | 'sandbox_ready'
  statusLabel: string
  description: string
  latencyOrVersion: string
  requiresBackend: boolean
  backendRequirementNotice: string
  maskedEndpoint?: string
  maskedToken?: string
}

// ─── Initial Mock Data ───

export const MOCK_SETTINGS_TEAM_MEMBERS: SettingsTeamMember[] = [
  {
    id: 'user-vikram',
    name: 'Vikramaditya Rathore',
    role: 'Admin',
    email: 'vikram.rathore@jusbid-demo.in',
    phone: '+91 99999 00010',
    status: 'Active',
    lastActive: '10 mins ago',
    avatarColor: 'indigo',
  },
  {
    id: 'user-neha',
    name: 'Neha Sharma',
    role: 'Senior Onboarding Specialist',
    email: 'neha.sharma@jusbid-demo.in',
    phone: '+91 99999 00051',
    status: 'Active',
    lastActive: 'Just now',
    avatarColor: 'rose',
  },
  {
    id: 'user-arjun',
    name: 'Arjun Patel',
    role: 'Integration Lead',
    email: 'arjun.patel@jusbid-demo.in',
    phone: '+91 99999 00052',
    status: 'Active',
    lastActive: '25 mins ago',
    avatarColor: 'blue',
  },
  {
    id: 'user-sara',
    name: 'Sara Thomas',
    role: 'Senior Onboarding Specialist',
    email: 'sara.thomas@jusbid-demo.in',
    phone: '+91 99999 00053',
    status: 'Active',
    lastActive: '1 hour ago',
    avatarColor: 'emerald',
  },
  {
    id: 'user-kavita',
    name: 'Kavita Menon',
    role: 'Auditor',
    email: 'kavita.menon@jusbid-demo.in',
    phone: '+91 99999 00054',
    status: 'Active',
    lastActive: '3 hours ago',
    avatarColor: 'amber',
  },
]

export const MOCK_PERMISSIONS_MATRIX: SettingsRolePermission[] = [
  {
    id: 'perm-campaigns',
    name: 'Launch Outbound Voice Campaigns',
    description: 'Trigger autonomous calling batch runs across filtered prospect lists',
    admin: true,
    salesAgent: true,
    onboardingSpecialist: false,
    auditor: false,
  },
  {
    id: 'perm-prompts',
    name: 'Edit AI Agent Pitch & Prompt Guidelines',
    description: 'Modify greeting, approved claims, and negotiation floor rules',
    admin: true,
    salesAgent: false,
    onboardingSpecialist: false,
    auditor: false,
  },
  {
    id: 'perm-reassign',
    name: 'Reassign Leads & Onboarding Queues',
    description: 'Change human specialist ownership and callback priorities',
    admin: true,
    salesAgent: true,
    onboardingSpecialist: true,
    auditor: false,
  },
  {
    id: 'perm-onboard',
    name: 'Certify Onboarding Completion',
    description: 'Sign off on hotel inventory sync and grant JusBid marketplace live status',
    admin: true,
    salesAgent: false,
    onboardingSpecialist: true,
    auditor: false,
  },
  {
    id: 'perm-telephony',
    name: 'Manage SIP Trunks & DND Blacklist',
    description: 'Update suppression lists and telephony dialing rate limits',
    admin: true,
    salesAgent: false,
    onboardingSpecialist: false,
    auditor: false,
  },
  {
    id: 'perm-audit',
    name: 'Export Call Logs & Compliance Transcripts',
    description: 'Download audio recordings and legal consent verification records',
    admin: true,
    salesAgent: true,
    onboardingSpecialist: true,
    auditor: true,
  },
]

export const MOCK_APPROVED_CLAIMS: ApprovedClaim[] = [
  {
    id: 'claim-1',
    claim: 'JusBid charges a flat 4% success commission on booked stays, compared to 18-24% on conventional OTAs.',
    category: 'Pricing',
    verificationSource: 'JusBid Commercial Schedule 2026',
    isApproved: true,
  },
  {
    id: 'claim-2',
    claim: 'Hoteliers maintain 100% real-time control over their room floor price; no bid below the floor is ever accepted.',
    category: 'Product Control',
    verificationSource: 'Bidding Engine Spec v2.4',
    isApproved: true,
  },
  {
    id: 'claim-3',
    claim: 'All guest bids require verified UPI / credit card pre-authorization before reaching the hotelier dashboard.',
    category: 'Value Proposition',
    verificationSource: 'Payments Architecture Doc',
    isApproved: true,
  },
  {
    id: 'claim-4',
    claim: 'Zero listing or onboarding setup fees; payment is strictly performance-based upon confirmed guest check-in.',
    category: 'Pricing',
    verificationSource: 'Partner Agreement v4.1',
    isApproved: true,
  },
  {
    id: 'claim-5',
    claim: 'JusBid respects brand-rate parity and does not publish public discount undercut rates on aggregator meta-search.',
    category: 'Compliance',
    verificationSource: 'Legal Compliance Audit Q2-2026',
    isApproved: true,
  },
]

export const MOCK_PROHIBITED_CLAIMS: ProhibitedClaim[] = [
  {
    id: 'prohib-1',
    claim: 'Never guarantee 100% room occupancy or immediate sold-out status for any seasonal dates.',
    reason: 'Violates truthful advertising standards and creates breach of contract liability.',
    riskLevel: 'Critical',
  },
  {
    id: 'prohib-2',
    claim: 'Never promise specific monthly revenue figures without prior property ADR audit by human sales lead.',
    reason: 'Unverified financial forecasts misrepresent typical onboarding yields.',
    riskLevel: 'High',
  },
  {
    id: 'prohib-3',
    claim: 'Never disparage specific OTA executives, competitor account managers, or mention private disputes.',
    reason: 'Anti-defamation and industry professional conduct policy.',
    riskLevel: 'High',
  },
  {
    id: 'prohib-4',
    claim: 'Never execute oral binding contracts or state that an AI call constitutes a finalized partnership.',
    reason: 'Indian Contract Act compliance requires authorized human onboarding certification.',
    riskLevel: 'Critical',
  },
]

export const MOCK_APPROVED_FAQS: ApprovedFAQ[] = [
  {
    id: 'faq-1',
    question: 'How does the guest bidding mechanic work on JusBid?',
    answer: 'Guests specify travel dates and room tier, then submit a binding price offer. If the offer is at or above your private minimum floor rate, the reservation is confirmed instantly with full payment pre-authorized.',
    category: 'Guest Bidding Mechanics',
    lastUpdated: '15 Oct 2026',
  },
  {
    id: 'faq-2',
    question: 'When and how are payouts transferred to the hotel?',
    answer: 'Payouts are settled directly via automated NEFT/RTGS to the hotel commercial bank account within 24 hours of guest check-out, deducting only the 4% platform processing commission.',
    category: 'Commission & Payouts',
    lastUpdated: '18 Oct 2026',
  },
  {
    id: 'faq-3',
    question: 'Do we need to abandon our existing OTA relationships to join JusBid?',
    answer: 'No. JusBid operates as a complementary direct-demand discovery channel to fill distress inventory and weekday vacancies without violating existing OTA agreements or public rate parity.',
    category: 'Contract Terms',
    lastUpdated: '20 Oct 2026',
  },
  {
    id: 'faq-4',
    question: 'How do you integrate with our existing Property Management System (PMS)?',
    answer: 'JusBid connects via standard channel manager APIs (e.g., RateGain, Staah, eZee Technosys). Our onboarding engineer sets up two-way inventory and ARI sync during your scheduled 30-minute technical onboarding call.',
    category: 'PMS Integration',
    lastUpdated: '22 Oct 2026',
  },
]

export const MOCK_BLACKLIST_ENTRIES: BlacklistEntry[] = [
  {
    id: 'bl-1',
    phone: '+91 99999 00091',
    property: 'Rajputana Heritage Haveli (Simulated)',
    reason: 'Hotelier requested explicit permanent DND during intro call',
    addedBy: 'Aarti (Voice Agent)',
    addedAt: '24 Oct 2026',
    status: 'Permanent',
  },
  {
    id: 'bl-2',
    phone: '+91 99999 00092',
    property: 'Ocean Breeze Villa Morjim (Simulated)',
    reason: 'Under renovation until Q1 2027; requested 90-day cooldown',
    addedBy: 'Sara Thomas',
    addedAt: '26 Oct 2026',
    status: '90-Day Cooldown',
  },
  {
    id: 'bl-3',
    phone: '+91 99999 00093',
    property: 'Tech Residency Whitefield (Simulated)',
    reason: 'Corporate franchise policy requires central headquarter approval',
    addedBy: 'Arjun Patel',
    addedAt: '27 Oct 2026',
    status: '90-Day Cooldown',
  },
]

export const MOCK_INTEGRATIONS: IntegrationService[] = [
  {
    id: 'int-telephony',
    name: 'Voice Telephony & SIP Trunking',
    category: 'Voice Telephony',
    provider: 'Simulated WebRTC / SIP Carrier (Mock OmniDimension)',
    status: 'demo_active',
    statusLabel: 'Demo Sandbox Active',
    description: 'Low-latency SIP trunk simulation with synthetic Indian regional voice models and real-time audio playback.',
    latencyOrVersion: 'Latency: ~320ms | 25 Virtual Channels',
    requiresBackend: true,
    backendRequirementNotice: 'Live telecommunications require production Twilio/Exotel SIP trunks and TRAI-certified caller IDs.',
    maskedEndpoint: 'sip.trunk.sandbox.jusbid-telephony.internal:5060',
    maskedToken: '••••••••••••••••••••••••••••••••',
  },
  {
    id: 'int-crm',
    name: 'JusBid Pipeline Core Store',
    category: 'CRM Sync',
    provider: 'In-Memory State / Local Mock Database',
    status: 'demo_active',
    statusLabel: 'Frontend Mock Connected',
    description: 'In-memory relational store maintaining leads, calls, handoff tickets, and onboarding checklists for the local session.',
    latencyOrVersion: 'v2.8-frontend-mock',
    requiresBackend: true,
    backendRequirementNotice: 'Production persistence requires Postgres/Prisma DB cluster and multi-tenant authentication microservice.',
  },
  {
    id: 'int-whatsapp',
    name: 'WhatsApp Business API (WABA)',
    category: 'Messaging',
    provider: 'Meta Business / Gupshup Cloud API',
    status: 'disabled',
    statusLabel: 'Disabled (Production Credentials Required)',
    description: 'Automated post-call confirmation brochures, deck PDFs, and meeting calendar invitations sent directly to hotelier WhatsApp.',
    latencyOrVersion: 'API v18.0',
    requiresBackend: true,
    backendRequirementNotice: 'Requires verified Meta Business Manager ID, WABA approved templates, and webhook ingress server.',
    maskedEndpoint: 'https://graph.facebook.com/v18.0/waba-mock-endpoint',
    maskedToken: '••••••••••••••••••••••••••••••••',
  },
  {
    id: 'int-pms',
    name: 'PMS Channel Manager Hub',
    category: 'PMS Channel Manager',
    provider: 'RateGain / Staah / eZee Sandbox Mock',
    status: 'sandbox_ready',
    statusLabel: 'Sandbox Ready (Mock Only)',
    description: 'Two-way Availability, Rates, and Inventory (ARI) sync adapter to verify hotelier room counts and floor rates.',
    latencyOrVersion: 'OTA ARI Spec 2026.1',
    requiresBackend: true,
    backendRequirementNotice: 'Real-time property reservation sync requires certified 2-way OTA channel manager partner credentials.',
    maskedEndpoint: 'https://ari-sandbox.channelmanager-demo.net/v2/pull',
    maskedToken: '••••••••••••••••••••••••••••••••',
  },
  {
    id: 'int-webhook-qual',
    name: 'Lead Qualified Webhook',
    category: 'Webhooks',
    provider: 'Internal Event Bus / Webhook Dispatcher',
    status: 'sandbox_ready',
    statusLabel: 'Mock Webhook Registered',
    description: 'Emits an event payload whenever an AI voice call reaches >80 intent score and hot human handoff criteria.',
    latencyOrVersion: 'HTTP POST / JSON',
    requiresBackend: true,
    backendRequirementNotice: 'Outbound webhook worker with retry queuing (BullMQ/Redis) and HMAC-SHA256 signature verification.',
    maskedEndpoint: 'https://api.jusbid-demo.in/v1/webhooks/leads/qualified',
    maskedToken: '••••••••••••••••••••••••••••••••',
  },
  {
    id: 'int-webhook-calls',
    name: 'Call Completion & Transcript Ingest',
    category: 'Webhooks',
    provider: 'Voice Ingest Gateway',
    status: 'sandbox_ready',
    statusLabel: 'Mock Webhook Registered',
    description: 'Pushes simulated audio recordings, STT transcripts, sentiment classifications, and objection summaries after each call.',
    latencyOrVersion: 'HTTP POST / JSON',
    requiresBackend: true,
    backendRequirementNotice: 'Audio ingestion pipeline with S3/GCS media bucket storage and secure streaming encryption.',
    maskedEndpoint: 'https://api.jusbid-demo.in/v1/webhooks/calls/completed',
    maskedToken: '••••••••••••••••••••••••••••••••',
  },
]

