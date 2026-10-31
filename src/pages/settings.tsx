import { useState } from 'react'
import { PageHeader } from '@/components'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Ban,
  PhoneForwarded,
  Bell,
  Cpu,
  AlertTriangle,
  Plus,
  Trash2,
  Lock,
  Server,
  Check,
  Search,
  Save,
  RotateCcw,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import {
  MOCK_SETTINGS_TEAM_MEMBERS,
  MOCK_PERMISSIONS_MATRIX,
  MOCK_APPROVED_CLAIMS,
  MOCK_PROHIBITED_CLAIMS,
  MOCK_APPROVED_FAQS,
  MOCK_BLACKLIST_ENTRIES,
  MOCK_INTEGRATIONS,
  type SettingsTeamMember,
  type ApprovedClaim,
  type ApprovedFAQ,
  type BlacklistEntry,
} from '@/data/mock/settings'

type TabType =
  | 'team'
  | 'policies'
  | 'claims'
  | 'hours'
  | 'suppression'
  | 'callbacks'
  | 'notifications'
  | 'integrations'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('team')

  // Notification / Toast Feedback
  const [saveStatus, setSaveStatus] = useState<{
    message: string
    type: 'success' | 'info'
  } | null>(null)

  // 1. Team & Roles State
  const [teamMembers, setTeamMembers] = useState<SettingsTeamMember[]>(MOCK_SETTINGS_TEAM_MEMBERS)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberRole, setNewMemberRole] = useState<SettingsTeamMember['role']>('Senior Onboarding Specialist')
  const [inviteError, setInviteError] = useState('')

  // 2. AI Policies State
  const [maxDiscount, setMaxDiscount] = useState('15%')
  const [rateParityEnabled, setRateParityEnabled] = useState(true)
  const [commissionStructure, setCommissionStructure] = useState('4% platform fee vs 18-24% OTA')
  const [escalationThreshold, setEscalationThreshold] = useState('80')
  const [blockAutonomousContract, setBlockAutonomousContract] = useState(true)
  const [personaTone, setPersonaTone] = useState('Professional Indian Hospitality Specialist')

  // 3. Claims & FAQs State
  const [approvedClaims, setApprovedClaims] = useState<ApprovedClaim[]>(MOCK_APPROVED_CLAIMS)
  const [approvedFaqs, setApprovedFaqs] = useState<ApprovedFAQ[]>(MOCK_APPROVED_FAQS)
  const [claimSearch, setClaimSearch] = useState('')
  const [addClaimModalOpen, setAddClaimModalOpen] = useState(false)
  const [newClaimText, setNewClaimText] = useState('')
  const [newClaimCategory, setNewClaimCategory] = useState<ApprovedClaim['category']>('Pricing')
  const [newClaimSource, setNewClaimSource] = useState('')
  const [addFaqModalOpen, setAddFaqModalOpen] = useState(false)
  const [newFaqQuestion, setNewFaqQuestion] = useState('')
  const [newFaqAnswer, setNewFaqAnswer] = useState('')
  const [newFaqCategory, setNewFaqCategory] = useState<ApprovedFAQ['category']>('Commission & Payouts')

  // 4. Calling Hours State
  const [earliestHour, setEarliestHour] = useState('10:00 AM')
  const [latestHour, setLatestHour] = useState('07:30 PM')
  const [activeDays, setActiveDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  const [lunchThrottle, setLunchThrottle] = useState(true)
  const [holidaySuppression, setHolidaySuppression] = useState(true)

  // 5. Suppression State
  const [traiFilter, setTraiFilter] = useState(true)
  const [optOutCooldown, setOptOutCooldown] = useState('90 Days')
  const [maxDailyAttempts, setMaxDailyAttempts] = useState('2')
  const [minHoursBetween, setMinHoursBetween] = useState('4')
  const [maxLifetimeAttempts, setMaxLifetimeAttempts] = useState('5')
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(MOCK_BLACKLIST_ENTRIES)
  const [addBlacklistModalOpen, setAddBlacklistModalOpen] = useState(false)
  const [newBlacklistPhone, setNewBlacklistPhone] = useState('')
  const [newBlacklistProperty, setNewBlacklistProperty] = useState('')
  const [newBlacklistReason, setNewBlacklistReason] = useState('')
  const [newBlacklistStatus, setNewBlacklistStatus] = useState<'Permanent' | '90-Day Cooldown'>('90-Day Cooldown')
  const [blacklistError, setBlacklistError] = useState('')

  // 6. Callback Rules State
  const [urgentSla, setUrgentSla] = useState('4 business hours')
  const [standardSla, setStandardSla] = useState('24 business hours')
  const [rescheduleWindow, setRescheduleWindow] = useState('Next Business Day (11:00 AM – 01:00 PM IST)')
  const [maxAutoReschedules, setMaxAutoReschedules] = useState('3')
  const [routingStrategy, setRoutingStrategy] = useState('Territory & Regional Specialization')
  const [supervisorEscalation, setSupervisorEscalation] = useState(true)

  // 7. Notification Rules State
  const [hotLeadAlert, setHotLeadAlert] = useState(true)
  const [techDropAlert, setTechDropAlert] = useState(true)
  const [dailyDigest, setDailyDigest] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [inAppAlerts, setInAppAlerts] = useState(true)
  const [emailRecipient, setEmailRecipient] = useState('ops@jusbid-demo.in')
  const [slackChannel, setSlackChannel] = useState('#sales-handoffs-demo')

  // Save changes handler
  const handleSaveChanges = () => {
    setSaveStatus({
      type: 'success',
      message: 'Demo configuration updated in local state. (Note: Live fleet synchronization requires backend API integration).',
    })
    setTimeout(() => {
      setSaveStatus(null)
    }, 6000)
  }

  // Reset to defaults
  const handleResetDefaults = () => {
    setTeamMembers(MOCK_SETTINGS_TEAM_MEMBERS)
    setApprovedClaims(MOCK_APPROVED_CLAIMS)
    setApprovedFaqs(MOCK_APPROVED_FAQS)
    setBlacklist(MOCK_BLACKLIST_ENTRIES)
    setMaxDiscount('15%')
    setRateParityEnabled(true)
    setEscalationThreshold('80')
    setEarliestHour('10:00 AM')
    setLatestHour('07:30 PM')
    setActiveDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
    setLunchThrottle(true)
    setHolidaySuppression(true)
    setTraiFilter(true)
    setOptOutCooldown('90 Days')
    setMaxDailyAttempts('2')
    setMaxLifetimeAttempts('5')
    setUrgentSla('4 business hours')
    setStandardSla('24 business hours')
    setHotLeadAlert(true)
    setSaveStatus({
      type: 'info',
      message: 'Settings reset to factory demo presets.',
    })
    setTimeout(() => {
      setSaveStatus(null)
    }, 4000)
  }

  // Handle invite member
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      setInviteError('Please provide a name and email address.')
      return
    }
    if (!newMemberEmail.includes('@')) {
      setInviteError('Please enter a valid email address.')
      return
    }

    const newMember: SettingsTeamMember = {
      id: `user-sim-${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      phone: '+91 99999 00099',
      role: newMemberRole,
      status: 'Invited',
      lastActive: 'Never (Pending invite)',
      avatarColor: 'teal',
    }

    setTeamMembers((prev) => [...prev, newMember])
    setNewMemberName('')
    setNewMemberEmail('')
    setInviteError('')
    setInviteModalOpen(false)
    setSaveStatus({
      type: 'success',
      message: `Simulated invitation sent to ${newMember.email} (Demo only).`,
    })
  }

  // Handle add claim
  const handleAddClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClaimText.trim()) return

    const newClaim: ApprovedClaim = {
      id: `claim-${Date.now()}`,
      claim: newClaimText.trim(),
      category: newClaimCategory,
      verificationSource: newClaimSource.trim() || 'Internal Sales Policy 2026',
      isApproved: true,
    }

    setApprovedClaims((prev) => [newClaim, ...prev])
    setNewClaimText('')
    setNewClaimSource('')
    setAddClaimModalOpen(false)
    setSaveStatus({
      type: 'success',
      message: 'New approved claim added to local policy rules.',
    })
  }

  // Handle add FAQ
  const handleAddFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return

    const newFaq: ApprovedFAQ = {
      id: `faq-${Date.now()}`,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
      category: newFaqCategory,
      lastUpdated: 'Today (Demo)',
    }

    setApprovedFaqs((prev) => [newFaq, ...prev])
    setNewFaqQuestion('')
    setNewFaqAnswer('')
    setAddFaqModalOpen(false)
    setSaveStatus({
      type: 'success',
      message: 'New approved FAQ added to voice knowledge base (Demo state).',
    })
  }

  // Handle add blacklist
  const handleAddBlacklistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlacklistPhone.trim() || !newBlacklistReason.trim()) {
      setBlacklistError('Phone number and suppression reason are required.')
      return
    }

    const newEntry: BlacklistEntry = {
      id: `bl-${Date.now()}`,
      phone: newBlacklistPhone.trim(),
      property: newBlacklistProperty.trim() || 'Independent Hotelier (Direct Opt-out)',
      reason: newBlacklistReason.trim(),
      addedBy: 'Compliance Admin (Demo)',
      addedAt: 'Today',
      status: newBlacklistStatus,
    }

    setBlacklist((prev) => [newEntry, ...prev])
    setNewBlacklistPhone('')
    setNewBlacklistProperty('')
    setNewBlacklistReason('')
    setBlacklistError('')
    setAddBlacklistModalOpen(false)
    setSaveStatus({
      type: 'success',
      message: `Added ${newEntry.phone} to demo suppression blacklist.`,
    })
  }

  // Filter approved claims
  const filteredClaims = approvedClaims.filter(
    (c) =>
      c.claim.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(claimSearch.toLowerCase())
  )

  interface NavItemConfig {
    id: TabType
    label: string
    icon: LucideIcon
    count?: number
    badge?: string
  }

  const navItems: NavItemConfig[] = [
    { id: 'team', label: 'Team & Roles', icon: Users, count: teamMembers.length },
    { id: 'policies', label: 'AI Sales Policies', icon: ShieldCheck },
    { id: 'claims', label: 'Approved Claims & FAQs', icon: CheckCircle2, count: approvedClaims.length },
    { id: 'hours', label: 'Calling Hours', icon: Clock },
    { id: 'suppression', label: 'Suppression & DND', icon: Ban, count: blacklist.length },
    { id: 'callbacks', label: 'Callback Rules', icon: PhoneForwarded },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integration Status', icon: Cpu, badge: 'Demo' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="AGENCY GOVERNANCE & ARCHITECTURE"
        title="Agency Settings & Guardrails"
        description="Manage voice AI sales boundaries, permitted calling windows, team roles, NDNC suppression, and integration endpoints."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResetDefaults}>
            <RotateCcw className="mr-1.5 size-3.5" />
            Reset Defaults
          </Button>
          <Button size="sm" onClick={handleSaveChanges}>
            <Save className="mr-1.5 size-3.5" />
            Save Changes
          </Button>
        </div>
      </PageHeader>

      {/* Save / Feedback Banner */}
      {saveStatus && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 text-xs animate-in fade-in slide-in-from-top-2 duration-200 ${
            saveStatus.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
              : 'border-blue-500/30 bg-blue-500/10 text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-emerald-400" />
            <span>{saveStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveStatus(null)}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Global Configuration Mode Notice */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-medium text-foreground">Client Sandbox Mode Active</span>
          <span className="text-muted-foreground">
            — Values modify local browser state for testing. Live voice agent enforcement requires backend deployment.
          </span>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="text-[11px] font-mono border-amber-500/40 text-amber-300 bg-amber-500/10">
            Backend Support Required for Production
          </Badge>
        </div>
      </div>

      {/* Settings Layout: Tabs Navigation + Content Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation Sidebar */}
        <div className="space-y-1 rounded-xl border border-border bg-card p-2 lg:col-span-1 h-fit">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Configuration Sections
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`size-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                      isActive
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-emerald-500/15 text-emerald-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="space-y-6 lg:col-span-3">
          {/* ────────────────── TAB 1: TEAM MEMBERS & ROLES ────────────────── */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Backend Requirement Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-300">Requires Backend Support</span>
                    <Badge variant="outline" className="border-amber-400/40 text-amber-300 text-[10px] uppercase">
                      Identity & RBAC Service
                    </Badge>
                  </div>
                  <p className="text-amber-200/80 leading-relaxed">
                    User authentication, session tokens, multi-tenant workspace isolation, and cryptographically verified role permissions require backend identity management (e.g. Supabase Auth, Clerk, or OAuth2 service). Currently operating in frontend demo state.
                  </p>
                </div>
              </div>

              {/* Team Members List */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Team Members & Access Levels</h3>
                    <p className="text-xs text-muted-foreground">
                      Human specialists authorized to receive AI handoffs, review simulated calls, and certify hotel onboarding.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setInviteModalOpen(true)}>
                    <Plus className="mr-1.5 size-3.5" />
                    Invite Member
                  </Button>
                </div>

                <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between bg-card hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {member.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground text-sm">{member.name}</span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                member.role === 'Admin'
                                  ? 'border-indigo-500/40 text-indigo-300 bg-indigo-500/10'
                                  : member.role === 'Integration Lead'
                                  ? 'border-blue-500/40 text-blue-300 bg-blue-500/10'
                                  : 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                              }`}
                            >
                              {member.role}
                            </Badge>
                            {member.status === 'Invited' && (
                              <Badge variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-500/10 text-[10px]">
                                Invite Sent
                              </Badge>
                            )}
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span>{member.email}</span>
                            <span>•</span>
                            <span className="font-mono">{member.phone}</span>
                            <span>•</span>
                            <span>Active: {member.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <select
                          value={member.role}
                          onChange={(e) => {
                            const newRole = e.target.value as SettingsTeamMember['role']
                            setTeamMembers((prev) =>
                              prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
                            )
                            setSaveStatus({
                              type: 'info',
                              message: `Updated ${member.name}'s role to ${newRole} (Local state only).`,
                            })
                          }}
                          className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Sales Director">Sales Director</option>
                          <option value="Senior Onboarding Specialist">Senior Onboarding Specialist</option>
                          <option value="Integration Lead">Integration Lead</option>
                          <option value="Auditor">Auditor</option>
                        </select>
                        {teamMembers.length > 1 && member.role !== 'Admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive size-8 p-0"
                            onClick={() => {
                              setTeamMembers((prev) => prev.filter((m) => m.id !== member.id))
                              setSaveStatus({
                                type: 'info',
                                message: `Removed ${member.name} from demo team roster.`,
                              })
                            }}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles & Permissions Matrix */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Roles & Permissions Matrix</h3>
                    <p className="text-xs text-muted-foreground">
                      Fine-grained capability matrix governing actions allowed across human operators.
                    </p>
                  </div>
                  <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-mono">
                    Static RBAC Model
                  </Badge>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border text-[11px] font-semibold text-muted-foreground">
                      <tr>
                        <th className="p-3">Platform Capability</th>
                        <th className="p-3 text-center">Admin</th>
                        <th className="p-3 text-center">Sales Lead</th>
                        <th className="p-3 text-center">Onboarding Specialist</th>
                        <th className="p-3 text-center">Auditor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {MOCK_PERMISSIONS_MATRIX.map((perm) => (
                        <tr key={perm.id} className="hover:bg-muted/20">
                          <td className="p-3">
                            <div className="font-medium text-foreground">{perm.name}</div>
                            <div className="text-[11px] text-muted-foreground">{perm.description}</div>
                          </td>
                          <td className="p-3 text-center">
                            {perm.admin ? (
                              <Check className="mx-auto size-4 text-emerald-400" />
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {perm.salesAgent ? (
                              <Check className="mx-auto size-4 text-emerald-400" />
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {perm.onboardingSpecialist ? (
                              <Check className="mx-auto size-4 text-emerald-400" />
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {perm.auditor ? (
                              <Check className="mx-auto size-4 text-emerald-400" />
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── TAB 2: AI SALES POLICIES ────────────────── */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              {/* Backend Requirement Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-300">Requires Backend Support</span>
                    <Badge variant="outline" className="border-amber-400/40 text-amber-300 text-[10px] uppercase">
                      Prompt Engine & Guardrail Service
                    </Badge>
                  </div>
                  <p className="text-amber-200/80 leading-relaxed">
                    AI agent negotiation bounds, prompt system rules, and LLM output guardrails are injected into the real-time voice pipeline by backend prompt orchestrators (e.g. LangChain, LlamaIndex, or proprietary WebSocket agent runners). Changes here require server-side vector re-indexing before taking effect on live calls.
                  </p>
                </div>
              </div>

              {/* Policy Settings Panel */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Commercial & Pricing Negotiation Policies</h3>
                  <p className="text-xs text-muted-foreground">
                    Boundaries autonomous agents must strictly follow when pitching JusBid's bidding marketplace to hoteliers.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Floor Discount Rule */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Maximum Guest Bidding Floor Discount
                    </label>
                    <input
                      type="text"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      The maximum discount below published OTA rack rate an agent may reference when explaining guest pricing mechanics.
                    </p>
                  </div>

                  {/* Commission Structure */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Standard Commission Pitch Formula
                    </label>
                    <input
                      type="text"
                      value={commissionStructure}
                      onChange={(e) => setCommissionStructure(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Standard pricing comparison statement used in automated scripts (4% JusBid fee vs 18-24% OTA rate).
                    </p>
                  </div>

                  {/* Persona Tone */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Voice Persona Tone & Demeanor
                    </label>
                    <select
                      value={personaTone}
                      onChange={(e) => setPersonaTone(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Professional Indian Hospitality Specialist">
                        Professional & Courteous Hospitality Specialist (Hindi / Indian English)
                      </option>
                      <option value="Direct & Analytical Commercial Executive">
                        Direct & Analytical Commercial Executive (Metrics-focused)
                      </option>
                      <option value="Warm Boutique Relationship Associate">
                        Warm Boutique Relationship Associate (Conversational)
                      </option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      Determines synthetic inflection, greeting vocabulary, and conversational pacing.
                    </p>
                  </div>

                  {/* Escalation Threshold */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Hot Lead Escalation Intent Score (0 - 100)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="95"
                      value={escalationThreshold}
                      onChange={(e) => setEscalationThreshold(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Call confidence threshold that immediately triggers a warm human onboarding handoff.
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Strict Architectural Safeguards
                  </h4>

                  {/* Rate Parity Safeguard */}
                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">Brand Direct Rate Parity Protection</span>
                        <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                          Active Policy
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Voice agents are explicitly instructed never to offer public aggregator discounts that breach the hotel's existing brand.com walk-in floor rate.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={rateParityEnabled}
                      onChange={(e) => setRateParityEnabled(e.target.checked)}
                      className="size-4 rounded border-border accent-primary cursor-pointer mt-1"
                    />
                  </div>

                  {/* Block Autonomous Contract Signing */}
                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">
                          Prohibit Autonomous Contract Execution
                        </span>
                        <Badge variant="outline" className="text-[10px] border-indigo-500/40 text-indigo-400 bg-indigo-500/10">
                          Mandatory Compliance Guardrail
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        AI voice agents are strictly forbidden from finalizing legal agreements, issuing digital signatures, or stating that a hotel is onboarded without verified human specialist sign-off.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={blockAutonomousContract}
                      onChange={(e) => setBlockAutonomousContract(e.target.checked)}
                      className="size-4 rounded border-border accent-primary cursor-pointer mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── TAB 3: APPROVED CLAIMS & FAQS ────────────────── */}
          {activeTab === 'claims' && (
            <div className="space-y-6">
              {/* Backend Requirement Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-300">Requires Backend Support</span>
                    <Badge variant="outline" className="border-amber-400/40 text-amber-300 text-[10px] uppercase">
                      Vector RAG Knowledge Base
                    </Badge>
                  </div>
                  <p className="text-amber-200/80 leading-relaxed">
                    Live voice models retrieve factual statements via dense vector embeddings (Pinecone/pgvector). Deploying newly approved claims or FAQs requires triggering a server-side vectorization and RAG knowledge re-index.
                  </p>
                </div>
              </div>

              {/* Prohibited Claims Callout */}
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Ban className="size-4 text-destructive shrink-0" />
                  <h4 className="text-xs font-semibold text-destructive uppercase tracking-wider">
                    Strictly Prohibited Claims (Hard Negative Prompt Constraints)
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {MOCK_PROHIBITED_CLAIMS.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-lg border border-destructive/20 bg-background/50 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{p.claim}</span>
                        <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive">
                          {p.riskLevel} Risk
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{p.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approved Claims Section */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Approved Commercial Claims</h3>
                    <p className="text-xs text-muted-foreground">
                      Audited statements that AI voice agents are authorized to deliver when answering hotelier inquiries.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setAddClaimModalOpen(true)}>
                    <Plus className="mr-1.5 size-3.5" />
                    Add Approved Claim
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search approved claims or categories..."
                    value={claimSearch}
                    onChange={(e) => setClaimSearch(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2.5">
                  {filteredClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] border-border text-foreground">
                            {claim.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Source: {claim.verificationSource}</span>
                        </div>
                        <p className="text-xs font-medium text-foreground leading-relaxed">{claim.claim}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-[10px]">
                          Verified
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            setApprovedClaims((prev) => prev.filter((c) => c.id !== claim.id))
                            setSaveStatus({
                              type: 'info',
                              message: 'Claim removed from local list.',
                            })
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approved FAQs Section */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Approved FAQs & Standard Objection Responses</h3>
                    <p className="text-xs text-muted-foreground">
                      Structured Q&A entries embedded into conversational turns to resolve frequent hotelier hesitations.
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setAddFaqModalOpen(true)}>
                    <Plus className="mr-1.5 size-3.5" />
                    Add FAQ Entry
                  </Button>
                </div>

                <div className="space-y-3">
                  {approvedFaqs.map((faq) => (
                    <div key={faq.id} className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                            {faq.category}
                          </Badge>
                          <h4 className="text-xs font-semibold text-foreground">{faq.question}</h4>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Updated: {faq.lastUpdated}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-1 border-l-2 border-primary/40">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── TAB 4: CALLING HOURS ────────────────── */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              {/* Backend Requirement Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-300">Requires Backend Support</span>
                    <Badge variant="outline" className="border-amber-400/40 text-amber-300 text-[10px] uppercase">
                      Cron Scheduler & Dialing Daemon
                    </Badge>
                  </div>
                  <p className="text-amber-200/80 leading-relaxed">
                    Production calling schedules are managed by distributed cron workers (e.g. BullMQ, Celery, or AWS EventBridge) coordinating with SIP carriers. Telephony rate limiting and time window locks require backend scheduling daemons to prevent early or late dials.
                  </p>
                </div>
              </div>

              {/* Calling Hours Form */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Permitted Outbound Calling Hours</h3>
                  <p className="text-xs text-muted-foreground">
                    Strict legal operating windows adhering to TRAI regulations and Indian hotel operational schedules.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Earliest Calling Start (IST)</label>
                    <select
                      value={earliestHour}
                      onChange={(e) => setEarliestHour(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="09:00 AM">09:00 AM (Early check-out window)</option>
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="10:00 AM">10:00 AM (Recommended)</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">Hoteliers typically finish morning check-out rush by 10 AM.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Latest Calling Cutoff (IST)</label>
                    <select
                      value={latestHour}
                      onChange={(e) => setLatestHour(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="06:30 PM">06:30 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                      <option value="07:30 PM">07:30 PM (Recommended cut-off)</option>
                      <option value="08:00 PM">08:00 PM (Strict TRAI Limit)</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">Calls after 8:00 PM violate national commercial outreach rules.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">System Timezone</label>
                    <div className="flex h-9 items-center rounded-md border border-border bg-muted/40 px-3 text-xs font-mono text-muted-foreground">
                      Asia/Kolkata (IST +05:30)
                    </div>
                    <p className="text-[11px] text-muted-foreground">Locked to India Standard Time for all domestic outreach.</p>
                  </div>
                </div>

                {/* Permitted Days of Week */}
                <div className="space-y-2 border-t border-border pt-4">
                  <label className="text-xs font-medium text-foreground">Permitted Days of Week</label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                      const isSelected = activeDays.includes(day)
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setActiveDays((prev) => prev.filter((d) => d !== day))
                            } else {
                              setActiveDays((prev) => [...prev, day])
                            }
                          }}
                          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-primary text-primary-foreground font-semibold'
                              : 'border border-border bg-background text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Sunday outreach is disabled by default to protect partner relationships.
                  </p>
                </div>

                {/* Additional Calling Window Rules */}
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">Lunch & Check-in Throttle (12:30 PM - 02:30 PM)</span>
                        <Badge variant="outline" className="text-[10px] border-border text-foreground">
                          Hospitality Custom
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Automatically reduces concurrent calling speed by 60% during peak hotel lobby check-in hours to avoid annoying front desk managers.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={lunchThrottle}
                      onChange={(e) => setLunchThrottle(e.target.checked)}
                      className="size-4 rounded border-border accent-primary cursor-pointer mt-1"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">Indian Gazetted Holidays Suppression</span>
                        <Badge variant="outline" className="text-[10px] border-border text-foreground">
                          TRAI Best Practice
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Pauses automated campaigns on Diwali, Holi, Republic Day, Independence Day, and Gandhi Jayanti.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={holidaySuppression}
                      onChange={(e) => setHolidaySuppression(e.target.checked)}
                      className="size-4 rounded border-border accent-primary cursor-pointer mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── TAB 5: SUPPRESSION & DND ────────────────── */}
          {activeTab === 'suppression' && (
            <div className="space-y-6">
              {/* Backend Requirement Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-300">Requires Backend Support</span>
                    <Badge variant="outline" className="border-amber-400/40 text-amber-300 text-[10px] uppercase">
                      TRAI NDNC Scrubbing API
                    </Badge>
                  </div>
                  <p className="text-amber-200/80 leading-relaxed">
                    National Do Not Call (NDNC) scrubbing requires an enterprise Telecom Regulatory Authority of India (TRAI) bulk verification subscription and carrier-level number routing filters before any telecommunication dialer initiates a packet.
                  </p>
                </div>
              </div>

              {/* Suppression Rules Configuration */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Outreach Pacing & Anti-Harassment Guardrails</h3>
                  <p className="text-xs text-muted-foreground">
                    Enforce compliance limits on call frequency to respect prospective hotel partners.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Max Daily Dials Per Prospect</label>
                    <input
                      type="number"
                      min="1"
                      max="3"
                      value={maxDailyAttempts}
                      onChange={(e) => setMaxDailyAttempts(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-[11px] text-muted-foreground">Strict cap of dials per phone number in 24 hours.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Minimum Gap Between Dials</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="2"
                        max="8"
                        value={minHoursBetween}
                        onChange={(e) => setMinHoursBetween(e.target.value)}
                        className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <span className="text-xs text-muted-foreground">Hours</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Minimum cooldown before re-attempting an unanswered call.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Lifetime Campaign Maximum</label>
                    <input
                      type="number"
                      min="3"
                      max="8"
                      value={maxLifetimeAttempts}
                      onChange={(e) => setMaxLifetimeAttempts(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-[11px] text-muted-foreground">After this count, lead is marked permanently unreachable.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-border pt-4">
                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">TRAI NDNC Pre-Scrubbing</span>
                        <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                          Active Demo
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Filter phone numbers against the Indian National Consumer Preference Register before queueing.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={traiFilter}
                      onChange={(e) => setTraiFilter(e.target.checked)}
                      className="size-4 rounded border-border accent-primary cursor-pointer mt-1"
                    />
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground">Opt-Out Cooldown Period</label>
                      <Badge variant="outline" className="text-[10px] border-border text-foreground">
                        Cooldown
                      </Badge>
                    </div>
                    <select
                      value={optOutCooldown}
                      onChange={(e) => setOptOutCooldown(e.target.value)}
                      className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="60 Days">60 Days</option>
                      <option value="90 Days">90 Days (Recommended)</option>
                      <option value="180 Days">180 Days</option>
                      <option value="Permanent">Permanent</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      Duration a lead remains suppressed after verbally requesting not to be contacted.
                    </p>
                  </div>
                </div>
              </div>

              {/* Blacklist Table */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Suppression Blacklist Registry</h3>
                    <p className="text-xs text-muted-foreground">
                      Synthetic numbers and hoteliers actively blocked from all autonomous outreach queues.
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setAddBlacklistModalOpen(true)}>
                    <Plus className="mr-1.5 size-3.5" />
                    Add Number to Blacklist
                  </Button>
                </div>

                <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                  {blacklist.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-center sm:justify-between bg-card hover:bg-muted/40 transition-colors text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-foreground">{entry.phone}</span>
                          <span className="text-muted-foreground">— {entry.property}</span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              entry.status === 'Permanent'
                                ? 'border-destructive/40 text-destructive bg-destructive/10'
                                : 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                            }`}
                          >
                            {entry.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Reason: {entry.reason} • Added by: {entry.addedBy} on {entry.addedAt}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground size-8 p-0 self-end sm:self-auto"
                        onClick={() => {
                          setBlacklist((prev) => prev.filter((b) => b.id !== entry.id))
                          setSaveStatus({
                            type: 'info',
                            message: `Removed ${entry.phone} from suppression blacklist (Demo).`,
                          })
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── TAB 6: CALLBACK RULES ────────────────── */}
          {activeTab === 'callbacks' && (
            <div className="space-y-6">
              {/* Backend Requirement Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-300">Requires Backend Support</span>
                    <Badge variant="outline" className="border-amber-400/40 text-amber-300 text-[10px] uppercase">
                      CRM Task Scheduler Daemon
                    </Badge>
                  </div>
                  <p className="text-amber-200/80 leading-relaxed">
                    Automated calendar invitations, SLA breach triggers, and human specialist round-robin routing logic require a backend task daemon and transactional database.
                  </p>
                </div>
              </div>

              {/* Callback Parameters */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Callback & Human Escalation SLAs</h3>
                  <p className="text-xs text-muted-foreground">
                    Define response standards and re-contact logic for leads requesting human sales interaction.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Urgent / Immediate Handoff SLA
                    </label>
                    <select
                      value={urgentSla}
                      onChange={(e) => setUrgentSla(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="2 business hours">2 business hours</option>
                      <option value="4 business hours">4 business hours (Recommended)</option>
                      <option value="8 business hours">8 business hours</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      Target window for high-intent hoteliers who requested contract terms during an AI call.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Standard Follow-Up SLA
                    </label>
                    <select
                      value={standardSla}
                      onChange={(e) => setStandardSla(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="24 business hours">24 business hours (Next day)</option>
                      <option value="48 business hours">48 business hours</option>
                      <option value="72 business hours">72 business hours</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      Target for exploratory leads who asked for brochures or generic follow-up calls.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Default Rescheduling Window
                    </label>
                    <select
                      value={rescheduleWindow}
                      onChange={(e) => setRescheduleWindow(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Next Business Day (11:00 AM – 01:00 PM IST)">
                        Next Business Day (11:00 AM – 01:00 PM IST)
                      </option>
                      <option value="Next Business Day (03:00 PM – 05:00 PM IST)">
                        Next Business Day (03:00 PM – 05:00 PM IST)
                      </option>
                      <option value="In 48 Hours Same Time">In 48 Hours Same Time</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      Fallback window when hotelier asks agent "call me back tomorrow" without a specific hour.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Human Specialist Assignment Routing
                    </label>
                    <select
                      value={routingStrategy}
                      onChange={(e) => setRoutingStrategy(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Territory & Regional Specialization">
                        Territory & Regional Specialization (North vs West vs South)
                      </option>
                      <option value="Round-Robin Load Balancing">Round-Robin Load Balancing</option>
                      <option value="Experience Level & ADR Tiering">Experience Level & ADR Tiering</option>
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      Algorithm used to automatically route new handoffs from the AI voice queue.
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-4">
                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">
                          Supervisor Escalation on Overdue SLA
                        </span>
                        <Badge variant="outline" className="text-[10px] border-border text-foreground">
                          Escalation Alert
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Automatically reassigns the callback and triggers an in-app alert to the Sales Director if an urgent handoff is untouched after 4 hours.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={supervisorEscalation}
                      onChange={(e) => setSupervisorEscalation(e.target.checked)}
                      className="size-4 rounded border-border accent-primary cursor-pointer mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3.5 text-xs">
                    <div>
                      <span className="font-medium text-foreground">Maximum Automated Reschedules Per Lead</span>
                      <p className="text-[11px] text-muted-foreground">
                        If a prospect postpones more than 3 consecutive times, flag for manual review.
                      </p>
                    </div>
                    <input
                      type="number"
                      min="2"
                      max="5"
                      value={maxAutoReschedules}
                      onChange={(e) => setMaxAutoReschedules(e.target.value)}
                      className="h-8 w-20 rounded-md border border-border bg-background px-2 text-center text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── TAB 7: NOTIFICATIONS ────────────────── */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Backend Requirement Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-300">Requires Backend Support</span>
                    <Badge variant="outline" className="border-amber-400/40 text-amber-300 text-[10px] uppercase">
                      Notification & Webhook Dispatcher
                    </Badge>
                  </div>
                  <p className="text-amber-200/80 leading-relaxed">
                    Live email delivery, Slack webhooks, and SMS dispatch require configured transactional notification services (e.g. AWS SES, SendGrid, Slack App credentials) and background job workers.
                  </p>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Alert Preferences & Handoff Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    Configure real-time alerts for high-value prospect events and system dropouts.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">Hot Lead Handoff Alert</span>
                        <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                          High Priority
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Instant notification when an AI agent successfully identifies a hotelier ready for onboarding or contract discussion.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={hotLeadAlert}
                      onChange={(e) => setHotLeadAlert(e.target.checked)}
                      className="size-4 rounded border-border accent-primary cursor-pointer mt-1"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">Technical Call Drop & Low STT Confidence</span>
                        <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-400 bg-amber-500/10">
                          Quality Assurance
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Alert engineering when speech-to-text confidence drops below 65% or audio connection drops mid-conversation.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={techDropAlert}
                      onChange={(e) => setTechDropAlert(e.target.checked)}
                      className="size-4 rounded border-border accent-primary cursor-pointer mt-1"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">Daily Morning Briefing Digest</span>
                        <Badge variant="outline" className="text-[10px] border-border text-foreground">
                          Scheduled 09:30 AM
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Executive summary of today's scheduled campaign dials, pending follow-ups, and open onboarding milestones.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={dailyDigest}
                      onChange={(e) => setDailyDigest(e.target.checked)}
                      className="size-4 rounded border-border accent-primary cursor-pointer mt-1"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">Weekly Funnel Performance Report</span>
                        <Badge variant="outline" className="text-[10px] border-border text-foreground">
                          Weekly Monday
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Detailed breakdown of total calls dialed, conversion rates, and revenue pipeline projections.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                      className="size-4 rounded border-border accent-primary cursor-pointer mt-1"
                    />
                  </div>
                </div>

                {/* Delivery Channels */}
                <div className="border-t border-border pt-4 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Notification Dispatch Endpoints
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Operations Email Recipient</label>
                      <input
                        type="email"
                        value={emailRecipient}
                        onChange={(e) => setEmailRecipient(e.target.value)}
                        className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <p className="text-[11px] text-muted-foreground">Fictional internal distribution list.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Slack Integration Channel</label>
                      <input
                        type="text"
                        value={slackChannel}
                        onChange={(e) => setSlackChannel(e.target.value)}
                        className="h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <p className="text-[11px] text-muted-foreground">Mock channel webhook identifier.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={inAppAlerts}
                        onChange={(e) => setInAppAlerts(e.target.checked)}
                        className="size-4 rounded border-border accent-primary cursor-pointer"
                      />
                      <span className="font-medium text-foreground">In-App Banner & Notification Bell Alerts</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSaveStatus({
                          type: 'info',
                          message: 'Test simulated notification dispatched successfully (Demo trigger).',
                        })
                      }}
                    >
                      <Sparkles className="mr-1.5 size-3.5" />
                      Test Notification
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── TAB 8: INTEGRATION STATUS ────────────────── */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              {/* Backend Requirement Banner */}
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-300">Requires Backend Support</span>
                    <Badge variant="outline" className="border-amber-400/40 text-amber-300 text-[10px] uppercase">
                      External Gateways & Secret Vault
                    </Badge>
                  </div>
                  <p className="text-amber-200/80 leading-relaxed">
                    Live SIP telecommunication trunks, WhatsApp Business API endpoints, and production webhooks require server-side gateway microservices and a secure key management system (e.g. AWS KMS, HashiCorp Vault).
                  </p>
                </div>
              </div>

              {/* Zero Secrets Stored Security Notice */}
              <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-xs">
                <Lock className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">Browser Security & Key Storage Guarantee</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    For zero-trust security compliance, <span className="text-foreground font-medium">no API keys, webhook signing secrets, or carrier credentials are stored in the browser, cookies, or client storage</span>. All values below display simulated placeholders with strict demo indicators.
                  </p>
                </div>
              </div>

              {/* Integrations List */}
              <div className="space-y-4">
                {MOCK_INTEGRATIONS.map((int) => (
                  <div
                    key={int.id}
                    className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-sm font-semibold text-foreground">{int.name}</h4>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              int.status === 'demo_active'
                                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                                : int.status === 'sandbox_ready'
                                ? 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                                : 'border-border text-muted-foreground bg-muted/40'
                            }`}
                          >
                            {int.statusLabel}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                            {int.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{int.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono text-muted-foreground">{int.latencyOrVersion}</span>
                      </div>
                    </div>

                    {/* Masked Connection Credentials (Frontend Safe) */}
                    {(int.maskedEndpoint || int.maskedToken) && (
                      <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs space-y-2">
                        {int.maskedEndpoint && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Simulated Endpoint:</span>
                            <span className="font-mono text-[11px] text-foreground bg-background px-2 py-0.5 rounded border border-border">
                              {int.maskedEndpoint}
                            </span>
                          </div>
                        )}
                        {int.maskedToken && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Signing Token (Masked):</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-muted-foreground bg-background px-2 py-0.5 rounded border border-border tracking-wider">
                                {int.maskedToken}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-medium">(Not stored in client)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Backend Requirement Note */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Server className="size-3.5 text-amber-400" />
                        <span className="text-[11px]">{int.backendRequirementNotice}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        disabled={int.status === 'disabled'}
                        onClick={() => {
                          setSaveStatus({
                            type: 'info',
                            message: `Simulated test ping sent to ${int.name}. Response: 200 OK (Demo Mock).`,
                          })
                        }}
                      >
                        Test Ping
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ────────────────── MODALS (FRONTEND ONLY) ────────────────── */}

      {/* Invite Member Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Invite Team Specialist</DialogTitle>
              <DialogDescription>
                Simulate adding an onboarding agent or manager to your JusBid AI sales workspace.
              </DialogDescription>
            </DialogHeader>

            {inviteError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                {inviteError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label htmlFor="settings-invite-name" className="text-xs font-medium text-foreground">Full Name</label>
                <input
                  id="settings-invite-name"
                  type="text"
                  placeholder="e.g. Priya Sengupta"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="settings-invite-email" className="text-xs font-medium text-foreground">Email Address</label>
                <input
                  id="settings-invite-email"
                  type="email"
                  placeholder="e.g. priya.sengupta@jusbid-demo.in"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="settings-invite-role" className="text-xs font-medium text-foreground">Assigned Role</label>
                <select
                  id="settings-invite-role"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as SettingsTeamMember['role'])}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Senior Onboarding Specialist">Senior Onboarding Specialist</option>
                  <option value="Sales Director">Sales Director</option>
                  <option value="Integration Lead">Integration Lead</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-[11px] text-amber-200">
                Notice: In client sandbox mode, no actual invitation emails are delivered. Member will be added to local demo state.
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Send Demo Invite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Approved Claim Modal */}
      <Dialog open={addClaimModalOpen} onOpenChange={setAddClaimModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddClaimSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Approved Commercial Claim</DialogTitle>
              <DialogDescription>
                Provide a verified factual claim for AI voice agents to deliver during hotelier outreach.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <label htmlFor="settings-claim-text" className="text-xs font-medium text-foreground">Claim Text</label>
                <textarea
                  id="settings-claim-text"
                  rows={3}
                  placeholder="e.g. JusBid provides 24-hour automated NEFT payouts with direct PMS booking sync."
                  value={newClaimText}
                  onChange={(e) => setNewClaimText(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="settings-claim-category" className="text-xs font-medium text-foreground">Category</label>
                <select
                  id="settings-claim-category"
                  value={newClaimCategory}
                  onChange={(e) => setNewClaimCategory(e.target.value as ApprovedClaim['category'])}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Pricing">Pricing</option>
                  <option value="Value Proposition">Value Proposition</option>
                  <option value="Product Control">Product Control</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>

              <div>
                <label htmlFor="settings-claim-source" className="text-xs font-medium text-foreground">Verification Source / Reference</label>
                <input
                  id="settings-claim-source"
                  type="text"
                  placeholder="e.g. Hotelier Terms of Service Schedule B"
                  value={newClaimSource}
                  onChange={(e) => setNewClaimSource(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setAddClaimModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!newClaimText.trim()}>
                Add to Policy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Approved FAQ Modal */}
      <Dialog open={addFaqModalOpen} onOpenChange={setAddFaqModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddFaqSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Approved Knowledge Base FAQ</DialogTitle>
              <DialogDescription>
                Add a canned objection answer to the simulated AI conversational knowledge base.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <label htmlFor="settings-faq-question" className="text-xs font-medium text-foreground">Hotelier Question</label>
                <input
                  id="settings-faq-question"
                  type="text"
                  placeholder="e.g. Will this disrupt our contracts with MakeMyTrip?"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="settings-faq-answer" className="text-xs font-medium text-foreground">Approved Voice Response</label>
                <textarea
                  id="settings-faq-answer"
                  rows={3}
                  placeholder="e.g. No, JusBid acts as an incremental private channel without conflicting with public parity rates."
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="settings-faq-category" className="text-xs font-medium text-foreground">Category</label>
                <select
                  id="settings-faq-category"
                  value={newFaqCategory}
                  onChange={(e) => setNewFaqCategory(e.target.value as ApprovedFAQ['category'])}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Commission & Payouts">Commission & Payouts</option>
                  <option value="Guest Bidding Mechanics">Guest Bidding Mechanics</option>
                  <option value="PMS Integration">PMS Integration</option>
                  <option value="Contract Terms">Contract Terms</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setAddFaqModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!newFaqQuestion.trim() || !newFaqAnswer.trim()}>
                Save to FAQs
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Blacklist Number Modal */}
      <Dialog open={addBlacklistModalOpen} onOpenChange={setAddBlacklistModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddBlacklistSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Number to Suppression Blacklist</DialogTitle>
              <DialogDescription>
                Immediately block a hotelier's telephone number from all autonomous calling campaigns.
              </DialogDescription>
            </DialogHeader>

            {blacklistError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                {blacklistError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label htmlFor="settings-blacklist-phone" className="text-xs font-medium text-foreground">Phone Number (Synthetic Placeholder)</label>
                <input
                  id="settings-blacklist-phone"
                  type="text"
                  placeholder="+91 99999 000xx"
                  value={newBlacklistPhone}
                  onChange={(e) => setNewBlacklistPhone(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="settings-blacklist-property" className="text-xs font-medium text-foreground">Property Name</label>
                <input
                  id="settings-blacklist-property"
                  type="text"
                  placeholder="e.g. Royal Haveli Resort"
                  value={newBlacklistProperty}
                  onChange={(e) => setNewBlacklistProperty(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="settings-blacklist-reason" className="text-xs font-medium text-foreground">Suppression Reason</label>
                <input
                  id="settings-blacklist-reason"
                  type="text"
                  placeholder="e.g. Requested permanent DND during intro call"
                  value={newBlacklistReason}
                  onChange={(e) => setNewBlacklistReason(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="settings-blacklist-duration" className="text-xs font-medium text-foreground">Suppression Duration</label>
                <select
                  id="settings-blacklist-duration"
                  value={newBlacklistStatus}
                  onChange={(e) => setNewBlacklistStatus(e.target.value as 'Permanent' | '90-Day Cooldown')}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="90-Day Cooldown">90-Day Cooldown</option>
                  <option value="Permanent">Permanent</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setAddBlacklistModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add to Blacklist
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
