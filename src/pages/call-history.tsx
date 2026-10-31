import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, StatusBadge, EmptyState } from '@/components'
import type { StatusVariant } from '@/components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  PhoneCall,
  Clock,
  Bot,
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Building,
  Phone,
  FileText,
} from 'lucide-react'
import { useMockData } from '@/context'

const OUTCOME_OPTIONS = [
  'All Outcomes',
  'Demo booked',
  'Interested',
  'Handoff requested',
  'Callback requested',
  'Objection raised',
  'No answer / Voicemail',
]

const CAMPAIGN_OPTIONS = [
  'All Campaigns',
  'North India Independent Heritage Blitz',
  'Goa Coastal Villa & Beach Resort Re-engagement',
  'Metro Tech Hub Mid-Week Occupancy Drive',
  'Inbound Web Qualifier Blitz',
]

const AGENT_OPTIONS = [
  'All Agents',
  'Ava (Lead Qualifier)',
  'Aria (Concierge Specialist)',
  'Dev (Follow-up Specialist)',
]

const DATE_OPTIONS = [
  'All Dates',
  'Today',
  'Yesterday',
  'Older',
]

const DURATION_OPTIONS = [
  'All Durations',
  'Short (< 1 min)',
  'Medium (1 - 3 min)',
  'Long (> 3 min)',
]

function mapOutcomeToVariant(outcome: string): StatusVariant {
  switch (outcome.toLowerCase()) {
    case 'demo booked':
      return 'qualified'
    case 'interested':
      return 'hot'
    case 'handoff requested':
      return 'in-conversation'
    case 'callback requested':
      return 'follow-up'
    case 'objection raised':
      return 'scheduled'
    default:
      return 'default'
  }
}

