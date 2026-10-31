import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react'
import type {
  Lead,
  Campaign,
  AiAgent,
  Call,
  HandoffItem,
  FollowupItem,
  TeamMember,
  HandoffStatus,
  FollowupStatus,
  HandoffNote,
  ContactAttempt,
} from '@/types'
import { initialLeads } from '@/data/mock/leads'
import { mockCampaigns } from '@/data/mock/campaigns'
import { mockAiAgents } from '@/data/mock/agents'
import { calls as initialCalls } from '@/data/mock/calls'
import { handoffQueue as initialHandoffs } from '@/data/mock/handoffs'
import { followupItems as initialFollowups } from '@/data/mock/followups'
import { teamMembers as initialTeamMembers } from '@/data/mock/team'

export interface DerivedMetrics {
  totalLeads: number
  qualifiedLeads: number
  hotLeads: number
  totalCalls: number
  connectedCalls: number
  interestedCalls: number
  connectionRate: string
  interestedRate: string
  qualificationRate: string
  pendingHandoffs: number
  completedHandoffs: number
  unassignedHandoffs: number
  dueFollowups: number
  overdueFollowups: number
  completedFollowups: number
  activeCampaigns: number
  activeAgents: number
}

interface MockDataContextType {
  // Master Entities
  leads: Lead[]
  campaigns: Campaign[]
  agents: AiAgent[]
  calls: Call[]
  handoffs: HandoffItem[]
  followups: FollowupItem[]
  teamMembers: TeamMember[]

  // Derived Metrics
  derivedMetrics: DerivedMetrics

  // Entity Mutations
  updateLead: (id: string, updates: Partial<Lead>) => void
  addLead: (lead: Lead) => void
  deleteLead: (id: string) => void

  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  addCampaign: (campaign: Campaign) => void

  updateAgent: (id: string, updates: Partial<AiAgent>) => void

  updateCall: (id: string, updates: Partial<Call>) => void
  addCall: (call: Call) => void

  updateHandoff: (id: string, updates: Partial<HandoffItem>) => void
  addHandoff: (handoff: HandoffItem) => void
  reassignHandoff: (handoffId: string, newAgentName: string, newAgentRole?: string, newAgentId?: string) => void
  addHandoffNote: (handoffId: string, noteText: string, author?: string) => void
  logContactAttempt: (handoffId: string, attempt: Omit<ContactAttempt, 'id'>) => void
  toggleChecklistMilestone: (handoffId: string, milestoneId: string, completedBy?: string) => void

  updateFollowup: (id: string, updates: Partial<FollowupItem>) => void
  rescheduleFollowup: (id: string, date: string, window: string, reason: string) => void
  completeFollowup: (id: string, outcome: string) => void
  addFollowup: (task: FollowupItem) => void

  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void
  addTeamMember: (member: TeamMember) => void

  // Reset helper
  resetAllMockData: () => void
}

const STORAGE_KEY_PREFIX = 'jusbid_demo_data_v1_'

function loadSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_PREFIX + key)
    if (raw) {
      return JSON.parse(raw) as T
    }
  } catch {
    // sessionStorage disabled or unavailable in sandbox
  }
  return fallback
}

function saveSession<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value))
  } catch {
    // ignore quota/sandbox errors
  }
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined)

