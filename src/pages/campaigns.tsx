import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, StatusBadge, EmptyState } from '@/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Megaphone,
  Plus,
  Play,
  Pause,
  Bot,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  ShieldAlert,
  Search,
  X,
  Check,
  RotateCcw,
} from 'lucide-react'
import { useMockData } from '@/context'
import type { Campaign, CampaignStatus } from '@/types'

const REGION_OPTIONS = [
  'Jaipur',
  'Udaipur',
  'Jodhpur',
  'Jaisalmer',
  'Goa',
  'Kochi',
  'Munnar',
  'Wayanad',
  'Manali',
  'Shimla',
  'Rishikesh',
  'Bengaluru',
  'Hyderabad',
  'Mumbai',
]

const PROPERTY_SEGMENTS = [
  'Heritage Havelis & Palaces (30–80 keys)',
  'Beachfront Resorts & Luxury Villas (20–60 keys)',
  'Eco Retreats & Plantation Lodges (15–45 keys)',
  'Business Hotels & Tech Hub Suites (50–120 keys)',
  'All Independent Boutique Hotels (20–100 keys)',
]

const PITCH_ANGLES = [
  'Direct Guest Bidding & Zero OTA Commission (18-24% Savings)',
  'Unsold Off-Season Inventory Flash Bidding with Price Floor Protection',
  'Complimentary 30-Day PMS Two-Way Integration Pilot',
  'High-Margin Corporate Offsite & Group Bidding Platform',
]

