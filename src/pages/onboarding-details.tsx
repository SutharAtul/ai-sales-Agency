import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader, StatusBadge, EmptyState } from '@/components'
import type { StatusVariant } from '@/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  CheckCircle2,
  Phone,
  Calendar,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Building,
  UserPlus,
  FileText,
  Tag,
  History,
  PhoneCall,
  Mail,
  MessageSquare,
  X,
  CalendarClock,
} from 'lucide-react'
import { useMockData } from '@/context'
import type {
  HandoffStatus,
  OnboardingActivity,
  FollowupItem,
} from '@/types'

function mapHandoffStatusToVariant(status: HandoffStatus): StatusVariant {
  switch (status) {
    case 'completed':
      return 'qualified'
    case 'contacted':
      return 'hot'
    case 'assigned':
      return 'in-conversation'
    case 'follow-up required':
      return 'follow-up'
    case 'unassigned':
      return 'new'
    default:
      return 'default'
  }
}

export function OnboardingDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const {
    handoffs,
    updateHandoff,
    reassignHandoff,
    addHandoffNote,
    logContactAttempt,
    toggleChecklistMilestone,
    addFollowup,
    teamMembers,
  } = useMockData()

  // Locate the handoff item by ID or default to the first if no ID passed
  const item = handoffs.find((h) => h.id === id) || (id ? undefined : handoffs[0])

  // Interactive modal states
  const [isReassignOpen, setIsReassignOpen] = useState(false)
  const [selectedNewAgent, setSelectedNewAgent] = useState(
    item?.assignedAgent || teamMembers[0]?.name || 'Sunita Rao',
  )

  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [noteContent, setNoteContent] = useState('')

  const [isLogAttemptOpen, setIsLogAttemptOpen] = useState(false)
  const [attemptType, setAttemptType] = useState<'call' | 'whatsapp' | 'email' | 'demo'>('call')
  const [attemptOutcome, setAttemptOutcome] = useState('Spoke with GM')
  const [attemptNotes, setAttemptNotes] = useState('')

  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<HandoffStatus>(item?.status || 'unassigned')

  // Follow-up task modal states
  const [isScheduleFollowupOpen, setIsScheduleFollowupOpen] = useState(false)
  const [followupDate, setFollowupDate] = useState('Tomorrow')
  const [followupWindow, setFollowupWindow] = useState('11:00 AM - 12:00 PM')
  const [followupReason, setFollowupReason] = useState('PMS integration walkthrough & direct bid floor calibration')
  const [followupPriority, setFollowupPriority] = useState<'High' | 'Medium' | 'Low'>('High')

  // Feedback banner
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null)

  if (!item) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={<Building className="size-6 text-muted-foreground" />}
          title="Onboarding Record Not Found"
          description="The requested hotelier handoff record could not be located in this session."
          action={
            <Button size="sm" asChild>
              <Link to="/handoffs">
                <ArrowLeft className="mr-1.5 size-3.5" />
                Return to Handoff Queue
              </Link>
            </Button>
          }
        />
      </div>
    )
  }

  // Toggle checklist milestone
  const handleToggleMilestone = (milestoneId: string) => {
    const currentChecklist = item.checklist || []
    const target = currentChecklist.find((m) => m.id === milestoneId)
    if (!target) return

    // If attempting to mark final completion milestone, confirm first
    if (!target.completed && target.requiresHumanVerification && milestoneId === 'chk-5') {
      setPendingStatus('completed')
      setIsStatusConfirmOpen(true)
      return
    }

    toggleChecklistMilestone(item.id, milestoneId, item.assignedAgent || 'Human Specialist')
    setFeedbackBanner(`Updated checklist milestone "${target.label}".`)
  }

  // Handle Specialist Reassignment with Confirmation
  const handleConfirmReassignment = () => {
    const member = teamMembers.find((m) => m.name === selectedNewAgent)
    const role = member?.role || 'Onboarding Specialist'

    reassignHandoff(item.id, selectedNewAgent, role, member?.id)

    setIsReassignOpen(false)
    setFeedbackBanner(`Assigned ${selectedNewAgent} as owner for ${item.property}.`)
  }

  // Handle Logging Contact Attempt
  const handleLogContactAttempt = (e: React.FormEvent) => {
    e.preventDefault()
    if (!attemptOutcome.trim()) return

    logContactAttempt(item.id, {
      type: attemptType,
      outcome: attemptOutcome.trim(),
      time: 'Just now',
      agent: item.assignedAgent || 'Human Specialist',
      notes: attemptNotes.trim() || undefined,
    })

    setIsLogAttemptOpen(false)
    setAttemptOutcome('Spoke with GM')
    setAttemptNotes('')
    setFeedbackBanner('Contact attempt logged in activity audit trail.')
  }

  // Handle Adding Internal Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteContent.trim()) return

    addHandoffNote(item.id, noteContent.trim(), item.assignedAgent || 'Human Specialist')

    setIsAddNoteOpen(false)
    setNoteContent('')
    setFeedbackBanner('Internal note added to lead record.')
  }

  // Trigger Status Change with Confirmation Gate
  const handleInitiateStatusChange = (newStatus: HandoffStatus) => {
    setPendingStatus(newStatus)
    setIsStatusConfirmOpen(true)
  }

  // Execute Confirmed Status Change
  const handleConfirmStatusChange = () => {
    const isNowCompleted = pendingStatus === 'completed'

    // If completed, ensure checklist reflects final milestone completion
    let updatedChecklist = item.checklist || []
    if (isNowCompleted) {
      updatedChecklist = updatedChecklist.map((m) => ({
        ...m,
        completed: true,
        completedAt: m.completedAt || 'Just now',
        completedBy: m.completedBy || (item.assignedAgent || 'Human Specialist'),
      }))
    }

    const newActivity: OnboardingActivity = {
      id: `act-${Date.now()}`,
      title: isNowCompleted ? 'Certified Onboarding Completed' : `Status Changed to ${pendingStatus}`,
      description: isNowCompleted
        ? 'Authorized human specialist confirmed GST registration, signed agreement, and verified live PMS rate sync.'
        : `Pipeline stage updated to ${pendingStatus} in local state.`,
      timestamp: 'Just now',
      actor: item.assignedAgent || 'Human Specialist',
      type: 'human',
    }

    updateHandoff(item.id, {
      status: pendingStatus,
      checklist: updatedChecklist,
      activityLog: [newActivity, ...(item.activityLog || [])],
    })

    setIsStatusConfirmOpen(false)
    setFeedbackBanner(
      isNowCompleted
        ? `✓ ${item.property} has been marked as fully onboarded following human specialist certification!`
        : `Pipeline status updated to "${pendingStatus}".`,
    )
  }

  // Handle Scheduling Follow-up Callback Task
  const handleCreateFollowup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!followupReason.trim()) return

    const newTask: FollowupItem = {
      id: `task-${Date.now()}`,
      leadId: item.leadId,
      handoffId: item.id,
      assignedAgentId: item.assignedAgentId || undefined,
      name: item.name,
      property: item.property,
      city: item.city,
      phone: item.phone,
      assignedAgent: item.assignedAgent || 'Human Specialist',
      preferredCallbackWindow: `${followupDate}, ${followupWindow}`,
      scheduledDate: followupDate,
      scheduledTime: followupWindow,
      reason: followupReason.trim(),
      priority: followupPriority,
      status: 'upcoming',
      taskType: 'Specialist Demo Walkthrough',
      initials: item.initials,
      color: item.color,
      time: `Scheduled (${followupDate})`,
      type: 'Demonstration',
      isSimulatedDemo: true,
    }

    addFollowup(newTask)

    // Add activity log entry
    const newActivity: OnboardingActivity = {
      id: `act-${Date.now()}`,
      title: 'Follow-up Task Scheduled',
      description: `Task for ${followupDate} (${followupWindow}) added to Follow-ups queue. Assigned to ${item.assignedAgent || 'Specialist'}.`,
      timestamp: 'Just now',
      actor: item.assignedAgent || 'Human Specialist',
      type: 'human',
    }

    updateHandoff(item.id, {
      activityLog: [newActivity, ...(item.activityLog || [])],
    })

    setIsScheduleFollowupOpen(false)
    setFeedbackBanner(`✓ Follow-up task scheduled for ${followupDate} (${followupWindow}). Reflected on Follow-ups page.`)
    setTimeout(() => setFeedbackBanner(null), 6000)
  }

  const checklist = item.checklist || []
  const completedMilestonesCount = checklist.filter((m) => m.completed).length
  const checklistProgressPercent =
    checklist.length > 0 ? Math.round((completedMilestonesCount / checklist.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-xs text-muted-foreground">
          <Link to="/handoffs">
            <ArrowLeft className="mr-1.5 size-3.5" />
            Back to Handoff Queue
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <PageHeader
        eyebrow="ONBOARDING & SPECIALIST HANDOFF"
        title={`Onboarding: ${item.property}`}
        description={`Decision-Maker: ${item.name} · ${item.city} · ${item.rooms} Rooms · ID: ${item.id}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLogAttemptOpen(true)}
          >
            <Phone className="mr-1.5 size-3.5" />
            Log Contact Attempt
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddNoteOpen(true)}
          >
            <FileText className="mr-1.5 size-3.5" />
            Add Note
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsScheduleFollowupOpen(true)}
          >
            <CalendarClock className="mr-1.5 size-3.5" />
            Schedule Follow-up
          </Button>

          <Button
            size="sm"
            onClick={() => handleInitiateStatusChange(item.status === 'completed' ? 'contacted' : 'completed')}
            className={item.status === 'completed' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}
          >
            <CheckCircle2 className="mr-1.5 size-3.5" />
            {item.status === 'completed' ? 'Reopen Onboarding' : 'Certify Onboarding Complete'}
          </Button>
        </div>
      </PageHeader>

      {/* Mandatory Governance Warning Box: AI Interest vs Human Completion */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
          <ShieldAlert className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          Governance Rule: Distinguishing AI Sales Interest vs. Certified Onboarding Completion
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg bg-background/80 p-3 border border-border/60">
            <span className="font-bold text-foreground block mb-1">
              Phase 1: AI Discovery & Sales Interest
            </span>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              AI voice agents qualify willingness to explore 0% OTA commission bids. <strong>AI qualification NEVER marks a property as onboarded.</strong> It simply creates a handoff record with interest classification.
            </p>
          </div>

          <div className="rounded-lg bg-background/80 p-3 border border-border/60">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
              Phase 2: Human-Confirmed Onboarding Completion
            </span>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              Only an assigned human specialist can certify activation after verifying property GSTIN, signing commercial agreements, and mapping two-way PMS rate floor parameters.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
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

      {/* Main Grid: Left 2 Cols (Checklist, History, Attempts, Notes) & Right Col (Owner, Status, Audit Trail) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* 1. Onboarding Checklist Milestones */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Onboarding Checklist & Activation Milestones
                </h3>
                <p className="text-xs text-muted-foreground">
                  Each milestone must be validated prior to launching guest bidding.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  {completedMilestonesCount} / {checklist.length} Verified ({checklistProgressPercent}%)
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  checklistProgressPercent === 100 ? 'bg-emerald-600' : 'bg-primary'
                }`}
                style={{ width: `${checklistProgressPercent}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5 pt-1">
              {checklist.map((milestone) => (
                <div
                  key={milestone.id}
                  onClick={() => handleToggleMilestone(milestone.id)}
                  className={`flex items-start gap-3 rounded-lg border p-3.5 text-xs cursor-pointer transition-colors ${
                    milestone.completed
                      ? 'border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-border/80 bg-muted/20 hover:bg-muted/40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={milestone.completed}
                      onChange={() => {}} // handled by wrapper onClick
                      className="size-4 rounded border-input text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className={milestone.completed ? 'text-emerald-900 dark:text-emerald-200' : 'text-foreground'}>
                        {milestone.label}
                      </strong>
                      {milestone.requiresHumanVerification && (
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                          Human Certified Gate
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-muted-foreground text-[11px] leading-relaxed">
                      {milestone.description}
                    </p>
                    {milestone.completedAt && (
                      <span className="mt-1 inline-block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                        ✓ Verified: {milestone.completedAt} {milestone.completedBy ? `by ${milestone.completedBy}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Lead Discovery History */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              AI Voice Discovery History
            </h3>
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Initial Discovery Summary:</span>
                <span className="text-muted-foreground text-[11px]">{item.time}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {item.callSummary}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="font-semibold text-foreground">Handoff Trigger:</span>
                <span className="text-muted-foreground">{item.reason}</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button variant="ghost" size="sm" asChild className="h-7 text-xs text-primary">
                <Link to="/calls">View Voice Audio Logs & Transcripts →</Link>
              </Button>
            </div>
          </div>

          {/* 3. Contact Attempts Log */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <PhoneCall className="size-4 text-primary" />
                  Specialist Contact Attempts
                </h3>
                <p className="text-xs text-muted-foreground">
                  Record of manual phone calls, WhatsApp messages, and demonstration sessions.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLogAttemptOpen(true)}
                className="text-xs"
              >
                <Phone className="mr-1.5 size-3" />
                Log Attempt
              </Button>
            </div>

            {(!item.contactAttempts || item.contactAttempts.length === 0) ? (
              <p className="text-xs text-muted-foreground py-2 italic">
                No manual contact attempts recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {item.contactAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-start justify-between rounded-lg border border-border/70 p-3 text-xs bg-muted/20"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                        {attempt.type === 'call' ? (
                          <Phone className="size-3" />
                        ) : attempt.type === 'whatsapp' ? (
                          <MessageSquare className="size-3" />
                        ) : attempt.type === 'email' ? (
                          <Mail className="size-3" />
                        ) : (
                          <Calendar className="size-3" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground uppercase text-[10px]">
                            {attempt.type}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className="font-medium text-foreground">{attempt.outcome}</span>
                        </div>
                        {attempt.notes && (
                          <p className="mt-1 text-muted-foreground text-[11px] leading-relaxed">
                            {attempt.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-muted-foreground shrink-0">
                      <span>{attempt.time}</span>
                      <p className="mt-0.5 font-medium text-foreground">{attempt.agent}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Specialist Internal Notes */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  Internal Triage & Onboarding Notes
                </h3>
                <p className="text-xs text-muted-foreground">
                  Confidential notes shared among onboarding and sales specialists.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddNoteOpen(true)}
                className="text-xs"
              >
                <FileText className="mr-1.5 size-3" />
                Add Note
              </Button>
            </div>

            {item.notes.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2 italic">No notes recorded.</p>
            ) : (
              <div className="space-y-2">
                {item.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-foreground">{note.author}</strong>
                      <span className="text-[10px] text-muted-foreground">{note.createdAt}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assigned Owner, Pipeline Stage, Property Specs & Chronological Activity Log */}
        <div className="space-y-6">
          {/* Assigned Specialist Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Assigned Human Specialist</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReassignOpen(true)}
                className="h-7 text-xs text-primary"
              >
                <UserCheck className="mr-1 size-3" /> Reassign
              </Button>
            </div>

            {item.assignedAgent ? (
              <div className="flex items-center gap-3 rounded-lg border border-border/80 bg-muted/20 p-3 text-xs">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-bold text-primary dark:bg-indigo-950/50">
                  {item.assignedAgent
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{item.assignedAgent}</h4>
                  <p className="text-muted-foreground text-[11px]">{item.assignedAgentRole}</p>
                  <span className="inline-block mt-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    Lead Owner
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground">No human specialist assigned yet.</p>
                <Button size="sm" onClick={() => setIsReassignOpen(true)} className="text-xs">
                  <UserPlus className="mr-1.5 size-3.5" /> Claim Prospect
                </Button>
              </div>
            )}

            <div className="space-y-2 pt-2 text-xs text-muted-foreground border-t border-border">
              <div className="flex justify-between">
                <span>Requested Window:</span>
                <span className="font-medium text-foreground">{item.requestedCallbackWindow}</span>
              </div>
              <div className="flex justify-between">
                <span>Initial Queue Time:</span>
                <span className="font-medium text-foreground">{item.age}</span>
              </div>
            </div>
          </div>

          {/* Pipeline Stage Controller */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Pipeline Qualification Stage</h3>

            <div className="space-y-1.5">
              <label className="text-[11px] text-muted-foreground">Current Stage:</label>
              <div className="flex items-center justify-between">
                <StatusBadge variant={mapHandoffStatusToVariant(item.status)} dot>
                  {item.status.toUpperCase()}
                </StatusBadge>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsStatusConfirmOpen(true)}
                  className="h-8 text-xs"
                >
                  <Tag className="mr-1 size-3" /> Change Stage
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-2.5 text-[11px] text-muted-foreground">
              {item.status === 'completed'
                ? '✓ Certified: Live on JusBid direct bidding engine.'
                : 'Stage transitions require human verification for compliance.'}
            </div>
          </div>

          {/* Property Specifications Summary */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2.5 text-xs">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Building className="size-4 text-primary" />
              Property Profile
            </h3>

            <div className="space-y-2 pt-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Property Name:</span>
                <span className="font-semibold text-foreground">{item.property}</span>
              </div>
              <div className="flex justify-between">
                <span>Decision-Maker:</span>
                <span className="font-medium text-foreground">{item.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium text-foreground">{item.city}</span>
              </div>
              <div className="flex justify-between">
                <span>Room Inventory:</span>
                <span className="font-medium text-foreground">{item.rooms} keys</span>
              </div>
              <div className="flex justify-between">
                <span>Demo Phone:</span>
                <span className="font-mono text-foreground">{item.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Triage Priority:</span>
                <span className="font-bold text-amber-600">{item.priority} Priority</span>
              </div>
            </div>
          </div>

          {/* Chronological Activity Log / Audit Trail */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <History className="size-4 text-primary" />
              Audit Trail & Activity Log
            </h3>

            {(!item.activityLog || item.activityLog.length === 0) ? (
              <p className="text-xs text-muted-foreground py-2 italic">No activity logged.</p>
            ) : (
              <div className="space-y-3 pt-1">
                {item.activityLog.map((act) => (
                  <div key={act.id} className="relative pl-5 text-xs space-y-0.5">
                    <span
                      className={`absolute left-0 top-1.5 size-2 rounded-full ${
                        act.type === 'ai'
                          ? 'bg-indigo-500'
                          : act.type === 'human'
                            ? 'bg-emerald-500'
                            : 'bg-muted-foreground'
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <strong className="text-foreground">{act.title}</strong>
                      <span className="text-[10px] text-muted-foreground">{act.timestamp}</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 block">
                      Actor: {act.actor}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 1: REASSIGN DEMO AGENT                                  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              Reassign Onboarding Specialist
            </DialogTitle>
            <DialogDescription>
              Transfer ownership of <strong>{item.property}</strong> to another human team member.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="reassign-agent-select" className="text-xs font-semibold text-foreground">Select New Owner</label>
              <select
                id="reassign-agent-select"
                value={selectedNewAgent}
                onChange={(e) => setSelectedNewAgent(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                {teamMembers.map((member) => (
                  <option key={member.name} value={member.name}>
                    {member.name} ({member.role}) · {member.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-3 text-[11px] text-muted-foreground">
              Reassigning updates the active deal in local state and records an entry into the activity log.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsReassignOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmReassignment}>
              Confirm Reassignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 2: ADD INTERNAL NOTE                                   */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Add Internal Onboarding Note
            </DialogTitle>
            <DialogDescription>
              Record specialist notes for <strong>{item.property}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddNote} className="space-y-3 py-2 text-xs">
            <label htmlFor="internal-note-content" className="sr-only">Specialist Note</label>
            <textarea
              id="internal-note-content"
              rows={3}
              placeholder="e.g. Conducted PMS demo with GM. They approved 15 trial keys. Sent digital agreement."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
            />

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddNoteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!noteContent.trim()}>
                Save Note
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 3: LOG CONTACT ATTEMPT                                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog open={isLogAttemptOpen} onOpenChange={setIsLogAttemptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneCall className="size-5 text-primary" />
              Log Manual Contact Attempt
            </DialogTitle>
            <DialogDescription>
              Record an interaction made by the human specialist with <strong>{item.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogContactAttempt} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="attempt-channel-type" className="text-xs font-semibold text-foreground">Channel Type</label>
              <select
                id="attempt-channel-type"
                value={attemptType}
                onChange={(e) =>
                  setAttemptType(e.target.value as 'call' | 'whatsapp' | 'email' | 'demo')
                }
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="call">Phone Call (Manual Dial)</option>
                <option value="whatsapp">WhatsApp Business Message</option>
                <option value="email">Direct Email Proposal</option>
                <option value="demo">Live Screen Share Demo</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="attempt-outcome" className="text-xs font-semibold text-foreground">Outcome Summary</label>
              <Input
                id="attempt-outcome"
                placeholder="e.g. Spoke with GM, scheduled walkthrough for Friday"
                value={attemptOutcome}
                onChange={(e) => setAttemptOutcome(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="attempt-notes" className="text-xs font-semibold text-foreground">Detailed Observations</label>
              <textarea
                id="attempt-notes"
                rows={2}
                placeholder="e.g. Owner verified 48 keys; requested special weekend minimum stay rules."
                value={attemptNotes}
                onChange={(e) => setAttemptNotes(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsLogAttemptOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!attemptOutcome.trim()}>
                Save Attempt Log
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 4: CONFIRM STATUS CHANGE (GOVERNANCE GATE)             */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog open={isStatusConfirmOpen} onOpenChange={setIsStatusConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="size-5 text-primary" />
              Confirm Pipeline Stage Change
            </DialogTitle>
            <DialogDescription>
              Update onboarding stage for <strong>{item.property}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="stage-select" className="text-xs font-semibold text-foreground">Target Stage</label>
              <select
                id="stage-select"
                value={pendingStatus}
                onChange={(e) => setPendingStatus(e.target.value as HandoffStatus)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="unassigned">Unassigned (Awaiting Specialist)</option>
                <option value="assigned">Assigned (Specialist Owning Deal)</option>
                <option value="contacted">Contacted (Outreach in Progress)</option>
                <option value="follow-up required">Follow-up Required (Pending Demo/Quote)</option>
                <option value="completed">Completed (Human Certified Onboarded)</option>
              </select>
            </div>

            {pendingStatus === 'completed' ? (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-50/80 p-3.5 text-[11px] text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  Human Verification Certification Required
                </div>
                <p className="leading-relaxed">
                  By confirming this change, you attest that you or another authorized specialist have verified the hotelier's commercial GSTIN, executed the JusBid merchant agreement, and calibrated two-way PMS rate synchronization.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-[11px] text-muted-foreground">
                This update will adjust metrics in your local session and record a timestamped audit trail entry.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsStatusConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmStatusChange}
              className={pendingStatus === 'completed' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              Confirm Status Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 5: SCHEDULE FOLLOW-UP CALLBACK                          */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog open={isScheduleFollowupOpen} onOpenChange={setIsScheduleFollowupOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateFollowup} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarClock className="size-5 text-primary" />
                Schedule Follow-up Task
              </DialogTitle>
              <DialogDescription>
                Schedule an onboarding demonstration or callback for <strong>{item.property}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="followup-date" className="text-xs font-semibold text-foreground">Date</label>
                  <input
                    id="followup-date"
                    type="text"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    placeholder="e.g. Tomorrow or Nov 2"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="followup-window" className="text-xs font-semibold text-foreground">Time Window</label>
                  <input
                    id="followup-window"
                    type="text"
                    value={followupWindow}
                    onChange={(e) => setFollowupWindow(e.target.value)}
                    placeholder="e.g. 2:00 PM - 3:00 PM"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="followup-priority" className="text-xs font-semibold text-foreground">Priority</label>
                <select
                  id="followup-priority"
                  value={followupPriority}
                  onChange={(e) => setFollowupPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="followup-reason" className="text-xs font-semibold text-foreground">Follow-up Objective</label>
                <textarea
                  id="followup-reason"
                  rows={3}
                  value={followupReason}
                  onChange={(e) => setFollowupReason(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-2.5 text-[11px] text-muted-foreground">
                Assigned to: <strong className="text-foreground">{item.assignedAgent || 'Unassigned Specialist'}</strong>. Added directly to the shared follow-up task queue.
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsScheduleFollowupOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Schedule Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