export function CallHistoryPage() {
  const { calls } = useMockData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOutcome, setSelectedOutcome] = useState('All Outcomes')
  const [selectedCampaign, setSelectedCampaign] = useState('All Campaigns')
  const [selectedAgent, setSelectedAgent] = useState('All Agents')
  const [selectedDate, setSelectedDate] = useState('All Dates')
  const [selectedDuration, setSelectedDuration] = useState('All Durations')

  const [sortField, setSortField] = useState<'date' | 'duration' | 'intent'>('date')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Clear all filters
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedOutcome('All Outcomes')
    setSelectedCampaign('All Campaigns')
    setSelectedAgent('All Agents')
    setSelectedDate('All Dates')
    setSelectedDuration('All Durations')
    setSortField('date')
    setCurrentPage(1)
  }

  const isFilterActive =
    searchQuery.trim() !== '' ||
    selectedOutcome !== 'All Outcomes' ||
    selectedCampaign !== 'All Campaigns' ||
    selectedAgent !== 'All Agents' ||
    selectedDate !== 'All Dates' ||
    selectedDuration !== 'All Durations'

  // Filtered and sorted dataset
  const filteredCalls = useMemo(() => {
    const list = calls.filter((call) => {
      // Search matches hotelier, property, city, or phone
      const query = searchQuery.trim().toLowerCase()
      if (query) {
        const matchesName = call.name.toLowerCase().includes(query)
        const matchesProperty = call.property.toLowerCase().includes(query)
        const matchesCity = call.city.toLowerCase().includes(query)
        const matchesPhone = call.phone.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
        const matchesOutcome = call.outcome.toLowerCase().includes(query)
        if (!matchesName && !matchesProperty && !matchesCity && !matchesPhone && !matchesOutcome) {
          return false
        }
      }

      // Outcome
      if (selectedOutcome !== 'All Outcomes' && call.outcome !== selectedOutcome) {
        return false
      }

      // Campaign
      if (selectedCampaign !== 'All Campaigns' && call.campaign !== selectedCampaign) {
        return false
      }

      // Agent
      if (selectedAgent !== 'All Agents' && call.agent !== selectedAgent) {
        return false
      }

      // Date
      if (selectedDate === 'Today' && !call.date.includes('Today')) return false
      if (selectedDate === 'Yesterday' && !call.date.includes('Yesterday')) return false
      if (selectedDate === 'Older' && (call.date.includes('Today') || call.date.includes('Yesterday'))) return false

      // Duration
      if (selectedDuration === 'Short (< 1 min)' && call.durationSeconds >= 60) return false
      if (
        selectedDuration === 'Medium (1 - 3 min)' &&
        (call.durationSeconds < 60 || call.durationSeconds > 180)
      ) {
        return false
      }
      if (selectedDuration === 'Long (> 3 min)' && call.durationSeconds <= 180) return false

      return true
    })

    // Sorting
    return list.sort((a, b) => {
      if (sortField === 'duration') {
        return b.durationSeconds - a.durationSeconds
      }
      if (sortField === 'intent') {
        return b.intentScore - a.intentScore
      }
      // default: date/id
      return b.id.localeCompare(a.id)
    })
  }, [
    calls,
    searchQuery,
    selectedOutcome,
    selectedCampaign,
    selectedAgent,
    selectedDate,
    selectedDuration,
    sortField,
  ])

  // Pagination calculation
  const totalPages = Math.ceil(filteredCalls.length / pageSize) || 1
  const paginatedCalls = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCalls.slice(start, start + pageSize)
  }, [filteredCalls, currentPage, pageSize])

  // Summary Metrics
  const connectedCallsCount = useMemo(
    () => calls.filter((c) => !c.outcome.toLowerCase().includes('no answer')).length,
    [calls],
  )
  const demosBookedCount = useMemo(
    () => calls.filter((c) => c.outcome.toLowerCase().includes('demo booked')).length,
    [calls],
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="VOICE INTERACTION LOGS"
        title="Call History & Transcripts"
        description="Inspect conversational voice logs, simulated audio transcripts, extracted hotelier objections, and AI qualification tags."
      />

      {/* Safety Notice Banner */}
      <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong className="text-foreground">Simulated Dialogue Logs:</strong> Transcripts and call durations are mock demonstrations. No real audio is recorded or stored, and no voice API or real phone numbers are contacted.
          </span>
        </div>
        <span className="hidden sm:inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          Zero Audio Recording
        </span>
      </div>

      {/* Quick Summary Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Total Calls Logged</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">{calls.length}</span>
            <span className="text-[10px] text-muted-foreground">in demo session</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Connected Calls</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-emerald-600">
              {connectedCallsCount}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {Math.round((connectedCallsCount / calls.length) * 100)}% connection
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Demos Booked</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600">{demosBookedCount}</span>
            <span className="text-[10px] text-muted-foreground">qualified</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Avg Call Duration</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">3m 15s</span>
            <span className="text-[10px] text-muted-foreground">connected</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hotelier, property, city, or phone..."
              className="pl-9 pr-9 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Outcome Filter */}
            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value)}
              aria-label="Filter calls by outcome"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
            >
              {OUTCOME_OPTIONS.map((out) => (
                <option key={out} value={out}>
                  {out}
                </option>
              ))}
            </select>

            {/* Campaign Filter */}
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              aria-label="Filter calls by campaign"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring max-w-[190px] truncate"
            >
              {CAMPAIGN_OPTIONS.map((camp) => (
                <option key={camp} value={camp}>
                  {camp}
                </option>
              ))}
            </select>

            {/* Agent Filter */}
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              aria-label="Filter calls by AI voice agent"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
            >
              {AGENT_OPTIONS.map((ag) => (
                <option key={ag} value={ag}>
                  {ag}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Filter calls by date"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
            >
              {DATE_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Duration Filter */}
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              aria-label="Filter calls by duration"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
            >
              {DURATION_OPTIONS.map((dur) => (
                <option key={dur} value={dur}>
                  {dur}
                </option>
              ))}
            </select>

            {/* Sort Selector */}
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as 'date' | 'duration' | 'intent')}
              aria-label="Sort calls"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
            >
              <option value="date">Sort: Most Recent</option>
              <option value="duration">Sort: Longest Duration</option>
              <option value="intent">Sort: Highest Intent</option>
            </select>

            {/* Reset Button */}
            {isFilterActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="mr-1.5 size-3" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Summary Pill */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <SlidersHorizontal className="size-3" />
            Showing {filteredCalls.length} of {calls.length} logged interactions
          </span>

          {selectedOutcome !== 'All Outcomes' && (
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              Outcome: {selectedOutcome}
              <X className="size-2.5 cursor-pointer" onClick={() => setSelectedOutcome('All Outcomes')} />
            </Badge>
          )}

          {selectedCampaign !== 'All Campaigns' && (
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              Campaign: {selectedCampaign.split(' ')[0]}
              <X className="size-2.5 cursor-pointer" onClick={() => setSelectedCampaign('All Campaigns')} />
            </Badge>
          )}

          {selectedAgent !== 'All Agents' && (
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              Agent: {selectedAgent.split(' ')[0]}
              <X className="size-2.5 cursor-pointer" onClick={() => setSelectedAgent('All Agents')} />
            </Badge>
          )}

          {selectedDuration !== 'All Durations' && (
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              Duration: {selectedDuration}
              <X className="size-2.5 cursor-pointer" onClick={() => setSelectedDuration('All Durations')} />
            </Badge>
          )}
        </div>
      </div>

      {/* Calls Table / List */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {filteredCalls.length === 0 ? (
          <EmptyState
            icon={<PhoneCall className="size-6 text-muted-foreground" />}
            title="No call logs match your filters"
            description="Try adjusting your search keywords, clear active filter criteria, or check other date ranges."
            action={
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RotateCcw className="mr-1.5 size-3.5" />
                Clear all filters
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-border/60">
            {paginatedCalls.map((call) => (
              <div
                key={call.id}
                className="group flex flex-col gap-3 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: Contact, Property, Time, Agent */}
                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                    <PhoneCall className="size-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/calls/${call.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors text-sm"
                      >
                        {call.property}
                      </Link>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs font-medium text-foreground">{call.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        ({call.city})
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {call.date} at {call.time} ({call.duration})
                      </span>
                      <span className="flex items-center gap-1">
                        <Bot className="size-3" />
                        {call.agent}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="size-3" />
                        {call.campaign.split(' ')[0]} Blitz
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Phone className="size-2.5" />
                        {call.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Outcome badge, Intent Score & View Details Link */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right hidden md:block">
                    <span className="text-[10px] font-bold text-emerald-600 block">
                      Intent: {call.interestClassification} ({call.intentScore}%)
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      Latency {call.technicalStatus.latencyMs}ms
                    </span>
                  </div>

                  <StatusBadge variant={mapOutcomeToVariant(call.outcome)} dot>
                    {call.outcome}
                  </StatusBadge>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8 px-2.5 text-xs font-medium"
                  >
                    <Link to={`/calls/${call.id}`}>
                      <FileText className="mr-1.5 size-3.5" />
                      Transcript
                    </Link>
                  </Button>

                  <Button variant="ghost" size="sm" asChild className="size-8 p-0">
                    <Link to={`/calls/${call.id}`}>
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs bg-card">
                <span className="text-[11px] text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, filteredCalls.length)} of {filteredCalls.length} interactions
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-7 text-xs px-2.5"
                  >
                    Previous
                  </Button>
                  <span className="text-[11px] text-muted-foreground px-1 font-mono">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="h-7 text-xs px-2.5"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
