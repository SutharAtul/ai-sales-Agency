import { useState, useMemo } from 'react'
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
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  X,
  RotateCcw,
  ShieldAlert,
  UserCheck,
  CalendarClock,
  CalendarCheck,
  Ban,
  Check,
} from 'lucide-react'
import { useMockData } from '@/context'
import type { FollowupItem, FollowupStatus } from '@/types'

const STATUS_FILTERS: Array<{ id: 'all' | FollowupStatus; label: string }> = [
  { id: 'all', label: 'All Tasks' },
  { id: 'due', label: 'Due Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

function mapFollowupStatusToVariant(status: FollowupStatus): StatusVariant {
  switch (status) {
    case 'due':
      return 'hot'
    case 'upcoming':
      return 'scheduled'
    case 'overdue':
      return 'overdue'
    case 'completed':
      return 'qualified'
    case 'cancelled':
      return 'paused'
    default:
      return 'default'
  }
}

export function FollowupsPage() {
  const {
    followups: tasks,
    rescheduleFollowup,
    completeFollowup,
    updateFollowup,
    addFollowup,
    teamMembers,
  } = useMockData()

  // Filter & Search state
  const [activeTab, setActiveTab] = useState<'all' | FollowupStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Reschedule Modal state
  const [reschedulingTask, setReschedulingTask] = useState<FollowupItem | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('2026-10-29')
  const [rescheduleWindow, setRescheduleWindow] = useState('11:00 AM - 11:45 AM IST')
  const [rescheduleReason, setRescheduleReason] = useState('')
  const [rescheduleErrors, setRescheduleErrors] = useState<{ date?: string; window?: string }>({})

  // Complete Task Modal state
  const [completingTask, setCompletingTask] = useState<FollowupItem | null>(null)
  const [completionOutcome, setCompletionOutcome] = useState('Demo Walkthrough Scheduled')
  const [completionNotes, setCompletionNotes] = useState('')
  const [completeErrors, setCompleteErrors] = useState<{ outcome?: string }>({})

  // Cancel Task Modal state
  const [cancellingTask, setCancellingTask] = useState<FollowupItem | null>(null)
  const [cancelReason, setCancelReason] = useState('Hotelier postponed review to next season')

  // Create Task Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    property: '',
    city: 'Jaipur, Rajasthan',
    phone: '+91 99999 00028',
    assignedAgent: 'Neha Sharma',
    date: '2026-10-29',
    window: '02:30 PM - 03:15 PM IST',
    reason: '',
    priority: 'High' as 'High' | 'Medium' | 'Low',
    taskType: 'Callback',
  })
  const [createErrors, setCreateErrors] = useState<{ name?: string; property?: string; reason?: string }>({})

  // Feedback banner state
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null)

  // Filtered task list
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search matches name, property, city, or assigned agent
      const query = searchQuery.trim().toLowerCase()
      if (query) {
        const matchesName = t.name.toLowerCase().includes(query)
        const matchesProperty = t.property.toLowerCase().includes(query)
        const matchesCity = t.city.toLowerCase().includes(query)
        const matchesAgent = t.assignedAgent.toLowerCase().includes(query)
        const matchesReason = t.reason.toLowerCase().includes(query)
        if (!matchesName && !matchesProperty && !matchesCity && !matchesAgent && !matchesReason) {
          return false
        }
      }

      // Status Tab
      if (activeTab !== 'all' && t.status !== activeTab) {
        return false
      }

      return true
    })
  }, [tasks, searchQuery, activeTab])

  // Count per status
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      due: tasks.filter((t) => t.status === 'due').length,
      upcoming: tasks.filter((t) => t.status === 'upcoming').length,
      overdue: tasks.filter((t) => t.status === 'overdue').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      cancelled: tasks.filter((t) => t.status === 'cancelled').length,
    }
  }, [tasks])

  // Validation & Handler: Reschedule Task
  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reschedulingTask) return

    const errors: { date?: string; window?: string } = {}
    if (!rescheduleDate) errors.date = 'Callback date is required.'
    if (!rescheduleWindow.trim()) errors.window = 'Preferred callback time window is required.'

    if (Object.keys(errors).length > 0) {
      setRescheduleErrors(errors)
      return
    }

    rescheduleFollowup(
      reschedulingTask.id,
      rescheduleDate,
      rescheduleWindow,
      rescheduleReason.trim()
    )

    setFeedbackBanner(`✓ Follow-up for "${reschedulingTask.property}" rescheduled to ${rescheduleDate} (${rescheduleWindow}).`)
    setReschedulingTask(null)
    setRescheduleReason('')
    setRescheduleErrors({})
  }

  // Validation & Handler: Complete Task
  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!completingTask) return

    if (!completionOutcome.trim()) {
      setCompleteErrors({ outcome: 'Resolution outcome is required.' })
      return
    }

    completeFollowup(completingTask.id, completionOutcome.trim())

    setFeedbackBanner(`✓ Callback for "${completingTask.property}" marked as completed.`)
    setCompletingTask(null)
    setCompletionOutcome('Demo Walkthrough Scheduled')
    setCompletionNotes('')
    setCompleteErrors({})
  }

  // Handler: Cancel Task
  const handleCancelSubmit = () => {
    if (!cancellingTask) return

    updateFollowup(cancellingTask.id, {
      status: 'cancelled',
      completedAt: 'Today, 04:35 PM IST',
      completionOutcome: `Cancelled: ${cancelReason}`,
    })

    setFeedbackBanner(`Follow-up task for "${cancellingTask.property}" cancelled.`)
    setCancellingTask(null)
  }

  // Validation & Handler: Create Task
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { name?: string; property?: string; reason?: string } = {}
    if (!createForm.name.trim()) errors.name = 'Contact name is required.'
    if (!createForm.property.trim()) errors.property = 'Property name is required.'
    if (!createForm.reason.trim()) errors.reason = 'Callback reason is required.'

    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors)
      return
    }

    const isToday = createForm.date === '2026-10-28'
    const newStatus: FollowupStatus = isToday ? 'due' : 'upcoming'

    const nameParts = createForm.name.trim().split(' ')
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : createForm.name.slice(0, 2).toUpperCase()

    const newTask: FollowupItem = {
      id: `task-${Date.now()}`,
      name: createForm.name.trim(),
      property: createForm.property.trim(),
      city: createForm.city.trim(),
      phone: createForm.phone.trim(),
      assignedAgent: createForm.assignedAgent,
      preferredCallbackWindow: `${isToday ? 'Today' : createForm.date}, ${createForm.window}`,
      scheduledDate: createForm.date,
      scheduledTime: createForm.window,
      reason: createForm.reason.trim(),
      priority: createForm.priority,
      status: newStatus,
      taskType: createForm.taskType,
      type: createForm.taskType,
      time: `${isToday ? 'Today' : createForm.date}, ${createForm.window.split(' ')[0]}`,
      initials,
      color: 'blue',
      isSimulatedDemo: true,
    }

    addFollowup(newTask)
    setIsCreateOpen(false)
    setCreateForm({
      name: '',
      property: '',
      city: 'Jaipur, Rajasthan',
      phone: '+91 99999 00028',
      assignedAgent: 'Neha Sharma',
      date: '2026-10-29',
      window: '02:30 PM - 03:15 PM IST',
      reason: '',
      priority: 'High',
      taskType: 'Callback',
    })
    setCreateErrors({})
    setFeedbackBanner(`✓ Scheduled new follow-up for "${newTask.property}" in demo session.`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="SCHEDULED ENGAGEMENTS"
        title="Follow-up Tasks"
        description="Monitor prioritized hotelier callback windows, reschedule prospect appointments, and log completed demonstration walkthroughs."
      >
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-1.5 size-3.5" />
            Schedule Follow-up
          </Button>
        </div>
      </PageHeader>

      {/* Safety Notice Banner */}
      <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>
            <strong className="text-foreground">Demo Task Scheduler:</strong> All callback tasks, timestamps, and resolution workflows are simulated in local frontend state. No phone calls, SMS notifications, or external calendar webhooks are placed.
          </span>
        </div>
        <span className="hidden sm:inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
          Zero-Dial Safe Sandbox
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

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Due Today</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-amber-600">{counts.due}</span>
            <span className="text-[10px] text-muted-foreground">ready for outreach</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Overdue Callbacks</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-red-600">{counts.overdue}</span>
            <span className="text-[10px] text-muted-foreground">needs recovery</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Upcoming This Week</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600">{counts.upcoming}</span>
            <span className="text-[10px] text-muted-foreground">scheduled</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Completed Follow-ups</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-emerald-600">{counts.completed}</span>
            <span className="text-[10px] text-muted-foreground">resolved</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-border bg-muted/40 p-1 text-xs">
          {STATUS_FILTERS.map((tab) => {
            const count = counts[tab.id]
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
            placeholder="Search hotel, lead, city, or agent..."
            className="pl-8 text-xs h-9"
            aria-label="Search follow-up tasks"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search query"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={<Calendar className="size-6 text-muted-foreground" />}
            title="No follow-up tasks in this category"
            description="All scheduled callbacks have been addressed or no tasks match your filter criteria."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab('all')
                  setSearchQuery('')
                }}
              >
                <RotateCcw className="mr-1.5 size-3.5" />
                View all tasks
              </Button>
            }
          />
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-xl border p-5 shadow-xs transition-colors space-y-3 ${
                task.status === 'overdue'
                  ? 'border-red-500/30 bg-red-50/20 dark:bg-red-950/10'
                  : task.status === 'completed'
                    ? 'border-border/60 bg-muted/20 opacity-80'
                    : 'border-border bg-card hover:border-indigo-400/40'
              }`}
            >
              {/* Top Row: Priority, Property, Contact, Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg font-bold ${
                      task.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : task.status === 'overdue'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                    }`}
                  >
                    {task.initials}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-bold text-sm ${
                          task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}
                      >
                        {task.property}
                      </h3>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs font-semibold text-foreground">{task.name}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        ({task.city})
                      </span>
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{task.taskType}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">{task.phone}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <UserCheck className="size-3" />
                        Specialist: <strong className="text-foreground">{task.assignedAgent}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      task.priority === 'High'
                        ? 'border-red-500/40 text-red-700 dark:text-red-400'
                        : task.priority === 'Medium'
                          ? 'border-amber-500/40 text-amber-700 dark:text-amber-400'
                          : 'border-muted text-muted-foreground'
                    }`}
                  >
                    {task.priority} Priority
                  </Badge>

                  <StatusBadge variant={mapFollowupStatusToVariant(task.status)} dot>
                    {task.status.toUpperCase()}
                  </StatusBadge>
                </div>
              </div>

              {/* Task Reason & Context Box */}
              <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Callback Agenda & Reason:</span>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-foreground">
                    <Clock className="size-3 text-primary" />
                    <strong>{task.preferredCallbackWindow}</strong>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {task.reason}
                </p>
                {task.notes && (
                  <p className="text-[11px] text-muted-foreground/90 italic pt-0.5">
                    Context: {task.notes}
                  </p>
                )}
                {task.completionOutcome && (
                  <div className="mt-1 flex items-center gap-1.5 rounded-md bg-emerald-50/70 p-2 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px]">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Resolution:</strong> {task.completionOutcome}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-border pt-3 text-xs gap-3">
                <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                  <span>Status:</span>
                  <strong className="text-foreground capitalize">{task.status}</strong>
                  {task.completedAt && (
                    <span>· Resolved {task.completedAt}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {task.status !== 'completed' && task.status !== 'cancelled' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReschedulingTask(task)
                          setRescheduleDate(task.scheduledDate || '2026-10-29')
                          setRescheduleWindow(task.scheduledTime || '11:00 AM - 11:45 AM IST')
                          setRescheduleReason('')
                          setRescheduleErrors({})
                        }}
                        className="h-8 px-2.5 text-xs font-medium"
                      >
                        <CalendarClock className="mr-1 size-3.5" />
                        Reschedule
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCompletingTask(task)
                          setCompletionOutcome('Demo Walkthrough Scheduled')
                          setCompletionNotes('')
                          setCompleteErrors({})
                        }}
                        className="h-8 px-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800"
                      >
                        <Check className="mr-1 size-3.5" />
                        Mark Complete
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCancellingTask(task)
                          setCancelReason('Hotelier postponed review to next season')
                        }}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-red-600"
                      >
                        <Ban className="size-3.5" />
                      </Button>
                    </>
                  )}

                  {task.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReschedulingTask(task)
                        setRescheduleDate('2026-10-29')
                        setRescheduleWindow('11:00 AM - 11:45 AM IST')
                        setRescheduleReason('Follow-up reopened for ongoing discussion')
                        setRescheduleErrors({})
                      }}
                      className="h-8 px-2.5 text-xs"
                    >
                      <RotateCcw className="mr-1 size-3" />
                      Reopen Callback
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 1: RESCHEDULE CALLBACK TASK                            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog
        open={reschedulingTask !== null}
        onOpenChange={(open) => {
          if (!open) setReschedulingTask(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="size-5 text-primary" />
              Reschedule Callback Appointment
            </DialogTitle>
            <DialogDescription>
              Adjust preferred callback date and timing for{' '}
              <strong>{reschedulingTask?.property}</strong> ({reschedulingTask?.name}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRescheduleSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="reschedule-date" className="text-xs font-semibold text-foreground">
                Callback Date (YYYY-MM-DD) <span className="text-red-500">*</span>
              </label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className={rescheduleErrors.date ? 'border-red-500 text-xs' : 'text-xs'}
              />
              {rescheduleErrors.date && (
                <p className="text-[10px] text-red-500">{rescheduleErrors.date}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reschedule-window" className="text-xs font-semibold text-foreground">
                Preferred Time Window (IST) <span className="text-red-500">*</span>
              </label>
              <Input
                id="reschedule-window"
                placeholder="e.g. 11:00 AM - 11:45 AM IST"
                value={rescheduleWindow}
                onChange={(e) => setRescheduleWindow(e.target.value)}
                className={rescheduleErrors.window ? 'border-red-500 text-xs font-mono' : 'text-xs font-mono'}
              />
              {rescheduleErrors.window && (
                <p className="text-[10px] text-red-500">{rescheduleErrors.window}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reschedule-reason" className="text-xs font-semibold text-foreground">Reschedule Reason & Context</label>
              <textarea
                id="reschedule-reason"
                rows={2}
                placeholder="e.g. Hotelier requested afternoon slot after GM returns from travel."
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="rounded-lg bg-muted/30 p-2.5 text-[11px] text-muted-foreground">
              Rescheduling resets overdue flags and transitions the task into upcoming/due state in local session.
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setReschedulingTask(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 2: MARK TASK COMPLETED                                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog
        open={completingTask !== null}
        onOpenChange={(open) => {
          if (!open) setCompletingTask(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarCheck className="size-5 text-emerald-600" />
              Complete Follow-up Task
            </DialogTitle>
            <DialogDescription>
              Record resolution outcome for <strong>{completingTask?.property}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCompleteSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="complete-outcome" className="text-xs font-semibold text-foreground">
                Resolution Outcome <span className="text-red-500">*</span>
              </label>
              <select
                id="complete-outcome"
                value={completionOutcome}
                onChange={(e) => setCompletionOutcome(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="Demo Walkthrough Scheduled">Demo Walkthrough Scheduled</option>
                <option value="Pricing Proposal Accepted">Pricing Proposal Accepted</option>
                <option value="PMS Connectivity Validated">PMS Connectivity Validated</option>
                <option value="Transferred to Human Handoff Queue">Transferred to Human Handoff Queue</option>
                <option value="Contact Made - In Discovery">Contact Made - In Discovery</option>
                <option value="Lead Nurture - No Further Action Needed">Lead Nurture - No Further Action Needed</option>
              </select>
              {completeErrors.outcome && (
                <p className="text-[10px] text-red-500">{completeErrors.outcome}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="complete-notes" className="text-xs font-semibold text-foreground">Resolution Notes</label>
              <textarea
                id="complete-notes"
                rows={2}
                placeholder="e.g. Conducted 10-minute briefing with GM. Meeting invite confirmed for Friday."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setCompletingTask(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Mark Task Resolved
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 3: CANCEL TASK CONFIRMATION                            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog
        open={cancellingTask !== null}
        onOpenChange={(open) => {
          if (!open) setCancellingTask(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="size-5 text-red-600" />
              Cancel Follow-up Task
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the scheduled callback for{' '}
              <strong>{cancellingTask?.property}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="cancel-reason" className="text-xs font-semibold text-foreground">Cancellation Reason</label>
              <Input
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Hotelier declined demonstration"
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCancellingTask(null)}>
              Keep Task
            </Button>
            <Button size="sm" variant="destructive" onClick={handleCancelSubmit}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 4: SCHEDULE NEW FOLLOW-UP                              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Schedule New Follow-up Task
            </DialogTitle>
            <DialogDescription>
              Schedule a simulated callback for a hotelier prospect in local demo state.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-3.5 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="create-property-name" className="text-xs font-semibold text-foreground">
                  Property Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="create-property-name"
                  placeholder="e.g. Royal Heritage Resort"
                  value={createForm.property}
                  onChange={(e) => setCreateForm({ ...createForm, property: e.target.value })}
                  className={createErrors.property ? 'border-red-500 text-xs' : 'text-xs'}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="create-decision-maker" className="text-xs font-semibold text-foreground">
                  Decision-Maker <span className="text-red-500">*</span>
                </label>
                <Input
                  id="create-decision-maker"
                  placeholder="e.g. Vikram Singhania"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className={createErrors.name ? 'border-red-500 text-xs' : 'text-xs'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="create-city" className="text-xs font-semibold text-foreground">City, State</label>
                <Input
                  id="create-city"
                  value={createForm.city}
                  onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="create-phone" className="text-xs font-semibold text-foreground">Demo Phone</label>
                <Input
                  id="create-phone"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="create-specialist" className="text-xs font-semibold text-foreground">Assigned Specialist</label>
                <select
                  id="create-specialist"
                  value={createForm.assignedAgent}
                  onChange={(e) => setCreateForm({ ...createForm, assignedAgent: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  {teamMembers.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="create-priority" className="text-xs font-semibold text-foreground">Task Priority</label>
                <select
                  id="create-priority"
                  value={createForm.priority}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, priority: e.target.value as 'High' | 'Medium' | 'Low' })
                  }
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="create-date" className="text-xs font-semibold text-foreground">Target Date</label>
                <Input
                  id="create-date"
                  type="date"
                  value={createForm.date}
                  onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="create-window" className="text-xs font-semibold text-foreground">Time Window (IST)</label>
                <Input
                  id="create-window"
                  value={createForm.window}
                  onChange={(e) => setCreateForm({ ...createForm, window: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="create-reason" className="text-xs font-semibold text-foreground">
                Follow-up Agenda / Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="create-reason"
                rows={2}
                placeholder="e.g. Present 30-day trial PMS integration setup and confirm pilot room allocation."
                value={createForm.reason}
                onChange={(e) => setCreateForm({ ...createForm, reason: e.target.value })}
                className={createErrors.reason ? 'w-full rounded-md border border-red-500 bg-background p-2 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring' : 'w-full rounded-md border border-input bg-background p-2 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring'}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
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