export function MockDataProvider({ children }: { children: ReactNode }) {
  // Master Entities State (seeded with typed mock data)
  const [leads, setLeads] = useState<Lead[]>(() => loadSession('leads', initialLeads))
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => loadSession('campaigns', mockCampaigns))
  const [agents, setAgents] = useState<AiAgent[]>(() => loadSession('agents', mockAiAgents))
  const [calls, setCalls] = useState<Call[]>(() => loadSession('calls', initialCalls))
  const [handoffs, setHandoffs] = useState<HandoffItem[]>(() => loadSession('handoffs', initialHandoffs))
  const [followups, setFollowups] = useState<FollowupItem[]>(() => loadSession('followups', initialFollowups))
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => loadSession('team', initialTeamMembers))

  // Sync to session storage on change
  useEffect(() => {
    saveSession('leads', leads)
  }, [leads])

  useEffect(() => {
    saveSession('campaigns', campaigns)
  }, [campaigns])

  useEffect(() => {
    saveSession('agents', agents)
  }, [agents])

  useEffect(() => {
    saveSession('calls', calls)
  }, [calls])

  useEffect(() => {
    saveSession('handoffs', handoffs)
  }, [handoffs])

  useEffect(() => {
    saveSession('followups', followups)
  }, [followups])

  useEffect(() => {
    saveSession('team', teamMembers)
  }, [teamMembers])

  // ─── Lead Mutations ───
  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }

  const addLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev])
  }

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  // ─── Campaign Mutations ───
  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const addCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => [campaign, ...prev])
  }

  // ─── Agent Mutations ───
  const updateAgent = (id: string, updates: Partial<AiAgent>) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }

  // ─── Call Mutations ───
  const updateCall = (id: string, updates: Partial<Call>) => {
    setCalls((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates }
          // If outcome changed to an interested/qualified status, sync lead interest
          // IMPORTANT BUSINESS RULE: Never automatically mark lead as 'Onboarded'
          if (updates.outcome && c.leadId) {
            const isInterested =
              updates.outcome.toLowerCase().includes('interested') ||
              updates.outcome.toLowerCase().includes('qualified') ||
              updates.outcome.toLowerCase().includes('demo booked') ||
              updates.outcome.toLowerCase().includes('meeting')

            if (isInterested) {
              setLeads((leadList) =>
                leadList.map((l) =>
                  l.id === c.leadId && l.status !== 'Onboarded'
                    ? {
                        ...l,
                        interest: 'High',
                        status: l.status === 'New' || l.status === 'Contacted' ? 'Interested' : l.status,
                        score: Math.max(l.score, 88),
                        notes: `${l.notes ? l.notes + ' · ' : ''}AI voice qualification verified strong interest on ${new Date().toLocaleDateString('en-IN')}`,
                      }
                    : l
                )
              )
            }
          }
          return updated
        }
        return c
      })
    )
  }

  const addCall = (call: Call) => {
    setCalls((prev) => [call, ...prev])
  }

  // ─── Handoff Mutations ───
  const updateHandoff = (id: string, updates: Partial<HandoffItem>) => {
    setHandoffs((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const updated = { ...h, ...updates }
          // If status completed, sync with linked lead and update specialist close count
          if (updates.status === 'completed') {
            if (h.leadId) {
              setLeads((leadList) =>
                leadList.map((l) =>
                  l.id === h.leadId
                    ? {
                        ...l,
                        status: 'Onboarded',
                        notes: `${l.notes ? l.notes + ' · ' : ''}Human Onboarding Certified on ${new Date().toLocaleDateString('en-IN')}`,
                      }
                    : l
                )
              )
            }

            // Sync specialist closed metrics
            if (h.assignedAgent || h.assignedAgentId) {
              setTeamMembers((teamList) =>
                teamList.map((tm) => {
                  if (tm.name === h.assignedAgent || tm.id === h.assignedAgentId) {
                    const closed = tm.closed + 1
                    const assigned = Math.max(0, tm.assigned - 1)
                    const inProgress = Math.max(0, (tm.inProgress || 0) - 1)
                    const rate = assigned + closed > 0 ? Number(((closed / (assigned + closed)) * 100).toFixed(1)) : tm.rate
                    return { ...tm, closed, inProgress, rate }
                  }
                  return tm
                })
              )
            }
          }
          return updated
        }
        return h
      })
    )
  }

  const addHandoff = (newHandoff: HandoffItem) => {
    setHandoffs((prev) => [newHandoff, ...prev])

    // If linked to a lead, update lead status to Qualified / Interested
    // CRITICAL: Under no circumstances does this mark the lead as 'Onboarded'
    if (newHandoff.leadId) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === newHandoff.leadId && l.status !== 'Onboarded'
            ? {
                ...l,
                status: l.status === 'New' || l.status === 'Contacted' ? 'Interested' : l.status,
                interest: 'High',
                notes: `${l.notes ? l.notes + ' · ' : ''}Transferred to human specialist handoff queue (${newHandoff.priority} priority).`,
              }
            : l
        )
      )
    }

    // If an agent is already assigned, update their team member assigned count and active property
    if (newHandoff.assignedAgent || newHandoff.assignedAgentId) {
      setTeamMembers((prev) =>
        prev.map((tm) => {
          if (tm.name === newHandoff.assignedAgent || tm.id === newHandoff.assignedAgentId) {
            const updatedProps = newHandoff.property && (!tm.assignedProperties || !tm.assignedProperties.includes(newHandoff.property))
              ? [...(tm.assignedProperties || []), newHandoff.property]
              : tm.assignedProperties
            return {
              ...tm,
              assigned: tm.assigned + 1,
              assignedProperties: updatedProps,
            }
          }
          return tm
        })
      )
    }
  }

  const reassignHandoff = (
    handoffId: string,
    newAgentName: string,
    newAgentRole?: string,
    newAgentId?: string
  ) => {
    let propertyName = ''

    setHandoffs((prev) =>
      prev.map((h) => {
        if (h.id === handoffId) {
          propertyName = h.property
          const newStatus: HandoffStatus = h.status === 'unassigned' ? 'assigned' : h.status
          return {
            ...h,
            assignedAgent: newAgentName,
            assignedAgentRole: newAgentRole || h.assignedAgentRole,
            assignedAgentId: newAgentId || h.assignedAgentId,
            status: newStatus,
            activityLog: [
              {
                id: `act-${Date.now()}`,
                title: 'Assigned Specialist Reallocated',
                description: `Handoff assigned to ${newAgentName}.`,
                timestamp: 'Just now',
                actor: newAgentName,
                type: 'human',
              },
              ...(h.activityLog || []),
            ],
          }
        }
        return h
      })
    )

    // Update team member's active count and assignedProperties
    setTeamMembers((prev) =>
      prev.map((tm) => {
        if (tm.name === newAgentName || (newAgentId && tm.id === newAgentId)) {
          const updatedProps = propertyName && (!tm.assignedProperties || !tm.assignedProperties.includes(propertyName))
            ? [...(tm.assignedProperties || []), propertyName]
            : tm.assignedProperties
          return {
            ...tm,
            assigned: tm.assigned + 1,
            assignedProperties: updatedProps,
          }
        }
        return tm
      })
    )
  }

  const addHandoffNote = (handoffId: string, noteText: string, author = 'Human Specialist') => {
    const newNote: HandoffNote = {
      id: `note-${Date.now()}`,
      author,
      text: noteText,
      createdAt: 'Just now',
    }

    setHandoffs((prev) =>
      prev.map((h) => {
        if (h.id === handoffId) {
          return {
            ...h,
            notes: [newNote, ...h.notes],
            activityLog: [
              {
                id: `act-${Date.now()}`,
                title: 'Note Added',
                description: `Note added by ${author}: "${noteText.slice(0, 60)}..."`,
                timestamp: 'Just now',
                actor: author,
                type: 'human',
              },
              ...(h.activityLog || []),
            ],
          }
        }
        return h
      })
    )
  }

  const logContactAttempt = (
    handoffId: string,
    attempt: Omit<ContactAttempt, 'id'>
  ) => {
    const newAttempt: ContactAttempt = {
      id: `att-${Date.now()}`,
      ...attempt,
    }

    setHandoffs((prev) =>
      prev.map((h) => {
        if (h.id === handoffId) {
          const currentAttempts = h.contactAttempts || []
          const nextStatus: HandoffStatus =
            h.status === 'unassigned' || h.status === 'assigned' ? 'contacted' : h.status

          return {
            ...h,
            status: nextStatus,
            contactAttempts: [newAttempt, ...currentAttempts],
            activityLog: [
              {
                id: `act-${Date.now()}`,
                title: `Contact Attempt: ${attempt.type.toUpperCase()}`,
                description: `${attempt.outcome} - ${attempt.notes || 'No notes'}`,
                timestamp: 'Just now',
                actor: attempt.agent,
                type: 'human',
              },
              ...(h.activityLog || []),
            ],
          }
        }
        return h
      })
    )
  }

  const toggleChecklistMilestone = (
    handoffId: string,
    milestoneId: string,
    completedBy = 'Human Specialist'
  ) => {
    setHandoffs((prev) =>
      prev.map((h) => {
        if (h.id === handoffId) {
          const checklist = (h.checklist || []).map((m) => {
            if (m.id === milestoneId) {
              const nextState = !m.completed
              return {
                ...m,
                completed: nextState,
                completedAt: nextState ? 'Just now' : undefined,
                completedBy: nextState ? completedBy : undefined,
              }
            }
            return m
          })

          // If milestone 5 is completed, mark handoff as completed and sync lead
          const milestone5 = checklist.find((m) => m.id === 'chk-5')
          const isAllDone = milestone5?.completed === true
          const nextStatus: HandoffStatus = isAllDone ? 'completed' : h.status

          if (isAllDone && h.leadId) {
            setLeads((leadList) =>
              leadList.map((l) =>
                l.id === h.leadId
                  ? {
                      ...l,
                      status: 'Onboarded',
                      notes: `${l.notes ? l.notes + ' · ' : ''}Onboarding verified by ${completedBy} on ${new Date().toLocaleDateString('en-IN')}`,
                    }
                  : l
              )
            )
          }

          return {
            ...h,
            checklist,
            status: nextStatus,
          }
        }
        return h
      })
    )
  }

  // ─── Followup Mutations ───
  const updateFollowup = (id: string, updates: Partial<FollowupItem>) => {
    setFollowups((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const rescheduleFollowup = (id: string, date: string, window: string, reason: string) => {
    setFollowups((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            status: 'upcoming' as FollowupStatus,
            scheduledDate: date,
            scheduledTime: window,
            preferredCallbackWindow: `${date}, ${window}`,
            time: `Rescheduled (${date})`,
            notes: `${f.notes ? f.notes + ' | ' : ''}Rescheduled: ${reason}`,
          }
        }
        return f
      })
    )
  }

  const completeFollowup = (id: string, outcome: string) => {
    setFollowups((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            status: 'completed' as FollowupStatus,
            completedAt: 'Just now',
            completionOutcome: outcome,
            time: 'Completed',
          }
        }
        return f
      })
    )
  }

  const addFollowup = (task: FollowupItem) => {
    setFollowups((prev) => [task, ...prev])
  }

  // ─── Team Mutations ───
  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) => prev.map((tm) => (tm.id === id ? { ...tm, ...updates } : tm)))
  }

  const addTeamMember = (member: TeamMember) => {
    setTeamMembers((prev) => [...prev, member])
  }

  // ─── Reset helper ───
  const resetAllMockData = () => {
    try {
      sessionStorage.clear()
    } catch {
      // ignore
    }
    setLeads(initialLeads)
    setCampaigns(mockCampaigns)
    setAgents(mockAiAgents)
    setCalls(initialCalls)
    setHandoffs(initialHandoffs)
    setFollowups(initialFollowups)
    setTeamMembers(initialTeamMembers)
  }

  // ─── Derived Metrics Computation ───
  const derivedMetrics: DerivedMetrics = useMemo(() => {
    const totalLeads = leads.length
    const qualifiedLeads = leads.filter(
      (l) => l.status === 'Qualified' || l.status === 'Onboarded'
    ).length
    const hotLeads = leads.filter((l) => l.status === 'Hot lead').length

    const totalCalls = calls.length
    const connectedCalls = calls.filter((c) => c.outcome !== 'No answer / Voicemail').length
    const interestedCalls = calls.filter(
      (c) => c.interestClassification === 'High' || c.interestClassification === 'Medium'
    ).length

    const connectionRate = totalCalls > 0 ? `${((connectedCalls / totalCalls) * 100).toFixed(1)}%` : '0%'
    const interestedRate =
      connectedCalls > 0 ? `${((interestedCalls / connectedCalls) * 100).toFixed(1)}%` : '0%'
    const qualificationRate =
      interestedCalls > 0 ? `${((qualifiedLeads / interestedCalls) * 100).toFixed(1)}%` : '0%'

    const pendingHandoffs = handoffs.filter((h) => h.status !== 'completed').length
    const completedHandoffs = handoffs.filter((h) => h.status === 'completed').length
    const unassignedHandoffs = handoffs.filter((h) => h.status === 'unassigned').length

    const dueFollowups = followups.filter((f) => f.status === 'due').length
    const overdueFollowups = followups.filter((f) => f.status === 'overdue').length
    const completedFollowups = followups.filter((f) => f.status === 'completed').length

    const activeCampaigns = campaigns.filter((c) => c.status === 'active').length
    const activeAgents = agents.filter((a) => a.isEnabled).length

    return {
      totalLeads,
      qualifiedLeads,
      hotLeads,
      totalCalls,
      connectedCalls,
      interestedCalls,
      connectionRate,
      interestedRate,
      qualificationRate,
      pendingHandoffs,
      completedHandoffs,
      unassignedHandoffs,
      dueFollowups,
      overdueFollowups,
      completedFollowups,
      activeCampaigns,
      activeAgents,
    }
  }, [leads, campaigns, agents, calls, handoffs, followups])

  const contextValue = useMemo<MockDataContextType>(
    () => ({
      leads,
      campaigns,
      agents,
      calls,
      handoffs,
      followups,
      teamMembers,
      derivedMetrics,
      updateLead,
      addLead,
      deleteLead,
      updateCampaign,
      addCampaign,
      updateAgent,
      updateCall,
      addCall,
      updateHandoff,
      addHandoff,
      reassignHandoff,
      addHandoffNote,
      logContactAttempt,
      toggleChecklistMilestone,
      updateFollowup,
      rescheduleFollowup,
      completeFollowup,
      addFollowup,
      updateTeamMember,
      addTeamMember,
      resetAllMockData,
    }),
    [leads, campaigns, agents, calls, handoffs, followups, teamMembers, derivedMetrics]
  )

  return <MockDataContext.Provider value={contextValue}>{children}</MockDataContext.Provider>
}

export function useMockData(): MockDataContextType {
  const context = useContext(MockDataContext)
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider')
  }
  return context
}

