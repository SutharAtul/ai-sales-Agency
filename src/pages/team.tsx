import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, StatusBadge } from '@/components'
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
  UserPlus,
  Users,
  Building,
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react'
import { useMockData } from '@/context'
import type { TeamMember } from '@/types'

export function TeamPage() {
  const { teamMembers: team, addTeamMember, handoffs } = useMockData()

  // Modals state
  const [inspectingMember, setInspectingMember] = useState<TeamMember | null>(null)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    name: '',
    role: 'Onboarding Specialist',
    email: '',
    phone: '+91 99999 00055',
    focus: 'Boutique Resorts & Heritage Stays',
  })

  // Feedback banner
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null)

  // Handle Invite Specialist (Local State)
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return

    const nameParts = inviteForm.name.trim().split(' ')
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : inviteForm.name.slice(0, 2).toUpperCase()

    const colors = ['rose', 'blue', 'green', 'amber', 'purple', 'indigo']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const newMember: TeamMember = {
      id: `agent-${Date.now()}`,
      name: inviteForm.name.trim(),
      role: inviteForm.role,
      email: inviteForm.email.trim(),
      phone: inviteForm.phone.trim(),
      initials,
      color: randomColor,
      assigned: 0,
      inProgress: 0,
      closed: 0,
      rate: 0,
      status: 'Online',
      focus: inviteForm.focus.trim(),
      avgSpeed: '3.0 days',
      assignedProperties: [],
    }

    addTeamMember(newMember)
    setIsInviteOpen(false)
    setInviteForm({
      name: '',
      role: 'Onboarding Specialist',
      email: '',
      phone: `+91 99999 000${Math.floor(55 + Math.random() * 40)}`,
      focus: 'Boutique Resorts & Heritage Stays',
    })
    setFeedbackBanner(
      `Specialist "${newMember.name}" invited and added to team registry in demo session!`,
    )
  }

  // Summary Metrics
  const totalAssigned = useMemo(
    () => team.reduce((acc, m) => acc + (m.assigned || 0), 0),
    [team],
  )
  const totalClosed = useMemo(
    () => team.reduce((acc, m) => acc + (m.closed || 0), 0),
    [team],
  )
  const avgCloseRate = useMemo(() => {
    if (team.length === 0) return 0
    const sum = team.reduce((acc, m) => acc + (m.rate || 0), 0)
    return (sum / team.length).toFixed(1)
  }, [team])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="AGENCY TEAM & CAPACITY"
        title="Sales & Onboarding Team"
        description="Fictional human onboarding specialists managing hotelier handoffs, conducting live PMS walkthroughs, and verifying certified property activations."
      >
        <Button size="sm" onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="mr-1.5 size-3.5" />
          Invite Team Member
        </Button>
      </PageHeader>

      {/* Safety Notice */}
      <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong className="text-foreground">Fictional Team Roster:</strong> All agent profiles, contact information, and pipeline assignments are simulated mock data. No real staff invitations or email notifications are sent.
          </span>
        </div>
        <span className="hidden sm:inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          Demo Team Sandbox
        </span>
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

      {/* Quick Summary Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Active Specialists</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">{team.length}</span>
            <span className="text-[10px] text-muted-foreground">team members</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Assigned Hoteliers</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600">{totalAssigned}</span>
            <span className="text-[10px] text-muted-foreground">in active triage</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Certified Onboarded</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-emerald-600">{totalClosed}</span>
            <span className="text-[10px] text-muted-foreground">hotels live</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Avg Conversion Rate</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">{avgCloseRate}%</span>
            <span className="text-[10px] text-muted-foreground">qualification-to-close</span>
          </div>
        </div>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {team.map((member) => (
          <div
            key={member.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:border-indigo-400/40 hover:shadow-xs"
          >
            <div>
              {/* Header: Avatar, Name, Status */}
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 font-bold text-primary dark:bg-indigo-950/50 dark:text-indigo-300">
                  {member.initials}
                </div>
                <StatusBadge
                  variant={
                    member.status === 'Online'
                      ? 'active'
                      : member.status === 'In a call'
                        ? 'in-conversation'
                        : 'paused'
                  }
                  dot
                >
                  {member.status}
                </StatusBadge>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-foreground text-base">{member.name}</h3>
                <p className="text-xs text-primary font-medium">{member.role}</p>
                {member.focus && (
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {member.focus}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-3.5 space-y-1 text-[11px] text-muted-foreground border-t border-border pt-3">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{member.email || `${member.name.toLowerCase().replace(' ', '.')}@jusbid-demo.in`}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="size-3 shrink-0" />
                  <span>{member.phone || '+91 99999 00050'}</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="mt-4 space-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Assigned Hoteliers:</span>
                  <span className="font-semibold text-foreground">{member.assigned}</span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress:</span>
                  <span className="font-medium text-foreground">{member.inProgress || 4}</span>
                </div>
                <div className="flex justify-between">
                  <span>Certified Onboarded:</span>
                  <span className="font-bold text-emerald-600">{member.closed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Close Ratio:</span>
                  <span className="font-bold text-foreground">{member.rate}%</span>
                </div>
                {member.avgSpeed && (
                  <div className="flex justify-between">
                    <span>Avg Onboarding Speed:</span>
                    <span className="font-medium text-foreground">{member.avgSpeed}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-5 border-t border-border pt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectingMember(member)}
                className="w-full text-xs"
              >
                <Building className="mr-1.5 size-3.5" />
                View Deals ({member.assignedProperties?.length || 0})
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 1: VIEW ASSIGNED HOTELIERS DIALOG                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog
        open={inspectingMember !== null}
        onOpenChange={(open) => {
          if (!open) setInspectingMember(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Assigned Hoteliers: {inspectingMember?.name}
            </DialogTitle>
            <DialogDescription>
              Properties currently assigned to {inspectingMember?.name} for live walkthrough and certified onboarding.
            </DialogDescription>
          </DialogHeader>

          {inspectingMember && (
            <div className="space-y-4 py-2 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div>
                  <h4 className="font-bold text-foreground">{inspectingMember.name}</h4>
                  <p className="text-muted-foreground text-[11px]">{inspectingMember.role}</p>
                </div>
                <Badge variant="outline" className="text-emerald-700 bg-emerald-50">
                  {inspectingMember.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-foreground text-xs">Active Deals & Properties:</span>
                {inspectingMember.assignedProperties && inspectingMember.assignedProperties.length > 0 ? (
                  <div className="space-y-2">
                    {inspectingMember.assignedProperties.map((prop) => {
                      // Attempt matching with handoff item
                      const matchingHandoff = handoffs.find((h) =>
                        prop.toLowerCase().includes(h.property.toLowerCase()),
                      )

                      return (
                        <div
                          key={prop}
                          className="flex items-center justify-between rounded-lg border border-border/80 p-3 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Building className="size-4 text-primary shrink-0" />
                            <div>
                              <strong className="text-foreground">{prop}</strong>
                              <p className="text-[11px] text-muted-foreground">
                                Active Discovery & PMS Setup
                              </p>
                            </div>
                          </div>

                          {matchingHandoff ? (
                            <Button variant="ghost" size="sm" asChild className="h-7 text-xs text-primary">
                              <Link to={`/onboarding/${matchingHandoff.id}`}>
                                Details <ExternalLink className="ml-1 size-3" />
                              </Link>
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" asChild className="h-7 text-xs text-primary">
                              <Link to="/handoffs">
                                View in Queue <ChevronRight className="ml-1 size-3" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic py-2">
                    No properties currently assigned to this specialist.
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInspectingMember(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 2: INVITE TEAM MEMBER DIALOG                            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              Invite Onboarding Specialist
            </DialogTitle>
            <DialogDescription>
              Add a new fictional human sales or onboarding agent to your demo roster.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInviteSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="invite-specialist-name" className="text-xs font-semibold text-foreground">Full Name *</label>
              <Input
                id="invite-specialist-name"
                placeholder="e.g. Vikramaditya Rathore"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="invite-specialist-role" className="text-xs font-semibold text-foreground">Specialist Role</label>
              <select
                id="invite-specialist-role"
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="Senior Sales & Onboarding Specialist">Senior Sales & Onboarding Specialist</option>
                <option value="Enterprise Accounts & Integration Specialist">Enterprise Accounts & Integration Specialist</option>
                <option value="Boutique & Coastal Onboarding Specialist">Boutique & Coastal Onboarding Specialist</option>
                <option value="Hospitality Growth Specialist">Hospitality Growth Specialist</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="invite-specialist-email" className="text-xs font-semibold text-foreground">Work Email Address *</label>
              <Input
                id="invite-specialist-email"
                type="email"
                placeholder="e.g. vikram.rathore@jusbid-demo.in"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="invite-specialist-phone" className="text-xs font-semibold text-foreground">Phone Number</label>
              <Input
                id="invite-specialist-phone"
                placeholder="+91 99999 00055"
                value={inviteForm.phone}
                onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="invite-specialist-focus" className="text-xs font-semibold text-foreground">Regional / Property Focus</label>
              <Input
                id="invite-specialist-focus"
                placeholder="e.g. Himachal & Uttarakhand Mountain Chalets"
                value={inviteForm.focus}
                onChange={(e) => setInviteForm({ ...inviteForm, focus: e.target.value })}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!inviteForm.name.trim() || !inviteForm.email.trim()}>
                Add Specialist
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
