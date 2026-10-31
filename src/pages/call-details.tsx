import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PageHeader, StatusBadge, EmptyState } from '@/components'
import type { StatusVariant } from '@/components'
import { Button } from '@/components/ui/button'
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
  ArrowLeft,
  Play,
  Pause,
  Bot,
  User,
  Sparkles,
  ShieldAlert,
  Building,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  ArrowRight,
  RotateCcw,
  Volume2,
  PhoneCall,
  UserCheck,
} from 'lucide-react'
import { useMockData } from '@/context'
import type { Call, HandoffItem, HandoffStatus } from '@/types'

function mapOutcomeToVariant(outcome: string): StatusVariant {
  switch (outcome.toLowerCase()) {
    case 'demo booked':
      return 'qualified'
    case 'interested':
      return 'hot'
    case 'qualified lead':
      return 'qualified'
    case 'handoff requested':
      return 'in-conversation'
    case 'callback requested':
      return 'follow-up'
    case 'objection raised':
      return 'scheduled'
    case 'not interested':
      return 'paused'
    default:
      return 'default'
  }
}

export function CallDetailsPage() {
  const { callId } = useParams<{ callId: string }>()
  const navigate = useNavigate()
  const { calls, handoffs, leads, teamMembers, updateCall, addHandoff } = useMockData()

  // Locate call by ID or fallback to first call if no ID passed
  const call: Call | undefined =
    calls.find((c) => c.id === callId) || (callId ? undefined : calls[0])

  // Simulated audio playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.0x')

  // Workflow Dialog States
  const [isChangeOutcomeOpen, setIsChangeOutcomeOpen] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState('Interested')

  const [isCreateHandoffOpen, setIsCreateHandoffOpen] = useState(false)
  const [handoffPriority, setHandoffPriority] = useState<'High' | 'Medium' | 'Low'>('High')
  const [handoffAgent, setHandoffAgent] = useState(teamMembers[0]?.name || 'Neha Sharma')
  const [callbackWindow, setCallbackWindow] = useState('Today within 2 hours')
  const [handoffReason, setHandoffReason] = useState(
    'AI Voice Outreach verified strong hotelier interest in 0% commission direct bidding model.'
  )

  // Feedback Notification Banner
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null)

  if (!call) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={<PhoneCall className="size-6 text-muted-foreground" />}
          title="Call Record Not Found"
          description="The requested call ID or audio transcript could not be located in this session."
          action={
            <Button size="sm" asChild>
              <Link to="/calls">
                <ArrowLeft className="mr-1.5 size-3.5" />
                Return to Call History
              </Link>
            </Button>
          }
        />
      </div>
    )
  }

  // Find corresponding handoff if exists
  const relatedHandoff = handoffs.find(
    (h) => (call.leadId && h.leadId === call.leadId) || h.property.toLowerCase() === call.property.toLowerCase()
  )

  // Find linked lead
  const relatedLead = leads.find((l) => l.id === call.leadId || l.property.toLowerCase() === call.property.toLowerCase())

  // Handle Changing Call Outcome
  const handleConfirmOutcomeChange = () => {
    let classification: 'High' | 'Medium' | 'Low' | 'Unresponsive' = 'Medium'
    let score = 75

    if (selectedOutcome === 'Interested' || selectedOutcome === 'Qualified Lead' || selectedOutcome === 'Demo booked') {
      classification = 'High'
      score = selectedOutcome === 'Demo booked' ? 95 : selectedOutcome === 'Qualified Lead' ? 92 : 88
    } else if (selectedOutcome === 'Not interested') {
      classification = 'Low'
      score = 25
    } else if (selectedOutcome === 'Voicemail left') {
      classification = 'Unresponsive'
      score = 15
    }

    updateCall(call.id, {
      outcome: selectedOutcome,
      interestClassification: classification,
      intentScore: score,
    })

    setIsChangeOutcomeOpen(false)
    setFeedbackBanner(
      `✓ Call outcome updated to "${selectedOutcome}" (${classification} intent score: ${score}%). AI interest classification never marks a hotelier as onboarded; human specialist verification is required.`
    )
    setTimeout(() => setFeedbackBanner(null), 7000)
  }

  // Handle Creating Human Handoff Ticket
  const handleConfirmCreateHandoff = () => {
    const member = teamMembers.find((m) => m.name === handoffAgent)
    const newHandoffId = `handoff-${Date.now()}`
    const initialStatus: HandoffStatus = handoffAgent ? 'assigned' : 'unassigned'

    const newHandoff: HandoffItem = {
      id: newHandoffId,
      leadId: call.leadId || relatedLead?.id,
      callId: call.id,
      name: call.name,
      property: call.property,
      city: call.city,
      phone: call.phone,
      rooms: relatedLead?.rooms || 35,
      priority: handoffPriority,
      interestLevel: 'High',
      status: initialStatus,
      reason: handoffReason,
      callSummary: call.aiSummary,
      requestedCallbackWindow: callbackWindow,
      assignedAgentId: member?.id || null,
      assignedAgent: member ? member.name : null,
      assignedAgentRole: member?.role,
      age: 'Just now',
      time: 'Just now',
      initials: call.name
        .split(' ')
        .map((n) => n[0])
        .join(''),
      color: 'indigo',
      notes: [
        {
          id: `note-${Date.now()}`,
          author: call.agent,
          text: `Handoff created from call ${call.id} (${call.duration}). Outcome: ${call.outcome}.`,
          createdAt: 'Just now',
        },
      ],
      checklist: [
        {
          id: 'chk-1',
          label: '1. AI Voice Discovery & Room Count Qualification',
          description: 'Completed autonomously by AI Voice Fleet.',
          completed: true,
          requiresHumanVerification: false,
          completedAt: 'Just now',
          completedBy: call.agent,
        },
        {
          id: 'chk-2',
          label: '2. Commercial Terms & Zero-Commission Demo',
          description: 'Demonstrate live guest bidding and 0% OTA commission model.',
          completed: false,
          requiresHumanVerification: true,
        },
        {
          id: 'chk-3',
          label: '3. Rate Floor Protection & Room Type Sync',
          description: 'Configure minimum floor prices and inventory allocation.',
          completed: false,
          requiresHumanVerification: true,
        },
        {
          id: 'chk-4',
          label: '4. Legal Agreement & GST Documentation',
          description: 'Execute JusBid onboarding agreement and verify GSTIN certificate.',
          completed: false,
          requiresHumanVerification: true,
        },
        {
          id: 'chk-5',
          label: '5. Human-Verified Go-Live Certification',
          description: 'Final sign-off by senior human specialist to activate hotelier live bidding.',
          completed: false,
          requiresHumanVerification: true,
        },
      ],
      contactAttempts: [],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          title: 'Handoff Ticket Created',
          description: `Transferred to human specialist handoff queue. Assigned to ${member ? member.name : 'Unassigned pool'}.`,
          timestamp: 'Just now',
          actor: call.agent,
          type: 'ai',
        },
      ],
      createdAt: 'Just now',
      isSimulatedDemo: true,
    }

    addHandoff(newHandoff)
    setIsCreateHandoffOpen(false)
    navigate(`/onboarding/${newHandoffId}`)
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-xs text-muted-foreground">
          <Link to="/calls">
            <ArrowLeft className="mr-1.5 size-3.5" />
            Back to Call History
          </Link>
        </Button>
      </div>

      {/* Feedback Banner */}
      {feedbackBanner && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
            <span>{feedbackBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="text-xs text-emerald-400/80 hover:text-emerald-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        eyebrow="VOICE CALL LOG & SIMULATED TRANSCRIPT"
        title={`Call Record: ${call.property}`}
        description={`Hotelier: ${call.name} · ${call.city} · Duration: ${call.duration} · Call ID: ${call.id}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={call.leadId ? `/leads/${call.leadId}` : '/leads'}>
              <Building className="mr-1.5 size-3.5" />
              View Hotel Lead
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedOutcome(call.outcome)
              setIsChangeOutcomeOpen(true)
            }}
          >
            Change Outcome
          </Button>

          {relatedHandoff ? (
            <Button size="sm" asChild>
              <Link to={`/onboarding/${relatedHandoff.id}`}>
                View Handoff Ticket
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          ) : (
            <Button size="sm" onClick={() => setIsCreateHandoffOpen(true)}>
              Transfer to Specialist
              <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
          )}
        </div>
      </PageHeader>


      {/* Safety Notice Banner */}
      <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>
            <strong className="text-foreground">Simulated Call Record:</strong> This conversation, audio scrubber, and transcript are synthetic mock demonstrations. No telephone call was placed, no real audio was captured, and no voice API was invoked.
          </span>
        </div>
        <span className="hidden sm:inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
          Synthetic Sandbox Mode
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Simulated Audio Player & Complete Transcript */}
        <div className="space-y-6 lg:col-span-2">
          {/* Simulated Audio Player */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Simulated Audio Playback
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                Mock Speech Synthesizer
              </Badge>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <Button
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="size-11 rounded-full shrink-0 shadow-xs"
                title={isPlaying ? 'Pause audio' : 'Play simulated audio'}
              >
                {isPlaying ? (
                  <Pause className="size-5 fill-current" />
                ) : (
                  <Play className="size-5 fill-current ml-0.5" />
                )}
              </Button>

              <div className="min-w-0 flex-1">
                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                  <span>{isPlaying ? '01:24' : '00:00'}</span>
                  <span>{call.duration}</span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-primary transition-all duration-300 ${
                      isPlaying ? 'w-2/5' : 'w-0'
                    }`}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPlaybackSpeed((prev) =>
                    prev === '1.0x' ? '1.25x' : prev === '1.25x' ? '1.5x' : '1.0x',
                  )
                }}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                {playbackSpeed}
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground italic pt-1">
              Simulated audio stream generated from turn transcript timings. No telephony media files stored.
            </p>
          </div>

          {/* Turn-by-Turn Transcript Dialogue */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  Complete Call Transcript
                </h3>
                <p className="text-xs text-muted-foreground">
                  {call.transcript.length} turns recorded by {call.agent}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(false)}
                className="h-7 text-xs text-muted-foreground"
              >
                <RotateCcw className="mr-1 size-3" /> Reset
              </Button>
            </div>

            <div className="space-y-4 pt-1">
              {call.transcript.map((turn) => {
                const isAgent = turn.speaker === 'agent'
                return (
                  <div
                    key={turn.id}
                    className={`flex gap-3 text-xs leading-relaxed ${
                      isAgent ? 'bg-muted/30 -mx-3 p-3 rounded-lg' : 'p-1'
                    }`}
                  >
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full font-bold ${
                        isAgent
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {isAgent ? <Bot className="size-4" /> : <User className="size-4" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {turn.speakerName}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {turn.timestamp}
                        </span>
                        {isAgent && (
                          <span className="rounded bg-indigo-50 px-1 text-[9px] font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                            AI Agent
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-muted-foreground leading-relaxed">
                        "{turn.text}"
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights, Objections, Next Actions & Technical Diagnostics */}
        <div className="space-y-6">
          {/* Call Metadata & Outcome */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Interaction Overview</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Outcome:</span>
                <div className="flex items-center gap-1.5">
                  <StatusBadge variant={mapOutcomeToVariant(call.outcome)} dot>
                    {call.outcome}
                  </StatusBadge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedOutcome(call.outcome)
                      setIsChangeOutcomeOpen(true)
                    }}
                    className="h-6 px-1.5 text-[11px] text-primary hover:underline"
                  >
                    Change
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact Name:</span>
                <span className="font-semibold text-foreground">{call.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Property:</span>
                <span className="font-medium text-foreground">{call.property}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium text-foreground">{call.city}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Demo Phone:</span>
                <span className="font-mono text-[11px] text-foreground">{call.phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Call Date & Time:</span>
                <span className="font-medium text-foreground">
                  {call.date} · {call.time}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium text-foreground">{call.duration}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Campaign:</span>
                <span className="font-medium text-foreground truncate max-w-[170px]" title={call.campaign}>
                  {call.campaign}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Voice Agent:</span>
                <span className="font-medium text-foreground">{call.agent}</span>
              </div>
            </div>
          </div>

          {/* AI Call Summary */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2.5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" />
              Concise AI Synopsis
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {call.aiSummary}
            </p>
          </div>

          {/* Interest Classification & Intent Score */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Interest Classification</h3>
              <Badge
                variant="outline"
                className={`text-[10px] font-bold ${
                  call.interestClassification === 'High'
                    ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                    : call.interestClassification === 'Medium'
                      ? 'border-blue-500/40 text-blue-700 dark:text-blue-300'
                      : 'border-muted text-muted-foreground'
                }`}
              >
                {call.interestClassification} Intent
              </Badge>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>JusBid Propensity Score</span>
                <span className="font-bold text-foreground">{call.intentScore}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${call.intentScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Extracted Objections */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <AlertTriangle className="size-4 text-amber-500" />
              Extracted Hotelier Objections
            </h3>

            {call.objections.length === 0 ? (
              <p className="text-xs text-muted-foreground">No objections raised during call.</p>
            ) : (
              <ul className="space-y-2 text-xs">
                {call.objections.map((obj, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg bg-amber-50/60 p-2.5 text-amber-900 border border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-200 dark:border-amber-900/40"
                  >
                    <span className="size-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Extracted Next Action */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/30 p-5 shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-indigo-900 dark:text-indigo-200">
              <CheckCircle2 className="size-4 text-indigo-600 dark:text-indigo-400" />
              Extracted Next Action
            </div>
            <p className="text-indigo-950/90 dark:text-indigo-200/90 leading-relaxed">
              {call.extractedNextAction}
            </p>
          </div>

          {/* Technical Telephony Status */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Cpu className="size-4 text-primary" />
              Technical Diagnostics
            </h3>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>STT Speech Model:</span>
                <span className="font-mono text-[11px] text-foreground">
                  {call.technicalStatus.sttModel}
                </span>
              </div>
              <div className="flex justify-between">
                <span>LLM Engine:</span>
                <span className="font-mono text-[11px] text-foreground truncate max-w-[160px]" title={call.technicalStatus.llmModel}>
                  {call.technicalStatus.llmModel}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Speech Latency:</span>
                <span className="font-semibold text-foreground">
                  {call.technicalStatus.latencyMs}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>STT Confidence:</span>
                <span className="font-semibold text-emerald-600">
                  {call.technicalStatus.sttConfidence}
                </span>
              </div>
              <div className="flex justify-between">
                <span>SIP Disconnect Code:</span>
                <span className="font-mono text-[11px] text-foreground">
                  {call.technicalStatus.sipCode} OK
                </span>
              </div>
              <div className="flex justify-between">
                <span>Termination Reason:</span>
                <span className="font-medium text-foreground truncate max-w-[160px]" title={call.technicalStatus.completionReason}>
                  {call.technicalStatus.completionReason}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* DIALOG 1: CHANGE SIMULATED CALL OUTCOME                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog open={isChangeOutcomeOpen} onOpenChange={setIsChangeOutcomeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Update Simulated Call Outcome
            </DialogTitle>
            <DialogDescription>
              Modify the qualification outcome for this simulated voice interaction with <strong>{call.property}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="outcome-select" className="text-xs font-semibold text-foreground">
                Simulated Outcome
              </label>
              <select
                id="outcome-select"
                value={selectedOutcome}
                onChange={(e) => setSelectedOutcome(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="Interested">Interested (High Intent · 88% Score)</option>
                <option value="Qualified Lead">Qualified Lead (Hot Pipeline · 92% Score)</option>
                <option value="Demo booked">Demo booked (Demo Scheduled · 95% Score)</option>
                <option value="Callback requested">Callback requested (Follow-up Required · 72% Score)</option>
                <option value="Voicemail left">Voicemail left (Unresponsive · 15% Score)</option>
                <option value="Not interested">Not interested (Low Intent · 25% Score)</option>
              </select>
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] text-amber-900 dark:text-amber-200">
              <strong className="block mb-0.5">Governance Rule:</strong>
              Marking an interaction as "Interested" updates lead interest to High, but NEVER marks the hotelier as onboarded. Final onboarding strictly requires verified human specialist sign-off.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsChangeOutcomeOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmOutcomeChange}>
              Confirm Outcome Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* DIALOG 2: TRANSFER TO HUMAN SPECIALIST (CREATE HANDOFF)      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog open={isCreateHandoffOpen} onOpenChange={setIsCreateHandoffOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              Transfer to Human Onboarding Specialist
            </DialogTitle>
            <DialogDescription>
              Create an onboarding handoff ticket for <strong>{call.property}</strong> from this voice outreach interaction.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="handoff-agent-select" className="text-xs font-semibold text-foreground">
                Assign Specialist
              </label>
              <select
                id="handoff-agent-select"
                value={handoffAgent}
                onChange={(e) => setHandoffAgent(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name} ({member.role}) · {member.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="handoff-priority" className="text-xs font-semibold text-foreground">
                  Priority
                </label>
                <select
                  id="handoff-priority"
                  value={handoffPriority}
                  onChange={(e) => setHandoffPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="callback-window" className="text-xs font-semibold text-foreground">
                  Preferred Window
                </label>
                <input
                  id="callback-window"
                  type="text"
                  value={callbackWindow}
                  onChange={(e) => setCallbackWindow(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="handoff-reason" className="text-xs font-semibold text-foreground">
                Handoff Reason & Objective
              </label>
              <textarea
                id="handoff-reason"
                rows={3}
                value={handoffReason}
                onChange={(e) => setHandoffReason(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-2.5 text-[11px] text-muted-foreground">
              Creates a dedicated human onboarding ticket in the Handoff Queue with milestone tracking and contact attempt logging.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsCreateHandoffOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmCreateHandoff}>
              Create Handoff & Open Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
