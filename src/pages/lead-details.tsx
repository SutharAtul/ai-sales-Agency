import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader, StatusBadge, EmptyState } from '@/components'
import { Button } from '@/components/ui/button'
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
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Bot,
  ArrowRightLeft,
  ShieldAlert,
  Send,
  PhoneCall,
  Check,
  Building,
} from 'lucide-react'
import { useMockData } from '@/context'
import type { FollowupItem } from '@/types'

export function LeadDetailsPage() {
  const { leadId } = useParams<{ leadId: string }>()
  const { leads, calls, handoffs, addFollowup, addCall } = useMockData()

  // Modals state
  const [isProposalOpen, setIsProposalOpen] = useState(false)
  const [proposalSubject, setProposalSubject] = useState('')
  const [proposalNotes, setProposalNotes] = useState('')

  const [isScheduleDemoOpen, setIsScheduleDemoOpen] = useState(false)
  const [demoDate, setDemoDate] = useState('2026-10-30')
  const [demoTime, setDemoTime] = useState('02:30 PM IST')
  const [demoSpecialist, setDemoSpecialist] = useState('Neha Sharma')
  const [demoNotes, setDemoNotes] = useState('')

  const [isCallModalOpen, setIsCallModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState('Ava (Lead Qualifier)')
  const [isCallSimulating, setIsCallSimulating] = useState(false)
  const [callSimulationFinished, setCallSimulationFinished] = useState(false)

  // Notification feedback
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null)

  // Find lead by id or slug or fallback
  const lead =
    leads.find(
      (l) =>
        l.id === leadId ||
        l.name.toLowerCase().replace(/\s+/g, '-') === leadId ||
        l.property.toLowerCase().replace(/\s+/g, '-') === leadId,
    ) || (leadId ? undefined : leads[0])

  if (!lead) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={<Building className="size-6 text-muted-foreground" />}
          title="Lead Record Not Found"
          description="The requested hotelier prospect could not be located in the current pipeline."
          action={
            <Button size="sm" asChild>
              <Link to="/leads">
                <ArrowLeft className="mr-1.5 size-3.5" />
                Return to Leads Pipeline
              </Link>
            </Button>
          }
        />
      </div>
    )
  }

  // Related calls and handoff
  const relatedCall = calls.find((c) => c.leadId === lead.id || c.property === lead.property)
  const relatedHandoff = handoffs.find((h) => h.leadId === lead.id || h.property === lead.property)

  // Action: Send Proposal (Simulated)
  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProposalOpen(false)
    setFeedbackBanner(
      `✓ Fictional proposal dispatched to ${lead.email || 'partner@demo.in'} (Simulation only · No real email sent).`
    )
    setTimeout(() => setFeedbackBanner(null), 6000)
  }

  // Action: Schedule Demo (Creates real FollowupItem in shared state)
  const handleScheduleDemo = (e: React.FormEvent) => {
    e.preventDefault()

    const nameParts = lead.name.split(' ')
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : lead.name.slice(0, 2).toUpperCase()

    const newFollowup: FollowupItem = {
      id: `task-${Date.now()}`,
      leadId: lead.id,
      assignedAgentId: 'agent-neha',
      name: lead.name,
      property: lead.property,
      city: lead.city,
      phone: lead.phone,
      assignedAgent: demoSpecialist,
      preferredCallbackWindow: `${demoDate}, ${demoTime}`,
      scheduledDate: demoDate,
      scheduledTime: demoTime,
      reason: demoNotes.trim() || `Live demonstration of JusBid guest bidding engine and PMS sync for ${lead.property}.`,
      priority: 'High',
      status: 'upcoming',
      taskType: 'Demo Walkthrough',
      type: 'Demo Walkthrough',
      time: `${demoDate}, ${demoTime.split(' ')[0]}`,
      initials,
      color: 'rose',
      notes: demoNotes.trim() || 'Demo scheduled via Lead Details action.',
      isSimulatedDemo: true,
    }

    addFollowup(newFollowup)
    setIsScheduleDemoOpen(false)
    setFeedbackBanner(
      `✓ Live demonstration task scheduled with ${demoSpecialist} for ${demoDate} at ${demoTime}. Added to Follow-up queue!`
    )
    setTimeout(() => setFeedbackBanner(null), 6000)
  }

  // Action: Run Simulated Call
  const handleRunSimulatedCall = () => {
    setIsCallSimulating(true)
    setCallSimulationFinished(false)

    setTimeout(() => {
      setIsCallSimulating(false)
      setCallSimulationFinished(true)

      const simulatedCall = {
        id: `call-sim-${Date.now()}`,
        leadId: lead.id,
        name: lead.name,
        property: lead.property,
        city: lead.city,
        phone: lead.phone,
        time: 'Just now',
        date: 'Today, Oct 31',
        duration: '02:45',
        durationSeconds: 165,
        outcome: 'Demo booked',
        agent: selectedAgent,
        agentId: 'agent-ava',
        campaign: 'Direct Operator Trigger',
        campaignId: 'camp-direct',
        interestClassification: 'High' as const,
        intentScore: 88,
        tone: 'emerald',
        aiSummary: `Simulated outreach test with ${lead.name} (${lead.property}). Decision maker expressed interest in 4% commission direct booking engine and agreed to a follow-up walkthrough.`,
        objections: ['Rate parity verification (resolved: explained closed-loop bidding)'],
        extractedNextAction: 'Review follow-up queue for scheduled demonstration.',
        technicalStatus: {
          sttModel: 'Deepgram Nova-2 [Simulated]',
          llmModel: 'Claude 3.5 Sonnet [Simulated]',
          ttsVoice: 'Cartesia Sonic [Simulated]',
          latencyMs: 220,
          sttConfidence: '98.5%',
          packetLoss: '0.0%',
          completionReason: 'Simulated Demo Call Completed',
          sipCode: 200,
        },
        transcript: [
          {
            id: 't-1',
            speaker: 'agent' as const,
            speakerName: selectedAgent,
            timestamp: '00:00',
            text: `Namaste ${lead.name}! This is ${selectedAgent.split(' ')[0]} calling from JusBid regarding direct guest booking distribution for ${lead.property}.`,
          },
          {
            id: 't-2',
            speaker: 'user' as const,
            speakerName: lead.name,
            timestamp: '00:15',
            text: 'Hello! Yes, we operate in the area and are always looking to lower OTA commission expenses.',
          },
        ],
        isSimulatedDemo: true,
      }

      addCall(simulatedCall)
      setFeedbackBanner(
        `✓ Simulated AI qualifier call completed successfully! Interaction log recorded in Call History.`
      )
    }, 2200)
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-xs text-muted-foreground">
          <Link to="/leads">
            <ArrowLeft className="mr-1.5 size-3.5" />
            Back to Hotelier Leads
          </Link>
        </Button>
      </div>

      {/* Feedback Banner */}
      {feedbackBanner && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="size-4 text-emerald-400 shrink-0" />
            <span>{feedbackBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      <PageHeader
        eyebrow="LEAD PROFILE & AI QUALIFICATION"
        title={lead.property}
        description={`Owner: ${lead.name} · ${lead.location} · Lead ID: ${lead.id}`}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setProposalSubject(`JusBid Direct Booking Partnership Proposal — ${lead.property}`)
            setIsProposalOpen(true)
          }}
        >
          <Mail className="mr-1.5 size-3.5" />
          Send Proposal
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsScheduleDemoOpen(true)}
        >
          <Calendar className="mr-1.5 size-3.5" />
          Schedule Demo
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setCallSimulationFinished(false)
            setIsCallModalOpen(true)
          }}
        >
          <Phone className="mr-1.5 size-3.5" />
          Simulate AI Call
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Property Overview */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h3 className="font-semibold text-foreground">Property Information</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Property Name</span>
                <p className="mt-1 text-sm font-medium text-foreground">{lead.property}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Location</span>
                <p className="mt-1 text-sm font-medium text-foreground">{lead.location}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Room Inventory</span>
                <p className="mt-1 text-sm font-medium text-foreground">{lead.rooms} rooms</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Acquisition Channel</span>
                <p className="mt-1 text-sm font-medium text-foreground">{lead.source}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Phone Number (Synthetic)</span>
                <p className="mt-1 text-sm font-medium font-mono text-foreground">{lead.phone}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Direct Email (Demo)</span>
                <p className="mt-1 text-sm font-medium text-foreground">{lead.email}</p>
              </div>
            </div>

            {lead.notes && (
              <div className="mt-4 rounded-lg border border-border/60 bg-muted/20 p-3.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Internal Notes & History</span>
                <p className="mt-1 text-xs text-foreground/90 leading-relaxed">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* AI Voice Qualification Summary */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-3">
            <h3 className="font-semibold text-foreground">AI Voice Qualification Summary</h3>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-200 text-xs">
                <CheckCircle2 className="size-4" />
                Qualified by Ava (Lead Qualifier Agent) · {lead.lastContact}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-300/80">
                Decision-maker expressed keen interest in shifting booking share away from OTAs. Property operates in an eligible room category with verified price floor potential. Ready for human specialist demonstration.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground">Lead Status & Ownership</h3>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current Stage</span>
              <StatusBadge variant="qualified" dot>{lead.status}</StatusBadge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">JusBid Fit Score</span>
              <span className="font-bold text-emerald-600">{lead.score}/100</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Assigned Specialist</span>
              <span className="text-xs font-semibold text-foreground">
                {relatedHandoff?.assignedAgent || 'Neha Sharma'}
              </span>
            </div>
            <div className="mt-6 border-t border-border pt-4 space-y-2">
              {relatedHandoff && (
                <Button className="w-full" size="sm" variant="outline" asChild>
                  <Link to={`/onboarding/${relatedHandoff.id}`}>
                    <ArrowRightLeft className="mr-1.5 size-3.5" />
                    Open Onboarding Ticket
                  </Link>
                </Button>
              )}
              {relatedCall && (
                <Button className="w-full" size="sm" variant="outline" asChild>
                  <Link to={`/calls/${relatedCall.id}`}>
                    <Bot className="mr-1.5 size-3.5" />
                    View AI Call Transcript
                  </Link>
                </Button>
              )}
              <Button className="w-full" size="sm" asChild>
                <Link to="/handoffs">View in Handoff Queue</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────── MODALS (FRONTEND ACTIONS) ────────────────── */}

      {/* Send Proposal Modal */}
      <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSendProposal} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Send Commercial Proposal</DialogTitle>
              <DialogDescription>
                Simulate sending a tailored PDF proposal deck to {lead.property}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <label htmlFor="proposal-email" className="text-xs font-medium text-foreground">Recipient Email</label>
                <input
                  id="proposal-email"
                  type="text"
                  disabled
                  value={lead.email}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-muted/40 px-3 text-xs text-muted-foreground"
                />
              </div>

              <div>
                <label htmlFor="proposal-subject" className="text-xs font-medium text-foreground">Subject Line</label>
                <input
                  id="proposal-subject"
                  type="text"
                  value={proposalSubject}
                  onChange={(e) => setProposalSubject(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="proposal-notes" className="text-xs font-medium text-foreground">Proposal Inclusions & Notes</label>
                <textarea
                  id="proposal-notes"
                  rows={3}
                  placeholder="e.g. Include 4% success commission schedule and sample PMS rate floor calibration."
                  value={proposalNotes}
                  onChange={(e) => setProposalNotes(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-[11px] text-amber-200 flex items-start gap-2">
                <ShieldAlert className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <span>Demo Environment: No external mail servers are contacted. Proposal delivery is recorded in local session state.</span>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsProposalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                <Send className="mr-1.5 size-3.5" />
                Dispatch Demo Proposal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Demo Modal */}
      <Dialog open={isScheduleDemoOpen} onOpenChange={setIsScheduleDemoOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleScheduleDemo} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Schedule Live Specialist Demonstration</DialogTitle>
              <DialogDescription>
                Schedule an onboarding walkthrough and add a live task to the Follow-up queue.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="demo-date" className="text-xs font-medium text-foreground">Scheduled Date</label>
                  <input
                    id="demo-date"
                    type="date"
                    value={demoDate}
                    onChange={(e) => setDemoDate(e.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label htmlFor="demo-time" className="text-xs font-medium text-foreground">Time Window (IST)</label>
                  <select
                    id="demo-time"
                    value={demoTime}
                    onChange={(e) => setDemoTime(e.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="11:00 AM IST">11:00 AM IST</option>
                    <option value="02:30 PM IST">02:30 PM IST</option>
                    <option value="04:00 PM IST">04:00 PM IST</option>
                    <option value="05:30 PM IST">05:30 PM IST</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="demo-specialist" className="text-xs font-medium text-foreground">Assigned Human Specialist</label>
                <select
                  id="demo-specialist"
                  value={demoSpecialist}
                  onChange={(e) => setDemoSpecialist(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Neha Sharma">Neha Sharma (Senior Sales Specialist)</option>
                  <option value="Arjun Patel">Arjun Patel (Enterprise Onboarding)</option>
                  <option value="Sara Thomas">Sara Thomas (Boutique & Coastal)</option>
                  <option value="Kabir Khanna">Kabir Khanna (Hospitality Growth)</option>
                </select>
              </div>

              <div>
                <label htmlFor="demo-notes" className="text-xs font-medium text-foreground">Agenda / Focus Points</label>
                <textarea
                  id="demo-notes"
                  rows={2}
                  placeholder="e.g. Demonstrate PMS ARI sync and present rate parity safeguards."
                  value={demoNotes}
                  onChange={(e) => setDemoNotes(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsScheduleDemoOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Confirm & Add Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Simulate AI Call Modal */}
      <Dialog open={isCallModalOpen} onOpenChange={setIsCallModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="size-5 text-indigo-500" />
                Simulate Autonomous Voice Call
              </DialogTitle>
              <DialogDescription>
                Simulate an outbound AI qualifier outreach turn with {lead.name} at {lead.property}.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs text-indigo-300 flex items-start gap-2">
              <ShieldAlert className="size-4 shrink-0 text-indigo-400 mt-0.5" />
              <span>
                <strong>Sandbox Guardrail:</strong> This is a frontend demonstration simulator. No telephone connection is established and no telephony carrier is billed.
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="call-agent-select" className="text-xs font-medium text-foreground">Select Voice Agent</label>
                <select
                  id="call-agent-select"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  disabled={isCallSimulating}
                  className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Ava (Lead Qualifier)">Ava (Lead Qualifier · Indian English / Hindi)</option>
                  <option value="Aria (Concierge Specialist)">Aria (Concierge Specialist · English)</option>
                  <option value="Dev (Follow-up Specialist)">Dev (Follow-up Specialist · Hindi / Hinglish)</option>
                </select>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Target Hotelier:</span>
                  <span className="font-semibold text-foreground">{lead.name}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Synthetic Dial Number:</span>
                  <span className="font-mono text-foreground">{lead.phone}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Property Key Count:</span>
                  <span className="text-foreground">{lead.rooms} rooms</span>
                </div>
              </div>

              {isCallSimulating && (
                <div className="flex flex-col items-center justify-center py-6 space-y-3 text-xs text-primary animate-pulse">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-primary animate-ping" />
                    <span className="font-semibold">Simulating voice stream & intent classification...</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Transcribing turn, verifying STT confidence (98.5%), and synthesizing speech response.</p>
                </div>
              )}

              {callSimulationFinished && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                    <CheckCircle2 className="size-4" />
                    Turn Qualification Completed!
                  </div>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                    Lead intent score evaluated at <strong>88/100 (High)</strong>. Call log successfully added to Call History table.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCallModalOpen(false)}
              >
                Close
              </Button>
              {!callSimulationFinished ? (
                <Button
                  size="sm"
                  onClick={handleRunSimulatedCall}
                  disabled={isCallSimulating}
                >
                  <PhoneCall className="mr-1.5 size-3.5" />
                  {isCallSimulating ? 'Dialing Mock Stream...' : 'Run Simulated Call'}
                </Button>
              ) : (
                <Button size="sm" asChild>
                  <Link to="/calls">View in Call History</Link>
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