export function CampaignsPage() {
  // Shared campaigns from master context
  const { campaigns, addCampaign, updateCampaign, agents: mockAiAgents } = useMockData()

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all')

  // Feedback banner state
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null)

  // Multi-step Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1)

  // Wizard Form State
  const [wizardForm, setWizardForm] = useState({
    name: '',
    targetSegment: PROPERTY_SEGMENTS[0],
    pitchAngle: PITCH_ANGLES[0],
    selectedRegions: ['Jaipur', 'Udaipur', 'Jodhpur'],
    minRooms: '25',
    maxRooms: '85',
    minFitScore: '70',
    suppressDnd: true,
    suppressRecentContacted: true,
    suppressActivePipeline: true,
    suppressUnverified: true,
    selectedAgentId: 'agent-ava',
    scriptLanguage: 'Indian English, Hindi',
    startTime: '10:00 AM',
    endTime: '06:30 PM',
    callingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    maxAttempts: '2',
    retryDelay: '4 hours',
    concurrencyChannels: '5',
  })

  // Toggle pause/play on a campaign
  const handleToggleCampaignStatus = (campaignId: string) => {
    const target = campaigns.find((c) => c.id === campaignId)
    if (!target) return
    const nextStatus: CampaignStatus = target.status === 'active' ? 'paused' : 'active'
    updateCampaign(campaignId, { status: nextStatus })
    setFeedbackBanner(
      `Campaign "${target.name}" ${nextStatus === 'active' ? 'resumed' : 'paused'} in demo sandbox.`,
    )
  }

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((camp) => {
      // Search
      const query = searchQuery.trim().toLowerCase()
      if (query) {
        const matchesName = camp.name.toLowerCase().includes(query)
        const matchesAudience = camp.targetAudience.toLowerCase().includes(query)
        const matchesAgent = camp.assignedAgentName.toLowerCase().includes(query)
        if (!matchesName && !matchesAudience && !matchesAgent) return false
      }

      // Status tab
      if (selectedStatusTab !== 'all' && camp.status !== selectedStatusTab) {
        return false
      }

      return true
    })
  }, [campaigns, searchQuery, selectedStatusTab])

  // Calculated audience estimate based on step 2 filters
  const estimatedAudienceCount = useMemo(() => {
    let base = wizardForm.selectedRegions.length * 52
    if (wizardForm.suppressDnd) base -= Math.round(base * 0.05)
    if (wizardForm.suppressRecentContacted) base -= Math.round(base * 0.08)
    if (wizardForm.suppressActivePipeline) base -= Math.round(base * 0.04)
    return Math.max(25, base)
  }, [
    wizardForm.selectedRegions,
    wizardForm.suppressDnd,
    wizardForm.suppressRecentContacted,
    wizardForm.suppressActivePipeline,
  ])

  // Selected agent object for review
  const selectedAgent = useMemo(() => {
    return (
      mockAiAgents.find((a) => a.id === wizardForm.selectedAgentId) ||
      mockAiAgents[0]
    )
  }, [wizardForm.selectedAgentId, mockAiAgents])

  // Launch campaign handler
  const handleLaunchCampaign = () => {
    const activeSuppressions: string[] = []
    if (wizardForm.suppressDnd) activeSuppressions.push('DND & Opt-Out Registry')
    if (wizardForm.suppressRecentContacted) activeSuppressions.push('Contacted in last 14 days')
    if (wizardForm.suppressActivePipeline) activeSuppressions.push('Active Qualified Pipeline')

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: wizardForm.name.trim() || 'New Autonomous Outreach Blitz',
      description: `Targeting ${wizardForm.targetSegment} in ${wizardForm.selectedRegions.slice(0, 3).join(', ')} pitching ${wizardForm.pitchAngle}.`,
      status: 'active',
      targetAudience: wizardForm.targetSegment,
      targetRegion: wizardForm.selectedRegions,
      audienceSize: estimatedAudienceCount,
      callsAttempted: 0,
      callsConnected: 0,
      leadsQualified: 0,
      interestRate: 0,
      assignedAgentId: selectedAgent.id,
      assignedAgentName: `${selectedAgent.name} (${selectedAgent.role.split(' ')[0]})`,
      scheduleWindow: `${wizardForm.startTime} - ${wizardForm.endTime} IST`,
      scheduleDays: wizardForm.callingDays,
      maxAttemptsPerLead: parseInt(wizardForm.maxAttempts, 10) || 2,
      suppressionRules: activeSuppressions,
      createdAt: new Date().toISOString().split('T')[0],
      isSimulatedDemo: true,
    }

    addCampaign(newCampaign)
    setIsWizardOpen(false)
    setWizardStep(1)
    setFeedbackBanner(
      `✓ Campaign "${newCampaign.name}" launched in demo simulation mode! (Local state only · 0 real calls placed)`,
    )

    // Reset wizard
    setWizardForm({
      name: '',
      targetSegment: PROPERTY_SEGMENTS[0],
      pitchAngle: PITCH_ANGLES[0],
      selectedRegions: ['Jaipur', 'Udaipur', 'Jodhpur'],
      minRooms: '25',
      maxRooms: '85',
      minFitScore: '70',
      suppressDnd: true,
      suppressRecentContacted: true,
      suppressActivePipeline: true,
      suppressUnverified: true,
      selectedAgentId: 'agent-ava',
      scriptLanguage: 'Indian English, Hindi',
      startTime: '10:00 AM',
      endTime: '06:30 PM',
      callingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      maxAttempts: '2',
      retryDelay: '4 hours',
      concurrencyChannels: '5',
    })
  }

  // Summary KPIs
  const totalCallsAttempted = useMemo(
    () => campaigns.reduce((acc, c) => acc + c.callsAttempted, 0),
    [campaigns],
  )
  const totalLeadsQualified = useMemo(
    () => campaigns.reduce((acc, c) => acc + c.leadsQualified, 0),
    [campaigns],
  )
  const activeCampaignsCount = useMemo(
    () => campaigns.filter((c) => c.status === 'active').length,
    [campaigns],
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="OUTREACH AUTOMATION"
        title="Outreach Campaigns"
        description="Monitor autonomous AI voice calling blitzes, qualify hotel owners at scale, and track batch lead conversions."
      >
        <Button
          size="sm"
          onClick={() => {
            setIsWizardOpen(true)
            setWizardStep(1)
          }}
          className="shadow-xs"
        >
          <Plus className="mr-1.5 size-3.5" />
          Create Campaign
        </Button>
      </PageHeader>

      {/* Safety Notice Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <strong className="text-foreground">Simulated Outreach Sandbox:</strong> Campaign progress, dialing queues, and contact attempts are mock demonstrations contained in local state. No real outbound telephone calls are placed, and no connection to OmniDimension or external telephony dialers exists.
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          Zero-Dial Guarantee
        </span>
      </div>

      {/* Temporary Feedback Banner */}
      {feedbackBanner && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-50/80 p-3 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <span>{feedbackBanner}</span>
          </div>
          <button
            onClick={() => setFeedbackBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Total Campaigns</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">{campaigns.length}</span>
            <span className="text-[10px] text-muted-foreground">configured</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Active Calling Blitzes</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-emerald-600">{activeCampaignsCount}</span>
            <span className="text-[10px] text-muted-foreground">in progress</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Mock Calls Attempted</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">{totalCallsAttempted.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground">simulated</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Leads Qualified</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600">{totalLeadsQualified}</span>
            <span className="text-[10px] text-muted-foreground">handoff ready</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-border bg-muted/40 p-1 text-xs">
          {[
            { id: 'all', label: 'All Campaigns', count: campaigns.length },
            { id: 'active', label: 'Active', count: campaigns.filter((c) => c.status === 'active').length },
            { id: 'scheduled', label: 'Scheduled', count: campaigns.filter((c) => c.status === 'scheduled').length },
            { id: 'completed', label: 'Completed', count: campaigns.filter((c) => c.status === 'completed').length },
            { id: 'paused', label: 'Paused', count: campaigns.filter((c) => c.status === 'paused').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedStatusTab === tab.id
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              <span className="rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns, audience, or agent..."
            className="pl-8 text-xs h-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <EmptyState
            icon={<Megaphone className="size-6 text-muted-foreground" />}
            title="No campaigns match your filters"
            description="Try clearing your search query or switching tabs to view other campaign states."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedStatusTab('all')
                }}
              >
                <RotateCcw className="mr-1.5 size-3.5" />
                Reset filters
              </Button>
            }
          />
        ) : (
          filteredCampaigns.map((camp) => {
            const progressPercent =
              camp.audienceSize > 0
                ? Math.min(100, Math.round((camp.callsAttempted / camp.audienceSize) * 100))
                : 0

            return (
              <div
                key={camp.id}
                className="rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-indigo-400/40"
              >
                {/* Header Row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary dark:bg-indigo-950/50 dark:text-indigo-300">
                      <Megaphone className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-sm">{camp.name}</h3>
                        <StatusBadge
                          variant={
                            camp.status === 'active'
                              ? 'active'
                              : camp.status === 'scheduled'
                                ? 'scheduled'
                                : camp.status === 'completed'
                                  ? 'qualified'
                                  : 'paused'
                          }
                          dot
                        >
                          {camp.status === 'active'
                            ? 'Running Live'
                            : camp.status === 'scheduled'
                              ? 'Scheduled'
                              : camp.status === 'completed'
                                ? 'Completed'
                                : 'Paused'}
                        </StatusBadge>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          Mock Blitz
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{camp.targetAudience}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {camp.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleCampaignStatus(camp.id)}
                        className="h-8 px-2.5 text-xs"
                      >
                        <Pause className="mr-1.5 size-3" /> Pause
                      </Button>
                    )}
                    {camp.status === 'paused' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleCampaignStatus(camp.id)}
                        className="h-8 px-2.5 text-xs text-emerald-600"
                      >
                        <Play className="mr-1.5 size-3" /> Resume
                      </Button>
                    )}
                    {camp.status === 'scheduled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleCampaignStatus(camp.id)}
                        className="h-8 px-2.5 text-xs text-primary"
                      >
                        <Play className="mr-1.5 size-3" /> Start Now
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Audience Stats */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Outreach Progress:{' '}
                      <strong className="text-foreground">
                        {camp.callsAttempted} / {camp.audienceSize} properties
                      </strong>
                    </span>
                    <span className="font-semibold text-foreground">{progressPercent}% Completed</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        camp.status === 'completed'
                          ? 'bg-emerald-600'
                          : camp.status === 'paused'
                            ? 'bg-amber-500'
                            : 'bg-primary'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-lg bg-muted/30 p-3 text-xs border border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Audience Size</span>
                    <p className="mt-0.5 font-semibold text-foreground">{camp.audienceSize} hotels</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Connected Rate</span>
                    <p className="mt-0.5 font-semibold text-foreground">
                      {camp.callsAttempted > 0
                        ? `${Math.round((camp.callsConnected / camp.callsAttempted) * 100)}% (${camp.callsConnected})`
                        : '0%'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Interest & Qualified</span>
                    <p className="mt-0.5 font-semibold text-emerald-600">
                      {camp.leadsQualified} hoteliers ({camp.interestRate}%)
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Calling Window</span>
                    <p className="mt-0.5 font-semibold text-foreground truncate" title={camp.scheduleWindow}>
                      {camp.scheduleWindow}
                    </p>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground gap-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Bot className="size-3.5 text-primary" />
                      Agent: <strong className="text-foreground">{camp.assignedAgentName}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      Days: <strong className="text-foreground">{camp.scheduleDays.join(', ')}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-muted-foreground" />
                      Max Attempts: <strong className="text-foreground">{camp.maxAttemptsPerLead}x / lead</strong>
                    </span>
                  </div>

                  <Button variant="ghost" size="sm" asChild className="h-8 text-xs text-primary hover:text-primary">
                    <Link to="/calls" className="flex items-center gap-1">
                      Inspect Calls <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MULTI-STEP CREATE-CAMPAIGN WIZARD MODAL                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="size-5 text-primary" />
              Create Autonomous Outreach Campaign
            </DialogTitle>
            <DialogDescription>
              Configure an AI voice qualification blitz across hotelier prospects. Simulated in demo sandbox mode.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper Progress Indicator */}
          <div className="py-2">
            <div className="flex items-center justify-between text-xs font-medium">
              {[
                { step: 1, label: 'Basics' },
                { step: 2, label: 'Audience & Filters' },
                { step: 3, label: 'Agent & Pitch' },
                { step: 4, label: 'Schedule & Pacing' },
                { step: 5, label: 'Review & Launch' },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-1">
                  <div
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      wizardStep === s.step
                        ? 'bg-primary text-primary-foreground'
                        : wizardStep > s.step
                          ? 'bg-emerald-600 text-white'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {wizardStep > s.step ? <Check className="size-3.5" /> : s.step}
                  </div>
                  <span
                    className={`text-[10px] hidden sm:inline-block ${
                      wizardStep === s.step ? 'font-semibold text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((wizardStep - 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* ── STEP 1: CAMPAIGN BASICS ── */}
          {wizardStep === 1 && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label htmlFor="wizard-campaign-name" className="text-xs font-semibold text-foreground">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="wizard-campaign-name"
                  placeholder="e.g. Winter Peak Direct Booking Blitz - Rajasthan Heritage"
                  value={wizardForm.name}
                  onChange={(e) => setWizardForm({ ...wizardForm, name: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wizard-target-segment" className="text-xs font-semibold text-foreground">
                  Target Hotel Property Segment
                </label>
                <select
                  id="wizard-target-segment"
                  value={wizardForm.targetSegment}
                  onChange={(e) => setWizardForm({ ...wizardForm, targetSegment: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  {PROPERTY_SEGMENTS.map((seg) => (
                    <option key={seg} value={seg}>
                      {seg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wizard-pitch-angle" className="text-xs font-semibold text-foreground">
                  Core Outreach Objective & Hook
                </label>
                <select
                  id="wizard-pitch-angle"
                  value={wizardForm.pitchAngle}
                  onChange={(e) => setWizardForm({ ...wizardForm, pitchAngle: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  {PITCH_ANGLES.map((angle) => (
                    <option key={angle} value={angle}>
                      {angle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 2: AUDIENCE & SUPPRESSION ── */}
          {wizardStep === 2 && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Target Destination Clusters</span>
                  <span className="text-[10px] text-muted-foreground">Select one or more cities</span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-border bg-muted/20">
                  {REGION_OPTIONS.map((region) => {
                    const isSelected = wizardForm.selectedRegions.includes(region)
                    return (
                      <button
                        type="button"
                        key={region}
                        onClick={() => {
                          const updated = isSelected
                            ? wizardForm.selectedRegions.filter((r) => r !== region)
                            : [...wizardForm.selectedRegions, region]
                          setWizardForm({ ...wizardForm, selectedRegions: updated })
                        }}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background text-foreground border border-input hover:bg-accent'
                        }`}
                      >
                        {region}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="wizard-min-rooms" className="text-xs font-semibold text-foreground">Min Room Inventory</label>
                  <Input
                    id="wizard-min-rooms"
                    type="number"
                    value={wizardForm.minRooms}
                    onChange={(e) => setWizardForm({ ...wizardForm, minRooms: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="wizard-max-rooms" className="text-xs font-semibold text-foreground">Max Room Inventory</label>
                  <Input
                    id="wizard-max-rooms"
                    type="number"
                    value={wizardForm.maxRooms}
                    onChange={(e) => setWizardForm({ ...wizardForm, maxRooms: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Suppression Checks */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-foreground">Automated Suppression Filters</span>
                <div className="space-y-2 rounded-lg border border-border p-3 text-xs bg-muted/20">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wizardForm.suppressDnd}
                      onChange={(e) => setWizardForm({ ...wizardForm, suppressDnd: e.target.checked })}
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-foreground">Suppress TRAI DND (Do-Not-Disturb) & Opt-Out numbers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wizardForm.suppressRecentContacted}
                      onChange={(e) =>
                        setWizardForm({ ...wizardForm, suppressRecentContacted: e.target.checked })
                      }
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-foreground">Suppress hoteliers contacted within the past 14 days</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wizardForm.suppressActivePipeline}
                      onChange={(e) =>
                        setWizardForm({ ...wizardForm, suppressActivePipeline: e.target.checked })
                      }
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-foreground">Suppress active deals in qualified specialist pipeline</span>
                  </label>
                </div>
              </div>

              {/* Estimated Audience Badge */}
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 text-xs flex items-center justify-between">
                <span className="text-emerald-900 dark:text-emerald-200 font-medium">
                  Estimated Qualified Audience:
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  ~{estimatedAudienceCount} Hoteliers
                </span>
              </div>
            </div>
          )}

          {/* ── STEP 3: AGENT SELECTION & PITCH ── */}
          {wizardStep === 3 && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Select Autonomous Voice Agent
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {mockAiAgents.map((agent) => {
                    const isSelected = wizardForm.selectedAgentId === agent.id
                    return (
                      <div
                        key={agent.id}
                        onClick={() => setWizardForm({ ...wizardForm, selectedAgentId: agent.id })}
                        className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary'
                            : 'border-border bg-card hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-primary dark:bg-indigo-950/50">
                            <Bot className="size-4" />
                          </div>
                          {isSelected && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <h4 className="mt-2 font-bold text-sm text-foreground">{agent.name}</h4>
                        <p className="text-[11px] text-primary font-medium">{agent.role}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">
                          {agent.voiceTone}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wizard-script-language" className="text-xs font-semibold text-foreground">
                  Speech Language & Dialect Mode
                </label>
                <select
                  id="wizard-script-language"
                  value={wizardForm.scriptLanguage}
                  onChange={(e) => setWizardForm({ ...wizardForm, scriptLanguage: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value="Indian English, Hindi">Indian English & Conversational Hindi (Recommended)</option>
                  <option value="Hinglish (Natural Blend)">Hinglish (Natural Casual Business Tone)</option>
                  <option value="Indian English (Professional)">Indian English (Formal Hospitality Tone)</option>
                  <option value="Tamil, English">Tamil & English (South Regional)</option>
                </select>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5 text-xs">
                <span className="font-semibold text-foreground">Selected Agent Overview:</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  <strong>{selectedAgent.name}</strong> will handle calls with a speech response latency of{' '}
                  <code className="rounded bg-muted px-1 font-mono text-foreground">~{selectedAgent.testLatencyMs}ms</code>. Hoteliers expressing interest will automatically be routed to assigned specialist queue.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 4: SCHEDULE & PACING ── */}
          {wizardStep === 4 && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="wizard-start-time" className="text-xs font-semibold text-foreground">Calling Start Time (IST)</label>
                  <Input
                    id="wizard-start-time"
                    type="text"
                    value={wizardForm.startTime}
                    onChange={(e) => setWizardForm({ ...wizardForm, startTime: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="wizard-end-time" className="text-xs font-semibold text-foreground">Calling End Time (IST)</label>
                  <Input
                    id="wizard-end-time"
                    type="text"
                    value={wizardForm.endTime}
                    onChange={(e) => setWizardForm({ ...wizardForm, endTime: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Permitted Calling Days</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                    const isChecked = wizardForm.callingDays.includes(day)
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => {
                          const updated = isChecked
                            ? wizardForm.callingDays.filter((d) => d !== day)
                            : [...wizardForm.callingDays, day]
                          setWizardForm({ ...wizardForm, callingDays: updated })
                        }}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                          isChecked
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background text-foreground border border-input hover:bg-accent'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="wizard-max-attempts" className="text-xs font-semibold text-foreground">Max Attempts per Contact</label>
                  <select
                    id="wizard-max-attempts"
                    value={wizardForm.maxAttempts}
                    onChange={(e) => setWizardForm({ ...wizardForm, maxAttempts: e.target.value })}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                  >
                    <option value="1">1 attempt (No retries)</option>
                    <option value="2">2 attempts (Recommended)</option>
                    <option value="3">3 attempts maximum</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="wizard-retry-delay" className="text-xs font-semibold text-foreground">Retry Gap on Unanswered</label>
                  <select
                    id="wizard-retry-delay"
                    value={wizardForm.retryDelay}
                    onChange={(e) => setWizardForm({ ...wizardForm, retryDelay: e.target.value })}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                  >
                    <option value="4 hours">4 hours delay</option>
                    <option value="24 hours">24 hours (Next business day)</option>
                    <option value="48 hours">48 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: REVIEW CONFIRMATION & LAUNCH ── */}
          {wizardStep === 5 && (
            <div className="space-y-4 py-2">
              {/* Critical Demo Environment Disclaimer Box */}
              <div className="rounded-xl border border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/30 p-4 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                  <ShieldAlert className="size-4 shrink-0 text-amber-600" />
                  Local State Simulation Sandbox (No Outbound Calls)
                </div>
                <p className="leading-relaxed">
                  Launching this campaign updates your dashboard's local state to simulate an active calling blitz. <strong>No real telephone calls will be placed</strong>, no SIP trunks will be activated, and no integration with OmniDimension or third-party auto-dialers will occur.
                </p>
              </div>

              {/* Review Summary Card */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-xs">
                <div className="flex justify-between border-b border-border/70 pb-2">
                  <span className="text-muted-foreground font-medium">Campaign Name:</span>
                  <span className="font-bold text-foreground">
                    {wizardForm.name.trim() || 'Autonomous Outreach Blitz'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-border/70 pb-2">
                  <span className="text-muted-foreground font-medium">Target Segment:</span>
                  <span className="font-semibold text-foreground">{wizardForm.targetSegment}</span>
                </div>

                <div className="flex justify-between border-b border-border/70 pb-2">
                  <span className="text-muted-foreground font-medium">Selected Regions:</span>
                  <span className="font-semibold text-foreground">
                    {wizardForm.selectedRegions.join(', ')}
                  </span>
                </div>

                <div className="flex justify-between border-b border-border/70 pb-2">
                  <span className="text-muted-foreground font-medium">Estimated Audience:</span>
                  <span className="font-bold text-emerald-600">~{estimatedAudienceCount} Properties</span>
                </div>

                <div className="flex justify-between border-b border-border/70 pb-2">
                  <span className="text-muted-foreground font-medium">Assigned AI Agent:</span>
                  <span className="font-bold text-primary">{selectedAgent.name} ({selectedAgent.role})</span>
                </div>

                <div className="flex justify-between border-b border-border/70 pb-2">
                  <span className="text-muted-foreground font-medium">Calling Schedule:</span>
                  <span className="font-semibold text-foreground">
                    {wizardForm.callingDays.join(', ')} · {wizardForm.startTime} - {wizardForm.endTime} IST
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Max Attempts:</span>
                  <span className="font-semibold text-foreground">{wizardForm.maxAttempts}x per contact</span>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <DialogFooter className="flex items-center justify-between pt-2">
            <div>
              {wizardStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setWizardStep((s) => (s - 1) as 1 | 2 | 3 | 4 | 5)}
                  className="text-xs"
                >
                  <ArrowLeft className="mr-1 size-3.5" /> Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsWizardOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>

              {wizardStep < 5 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setWizardStep((s) => (s + 1) as 1 | 2 | 3 | 4 | 5)}
                  className="text-xs"
                >
                  Next <ArrowRight className="ml-1 size-3.5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleLaunchCampaign}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  <Play className="mr-1.5 size-3.5" /> Launch Campaign (Demo State)
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
