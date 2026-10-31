import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, StatusBadge, EmptyState } from '@/components'
import type { StatusVariant } from '@/components'
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
  UserCheck,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Search,
  X,
  RotateCcw,
  ShieldAlert,
  FileText,
  UserPlus,
  Tag,
} from 'lucide-react'
import { useMockData } from '@/context'
import type { HandoffItem, HandoffStatus } from '@/types'

const STATUS_FILTERS: Array<{ id: 'all' | HandoffStatus; label: string }> = [
  { id: 'all', label: 'All Handoffs' },
  { id: 'unassigned', label: 'Unassigned' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'follow-up required', label: 'Follow-up Required' },
  { id: 'completed', label: 'Completed' },
]

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

export function HandoffQueuePage() {
  // Shared handoff queue from master context
  const { handoffs: queue, reassignHandoff, addHandoffNote, updateHandoff, teamMembers } = useMockData()

  // Filter & Search states
  const [activeStatusTab, setActiveStatusTab] = useState<'all' | HandoffStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states for actions
  const [assigningItem, setAssigningItem] = useState<HandoffItem | null>(null)
  const [selectedAgentName, setSelectedAgentName] = useState('')

  const [notingItem, setNotingItem] = useState<HandoffItem | null>(null)
  const [noteText, setNoteText] = useState('')

  const [statusChangingItem, setStatusChangingItem] = useState<HandoffItem | null>(null)
  const [targetStatus, setTargetStatus] = useState<HandoffStatus>('contacted')

  // Feedback banner state
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null)

  // Filtered queue items
  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      // Search
      const query = searchQuery.trim().toLowerCase()
      if (query) {
        const matchesName = item.name.toLowerCase().includes(query)
        const matchesProperty = item.property.toLowerCase().includes(query)
        const matchesCity = item.city.toLowerCase().includes(query)
        const matchesReason = item.reason.toLowerCase().includes(query)
        const matchesAgent = (item.assignedAgent || '').toLowerCase().includes(query)
        if (!matchesName && !matchesProperty && !matchesCity && !matchesReason && !matchesAgent) {
          return false
        }
      }

      // Status Tab
      if (activeStatusTab !== 'all' && item.status !== activeStatusTab) {
        return false
      }

      return true
    })
  }, [queue, searchQuery, activeStatusTab])

  // Count per status
  const counts = useMemo(() => {
    return {
      all: queue.length,
      unassigned: queue.filter((i) => i.status === 'unassigned').length,
      assigned: queue.filter((i) => i.status === 'assigned').length,
      contacted: queue.filter((i) => i.status === 'contacted').length,
      'follow-up required': queue.filter((i) => i.status === 'follow-up required').length,
      completed: queue.filter((i) => i.status === 'completed').length,
    }
  }, [queue])

  // Action: Assign Agent
  const handleAssignAgent = () => {
    if (!assigningItem || !selectedAgentName) return
    const agentObj = teamMembers.find((m) => m.name === selectedAgentName)
    const agentRole = agentObj?.role || 'Sales Specialist'

    reassignHandoff(assigningItem.id, selectedAgentName, agentRole)

    setFeedbackBanner(
      `Assigned ${selectedAgentName} to "${assigningItem.property}".`,
    )
    setAssigningItem(null)
    setSelectedAgentName('')
  }

  // Action: Add Note
  const handleAddNote = () => {
    if (!notingItem || !noteText.trim()) return

    addHandoffNote(notingItem.id, noteText.trim())

    setFeedbackBanner(`Note added for "${notingItem.property}".`)
    setNotingItem(null)
    setNoteText('')
  }

  // Action: Change Status
  const handleChangeStatus = () => {
    if (!statusChangingItem) return

    updateHandoff(statusChangingItem.id, { status: targetStatus })

    setFeedbackBanner(
      `Updated "${statusChangingItem.property}" status to "${targetStatus}".`,
    )
    setStatusChangingItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="HUMAN-IN-THE-LOOP TRIAGE"
        title="Human Handoff Queue"
        description="Hoteliers who engaged with AI voice agents and require human sales consultation, custom pricing approval, or PMS onboarding walkthroughs."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/team">View Sales Team</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/calls">Inspect Call Logs</Link>
          </Button>
        </div>
      </PageHeader>

      {/* Mandatory Governance Verification Gate Notice */}
      <div className="rounded-xl border border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/30 p-4 text-xs text-amber-950 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
          <ShieldAlert className="size-4 shrink-0 text-amber-600" />
          Governance Gate: AI Never Automatically Marks Hotels as "Onboarded"
        </div>
        <p className="leading-relaxed text-amber-900/90 dark:text-amber-200/90">
          JusBid sales governance strictly enforces human verification. An AI voice agent identifying high hotelier interest only qualifies and routes the prospect into this handoff queue. <strong>A hotelier can only be marked as completed/onboarded by an authorized human specialist</strong> following commercial agreement signoff and PMS price-floor calibration.
        </p>
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

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Total In Queue</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">{queue.length}</span>
            <span className="text-[10px] text-muted-foreground">hoteliers</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Awaiting Assignment</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-amber-600">{counts.unassigned}</span>
            <span className="text-[10px] text-muted-foreground">unclaimed</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">In Follow-Up / Contacted</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600">
              {counts.contacted + counts['follow-up required']}
            </span>
            <span className="text-[10px] text-muted-foreground">in progress</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Verified Onboarded</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-emerald-600">{counts.completed}</span>
            <span className="text-[10px] text-muted-foreground">human certified</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-border bg-muted/40 p-1 text-xs">
          {STATUS_FILTERS.map((tab) => {
            const count = counts[tab.id]
            const isActive = activeStatusTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatusTab(tab.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
                <span className="rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground">
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hotel, owner, city, or trigger..."
            className="pl-8 text-xs h-9"
            aria-label="Search handoff queue"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search query"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Handoff Queue Items List */}
      <div className="space-y-3">
        {filteredQueue.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="size-6 text-muted-foreground" />}
            title="No handoff prospects match this filter"
            description="All hoteliers in this category have been addressed, or no items match your search."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveStatusTab('all')
                  setSearchQuery('')
                }}
              >
                <RotateCcw className="mr-1.5 size-3.5" />
                View all handoffs
              </Button>
            }
          />
        ) : (
          filteredQueue.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-indigo-400/40 space-y-3"
            >
              {/* Top Row: Avatar, Hotel Name, Priority, Status, Age */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-bold text-primary dark:bg-indigo-950/50 dark:text-indigo-300">
                    {item.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/onboarding/${item.id}`}
                        className="font-bold text-foreground hover:text-primary transition-colors text-sm"
                      >
                        {item.property}
                      </Link>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs font-semibold text-foreground">{item.name}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        ({item.city})
                      </span>
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.rooms} rooms</span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">{item.phone}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        Age: <strong className="text-foreground">{item.age}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      item.interestLevel === 'High'
                        ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-blue-500/40 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {item.interestLevel} Interest
                  </Badge>

                  <StatusBadge
                    variant={item.priority === 'High' ? 'hot' : 'follow-up'}
                    dot
                  >
                    {item.priority} Priority
                  </StatusBadge>

                  <StatusBadge variant={mapHandoffStatusToVariant(item.status)} dot>
                    {item.status.toUpperCase()}
                  </StatusBadge>
                </div>
              </div>

              {/* Call Summary & Reason Box */}
              <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-primary font-semibold">
                  <Sparkles className="size-3.5" />
                  <span>AI Phone Discovery Context:</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {item.callSummary}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="font-semibold text-foreground">Trigger:</span>
                  <span className="text-muted-foreground">{item.reason}</span>
                </div>
              </div>

              {/* Action Strip: Callback Window, Assigned Agent & Interactive Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-border pt-3 text-xs gap-3">
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-indigo-500" />
                    <span>
                      Callback Window:{' '}
                      <strong className="text-foreground">{item.requestedCallbackWindow}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <UserCheck className="size-3.5 text-emerald-500" />
                    <span>
                      Assigned Agent:{' '}
                      {item.assignedAgent ? (
                        <strong className="text-foreground">{item.assignedAgent}</strong>
                      ) : (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                          Unassigned
                        </span>
                      )}
                    </span>
                  </div>

                  {item.notes.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MessageSquare className="size-3" />
                      <span>{item.notes.length} note(s)</span>
                    </div>
                  )}
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAssigningItem(item)
                      setSelectedAgentName(item.assignedAgent || teamMembers[0].name)
                    }}
                    className="h-8 px-2.5 text-xs font-medium"
                  >
                    <UserPlus className="mr-1 size-3.5" />
                    {item.assignedAgent ? 'Reassign' : 'Assign Specialist'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNotingItem(item)
                      setNoteText('')
                    }}
                    className="h-8 px-2.5 text-xs font-medium"
                  >
                    <FileText className="mr-1 size-3.5" />
                    Add Note
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusChangingItem(item)
                      setTargetStatus(item.status)
                    }}
                    className="h-8 px-2.5 text-xs font-medium"
                  >
                    <Tag className="mr-1 size-3.5" />
                    Status
                  </Button>

                  <Button size="sm" asChild className="h-8 px-2.5 text-xs font-medium">
                    <Link to={`/onboarding/${item.id}`}>
                      Details
                      <ChevronRight className="ml-1 size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Existing Notes Preview (if any) */}
              {item.notes.length > 0 && (
                <div className="border-t border-border/60 pt-2 space-y-1.5">
                  {item.notes.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-start justify-between rounded-md bg-muted/30 px-3 py-1.5 text-[11px]"
                    >
                      <div>
                        <strong className="text-foreground">{note.author}:</strong>{' '}
                        <span className="text-muted-foreground">{note.text}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {note.createdAt}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 1: ASSIGN / REASSIGN DEMO AGENT                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog
        open={assigningItem !== null}
        onOpenChange={(open) => {
          if (!open) setAssigningItem(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              Assign Specialist to Prospect
            </DialogTitle>
            <DialogDescription>
              Assign a human sales specialist to take over discovery and live demonstration for{' '}
              <strong>{assigningItem?.property}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="assign-specialist-select" className="text-xs font-semibold text-foreground">
                Select Team Specialist
              </label>
              <select
                id="assign-specialist-select"
                value={selectedAgentName}
                onChange={(e) => setSelectedAgentName(e.target.value)}
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
              Assigning a specialist shifts this handoff to <strong>Assigned</strong> state and creates an immediate calendar reminder.
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAssigningItem(null)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleAssignAgent}>
              Save Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 2: ADD HANDOFF NOTE                                    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog
        open={notingItem !== null}
        onOpenChange={(open) => {
          if (!open) setNotingItem(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Add Handoff Triage Note
            </DialogTitle>
            <DialogDescription>
              Record an internal specialist note for <strong>{notingItem?.property}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <label htmlFor="handoff-note-text" className="sr-only">Internal Handoff Note</label>
            <textarea
              id="handoff-note-text"
              rows={3}
              placeholder="e.g. Spoke with GM; agreed to pilot 15 rooms pending rate floor verification. Schedule meeting for Thursday."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground shadow-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
            />
            <p className="text-[10px] text-muted-foreground">
              Notes are saved in local frontend state for demo review.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setNotingItem(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!noteText.trim()}
              onClick={handleAddNote}
            >
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 3: CHANGE DEMO STATUS                                  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog
        open={statusChangingItem !== null}
        onOpenChange={(open) => {
          if (!open) setStatusChangingItem(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="size-5 text-primary" />
              Change Handoff Pipeline Status
            </DialogTitle>
            <DialogDescription>
              Update the human qualification stage for <strong>{statusChangingItem?.property}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="handoff-target-status" className="text-xs font-semibold text-foreground">Pipeline Stage</label>
              <select
                id="handoff-target-status"
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as HandoffStatus)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="unassigned">Unassigned (Awaiting Specialist)</option>
                <option value="assigned">Assigned (Specialist Owning Deal)</option>
                <option value="contacted">Contacted (Outreach in Progress)</option>
                <option value="follow-up required">Follow-up Required (Pending Demo/Quote)</option>
                <option value="completed">Completed (Human Verified & Onboarded)</option>
              </select>
            </div>

            {targetStatus === 'completed' && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-50/70 p-3 text-[11px] text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 space-y-1">
                <strong>Governance Rule Verified:</strong>
                <p>
                  You are certifying that an authorized human specialist has confirmed hotelier GST/tax identity, signed commercial terms, and mapped the property's PMS rate floors.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStatusChangingItem(null)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleChangeStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
