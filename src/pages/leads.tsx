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
  Search,
  X,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  Building2,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Hotel,
  TrendingUp,
  Award,
} from 'lucide-react'
import { useMockData } from '@/context'
import type { Lead, LeadInterest } from '@/types'

type SortField = 'property' | 'city' | 'rooms' | 'score' | 'status' | 'interest' | 'lastContact'
type SortOrder = 'asc' | 'desc'

interface FormErrors {
  name?: string
  property?: string
  city?: string
  state?: string
  rooms?: string
  phone?: string
  email?: string
}

const SOURCES = [
  'All Sources',
  'Voice AI Campaign',
  'Inbound Website',
  'IndiaMART',
  'Trade show',
  'Direct Referral',
  'OTA Outreach',
]

const STATUSES = [
  'All Statuses',
  'Qualified',
  'Hot lead',
  'In conversation',
  'Follow-up',
  'New lead',
  'Unresponsive',
]

const INTEREST_LEVELS: Array<'All' | LeadInterest> = [
  'All',
  'High',
  'Medium',
  'Low',
  'Undecided',
]

const AVATAR_COLOR_MAP: Record<string, string> = {
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
}

function mapStatusToVariant(status: string): StatusVariant {
  switch (status.toLowerCase()) {
    case 'qualified':
      return 'qualified'
    case 'hot lead':
    case 'hot':
      return 'hot'
    case 'in conversation':
      return 'in-conversation'
    case 'follow-up':
      return 'follow-up'
    case 'new lead':
    case 'new':
      return 'new'
    default:
      return 'default'
  }
}

export function LeadsPage() {
  // Shared leads list from master context
  const { leads, addLead } = useMockData()

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [selectedSource, setSelectedSource] = useState('All Sources')
  const [selectedInterest, setSelectedInterest] = useState<'All' | LeadInterest>('All')

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('score')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  // Safe create-lead modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    property: '',
    city: '',
    state: 'Rajasthan',
    rooms: '40',
    phone: '+91 99999 00021',
    email: '',
    source: 'Voice AI Campaign',
    status: 'New lead',
    interest: 'High' as LeadInterest,
    score: '75',
    adr: '₹4,500',
    notes: '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // Toggle sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  // Clear all filters
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedStatus('All Statuses')
    setSelectedSource('All Sources')
    setSelectedInterest('All')
    setCurrentPage(1)
  }

  const isFilterActive =
    searchQuery.trim() !== '' ||
    selectedStatus !== 'All Statuses' ||
    selectedSource !== 'All Sources' ||
    selectedInterest !== 'All'

  // Filtered and sorted dataset
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search filter matches hotelier name, property name, city, state, or phone
      const query = searchQuery.trim().toLowerCase()
      if (query) {
        const matchesName = lead.name.toLowerCase().includes(query)
        const matchesProperty = lead.property.toLowerCase().includes(query)
        const matchesCity = lead.city.toLowerCase().includes(query)
        const matchesState = lead.state.toLowerCase().includes(query)
        const matchesPhone = lead.phone.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
        if (!matchesName && !matchesProperty && !matchesCity && !matchesState && !matchesPhone) {
          return false
        }
      }

      // Status filter
      if (selectedStatus !== 'All Statuses' && lead.status !== selectedStatus) {
        return false
      }

      // Source filter
      if (selectedSource !== 'All Sources' && lead.source !== selectedSource) {
        return false
      }

      // Interest filter
      if (selectedInterest !== 'All' && lead.interest !== selectedInterest) {
        return false
      }

      return true
    })
  }, [leads, searchQuery, selectedStatus, selectedSource, selectedInterest])

  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'property':
          comparison = a.property.localeCompare(b.property)
          break
        case 'city':
          comparison = a.city.localeCompare(b.city)
          break
        case 'rooms':
          comparison = a.rooms - b.rooms
          break
        case 'score':
          comparison = a.score - b.score
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'interest':
          comparison = (a.interest || '').localeCompare(b.interest || '')
          break
        case 'lastContact':
          comparison = a.lastContact.localeCompare(b.lastContact)
          break
        default:
          comparison = 0
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [filteredLeads, sortField, sortOrder])

  // Pagination calculation
  const totalItems = sortedLeads.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedLeads.slice(start, start + pageSize)
  }, [sortedLeads, currentPage, pageSize])

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    if (!formData.name.trim()) errors.name = 'Contact name is required'
    if (!formData.property.trim()) errors.property = 'Property name is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.state.trim()) errors.state = 'State is required'

    const roomsNum = parseInt(formData.rooms, 10)
    if (isNaN(roomsNum) || roomsNum <= 0) {
      errors.rooms = 'Room count must be a positive number'
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 8) {
      errors.phone = 'Please provide a realistic dummy phone format'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Safe Create Lead
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const nameParts = formData.name.trim().split(' ')
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : formData.name.slice(0, 2).toUpperCase()

    const colors = ['blue', 'emerald', 'rose', 'purple', 'amber', 'indigo']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: formData.name.trim(),
      property: formData.property.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      location: `${formData.city.trim()}, ${formData.state.trim()}`,
      initials,
      color: randomColor,
      score: parseInt(formData.score, 10) || 75,
      status: formData.status,
      interest: formData.interest,
      source: formData.source,
      lastContact: 'Just now',
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      rooms: parseInt(formData.rooms, 10) || 30,
      adr: formData.adr.trim() || '₹4,500',
      notes: formData.notes.trim() || 'Manually captured prospective hotelier for AI voice outreach.',
      createdAt: new Date().toISOString().split('T')[0],
    }

    addLead(newLead)
    setIsCreateOpen(false)
    setSuccessBanner(`Hotelier lead "${newLead.property}" (${newLead.name}) added to pipeline!`)

    // Reset form
    setFormData({
      name: '',
      property: '',
      city: '',
      state: 'Rajasthan',
      rooms: '40',
      phone: `+91 99999 000${Math.floor(20 + Math.random() * 70)}`,
      email: '',
      source: 'Voice AI Campaign',
      status: 'New lead',
      interest: 'High',
      score: '75',
      adr: '₹4,500',
      notes: '',
    })
    setFormErrors({})
  }

  // Pipeline metrics
  const highInterestCount = useMemo(
    () => leads.filter((l) => l.interest === 'High').length,
    [leads],
  )
  const qualifiedCount = useMemo(
    () => leads.filter((l) => l.status === 'Qualified').length,
    [leads],
  )
  const avgRooms = useMemo(() => {
    if (leads.length === 0) return 0
    const sum = leads.reduce((acc, l) => acc + l.rooms, 0)
    return Math.round(sum / leads.length)
  }, [leads])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="HOTELIER PROSPECT PIPELINE"
        title="Hotelier Leads"
        description="Search, filter, and inspect verified hotelier prospects across Indian markets. Prioritized by JusBid fit score."
      >
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="shadow-xs"
          >
            <Plus className="mr-1.5 size-3.5" />
            Add Hotel Lead
          </Button>
        </div>
      </PageHeader>

      {/* Safety Notice Banner */}
      <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong className="text-foreground">Fictional Demo Data:</strong> All hotelier contacts use safe synthetic test numbers (<code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">+91 99999 000XX</code>) to prevent accidental calls.
          </span>
        </div>
        <span className="hidden sm:inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          Safe Mode Active
        </span>
      </div>

      {/* Temporary Success Banner */}
      {successBanner && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-50/70 p-3 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">Total Prospects</span>
            <Hotel className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">{leads.length}</span>
            <span className="text-[10px] text-muted-foreground">in active registry</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">High Interest</span>
            <TrendingUp className="size-4 text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-emerald-600">{highInterestCount}</span>
            <span className="text-[10px] text-muted-foreground">ready for demo</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">AI Qualified</span>
            <Award className="size-4 text-indigo-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600">{qualifiedCount}</span>
            <span className="text-[10px] text-muted-foreground">handoff ready</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">Avg Room Inventory</span>
            <Building2 className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">{avgRooms}</span>
            <span className="text-[10px] text-muted-foreground">keys / property</span>
          </div>
        </div>
      </div>

      {/* Main Filter and Search Controls */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by hotelier name, property, city, state, or phone..."
              className="pl-9 pr-9 text-xs"
              aria-label="Search hotelier leads"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setCurrentPage(1)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Filter by Lead Status"
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div className="relative">
              <select
                value={selectedSource}
                onChange={(e) => {
                  setSelectedSource(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Filter by Lead Source"
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                {SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            {/* Interest Filter */}
            <div className="relative">
              <select
                value={selectedInterest}
                onChange={(e) => {
                  setSelectedInterest(e.target.value as 'All' | LeadInterest)
                  setCurrentPage(1)
                }}
                aria-label="Filter by Interest Level"
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                {INTEREST_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl === 'All' ? 'All Interest Levels' : `${lvl} Interest`}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters Button */}
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

        {/* Active Filters Summary */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <SlidersHorizontal className="size-3" />
            Showing {filteredLeads.length} of {leads.length} leads
          </span>

          {selectedStatus !== 'All Statuses' && (
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              Status: {selectedStatus}
              <X
                className="size-2.5 cursor-pointer"
                onClick={() => setSelectedStatus('All Statuses')}
              />
            </Badge>
          )}

          {selectedSource !== 'All Sources' && (
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              Source: {selectedSource}
              <X
                className="size-2.5 cursor-pointer"
                onClick={() => setSelectedSource('All Sources')}
              />
            </Badge>
          )}

          {selectedInterest !== 'All' && (
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              Interest: {selectedInterest}
              <X
                className="size-2.5 cursor-pointer"
                onClick={() => setSelectedInterest('All')}
              />
            </Badge>
          )}
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {paginatedLeads.length === 0 ? (
          <EmptyState
            icon={<Search className="size-6" />}
            title="No hotelier leads found"
            description={
              isFilterActive
                ? 'No prospects match your current search query and filter criteria. Try resetting filters or adding a new prospect.'
                : 'Your hotel prospect registry is currently empty.'
            }
            action={
              isFilterActive ? (
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  <RotateCcw className="mr-1.5 size-3.5" />
                  Clear all filters
                </Button>
              ) : (
                <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                  <Plus className="mr-1.5 size-3.5" />
                  Add Hotel Lead
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                  <th
                    scope="col"
                    onClick={() => handleSort('property')}
                    className="cursor-pointer py-3 pl-4 pr-3 transition-colors hover:text-foreground"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Hotel & Hotelier</span>
                      {sortField === 'property' ? (
                        sortOrder === 'asc' ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                      ) : (
                        <ArrowUpDown className="size-3 text-muted-foreground/60" />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    onClick={() => handleSort('city')}
                    className="cursor-pointer px-3 py-3 transition-colors hover:text-foreground"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Location</span>
                      {sortField === 'city' ? (
                        sortOrder === 'asc' ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                      ) : (
                        <ArrowUpDown className="size-3 text-muted-foreground/60" />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    onClick={() => handleSort('rooms')}
                    className="cursor-pointer px-3 py-3 text-center transition-colors hover:text-foreground"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Keys</span>
                      {sortField === 'rooms' ? (
                        sortOrder === 'asc' ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                      ) : (
                        <ArrowUpDown className="size-3 text-muted-foreground/60" />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    onClick={() => handleSort('score')}
                    className="cursor-pointer px-3 py-3 text-center transition-colors hover:text-foreground"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Fit Score</span>
                      {sortField === 'score' ? (
                        sortOrder === 'asc' ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                      ) : (
                        <ArrowUpDown className="size-3 text-muted-foreground/60" />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    onClick={() => handleSort('status')}
                    className="cursor-pointer px-3 py-3 transition-colors hover:text-foreground"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      {sortField === 'status' ? (
                        sortOrder === 'asc' ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                      ) : (
                        <ArrowUpDown className="size-3 text-muted-foreground/60" />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    onClick={() => handleSort('interest')}
                    className="cursor-pointer px-3 py-3 transition-colors hover:text-foreground"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Interest</span>
                      {sortField === 'interest' ? (
                        sortOrder === 'asc' ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                      ) : (
                        <ArrowUpDown className="size-3 text-muted-foreground/60" />
                      )}
                    </div>
                  </th>

                  <th scope="col" className="px-3 py-3">
                    <span>Contact Display</span>
                  </th>

                  <th scope="col" className="py-3 pl-3 pr-4 text-right">
                    <span>Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {paginatedLeads.map((lead) => {
                  return (
                    <tr
                      key={lead.id}
                      className="group transition-colors hover:bg-muted/40"
                    >
                      {/* Hotel & Hotelier */}
                      <td className="py-3.5 pl-4 pr-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex size-9 shrink-0 items-center justify-center rounded-lg font-bold ${
                              AVATAR_COLOR_MAP[lead.color] || AVATAR_COLOR_MAP.indigo
                            }`}
                          >
                            {lead.initials}
                          </div>
                          <div>
                            <Link
                              to={`/leads/${lead.id}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                              <span>{lead.property}</span>
                              <ExternalLink className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {lead.name} · <span className="text-muted-foreground/80">{lead.source}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                          <span>{lead.city}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground pl-5">
                          {lead.state}
                        </span>
                      </td>

                      {/* Keys / Rooms */}
                      <td className="px-3 py-3.5 text-center">
                        <span className="inline-block font-semibold text-foreground">
                          {lead.rooms}
                        </span>
                        <p className="text-[10px] text-muted-foreground">rooms</p>
                      </td>

                      {/* JusBid Fit Score */}
                      <td className="px-3 py-3.5 text-center">
                        <div className="inline-flex items-center justify-center rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {lead.score}
                          <span className="text-[9px] font-normal text-emerald-600/80">/100</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5">
                        <StatusBadge variant={mapStatusToVariant(lead.status)} dot>
                          {lead.status}
                        </StatusBadge>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {lead.lastContact}
                        </p>
                      </td>

                      {/* Interest Level */}
                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            lead.interest === 'High'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : lead.interest === 'Medium'
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                                : lead.interest === 'Low'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                  : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {lead.interest} Interest
                        </span>
                      </td>

                      {/* Contact Phone & Email */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground">
                          <Phone className="size-3 text-muted-foreground" />
                          <span>{lead.phone}</span>
                          <span className="rounded bg-muted px-1 text-[9px] font-sans font-medium text-muted-foreground">
                            Demo
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground truncate max-w-[160px]">
                          <Mail className="size-3 shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      </td>

                      {/* Row Action Link */}
                      <td className="py-3.5 pl-3 pr-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 text-xs font-medium text-primary hover:text-primary"
                        >
                          <Link to={`/leads/${lead.id}`}>
                            Details
                            <ChevronRight className="ml-1 size-3.5" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {sortedLeads.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border px-4 py-3 gap-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                Showing{' '}
                <strong className="text-foreground">
                  {(currentPage - 1) * pageSize + 1}
                </strong>{' '}
                to{' '}
                <strong className="text-foreground">
                  {Math.min(currentPage * pageSize, totalItems)}
                </strong>{' '}
                of <strong className="text-foreground">{totalItems}</strong> prospects
              </span>

              <div className="flex items-center gap-1.5">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="h-7 rounded border border-input bg-background px-1.5 text-xs text-foreground"
                >
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 px-2.5 text-xs"
              >
                <ChevronLeft className="mr-1 size-3.5" />
                Previous
              </Button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-8 min-w-[32px] px-2 text-xs"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 px-2.5 text-xs"
              >
                Next
                <ChevronRight className="ml-1 size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Safe Create Lead Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hotel className="size-5 text-primary" />
              Add Hotelier Prospect
            </DialogTitle>
            <DialogDescription>
              Record a new prospective hotelier for automated AI voice qualification. All records are safely contained in your local browser sandbox.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="rounded-lg border border-border/80 bg-muted/40 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
              <span>
                Safety constraint: Mock telephone numbers use safe simulated test formats (<code className="font-mono text-foreground">+91 99999 XXXXX</code>) to avoid real phone contact.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Hotel / Property Name */}
              <div className="space-y-1.5">
                <label htmlFor="lead-property-name" className="text-xs font-semibold text-foreground">
                  Property Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lead-property-name"
                  placeholder="e.g. Royal Heritage Resort"
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  className={formErrors.property ? 'border-red-500 text-xs' : 'text-xs'}
                />
                {formErrors.property && (
                  <p className="text-[10px] text-red-500">{formErrors.property}</p>
                )}
              </div>

              {/* Hotelier / Owner Name */}
              <div className="space-y-1.5">
                <label htmlFor="lead-owner-name" className="text-xs font-semibold text-foreground">
                  Hotelier / GM Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lead-owner-name"
                  placeholder="e.g. Vikram Singhania"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={formErrors.name ? 'border-red-500 text-xs' : 'text-xs'}
                />
                {formErrors.name && (
                  <p className="text-[10px] text-red-500">{formErrors.name}</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label htmlFor="lead-city" className="text-xs font-semibold text-foreground">
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lead-city"
                  placeholder="e.g. Jaipur"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={formErrors.city ? 'border-red-500 text-xs' : 'text-xs'}
                />
                {formErrors.city && (
                  <p className="text-[10px] text-red-500">{formErrors.city}</p>
                )}
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label htmlFor="lead-state" className="text-xs font-semibold text-foreground">
                  State / Region <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lead-state"
                  placeholder="e.g. Rajasthan"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={formErrors.state ? 'border-red-500 text-xs' : 'text-xs'}
                />
                {formErrors.state && (
                  <p className="text-[10px] text-red-500">{formErrors.state}</p>
                )}
              </div>

              {/* Room Inventory */}
              <div className="space-y-1.5">
                <label htmlFor="lead-rooms" className="text-xs font-semibold text-foreground">
                  Room Inventory (Keys) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lead-rooms"
                  type="number"
                  min="1"
                  max="500"
                  placeholder="40"
                  value={formData.rooms}
                  onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                  className={formErrors.rooms ? 'border-red-500 text-xs' : 'text-xs'}
                />
                {formErrors.rooms && (
                  <p className="text-[10px] text-red-500">{formErrors.rooms}</p>
                )}
              </div>

              {/* Fake Phone */}
              <div className="space-y-1.5">
                <label htmlFor="lead-phone" className="text-xs font-semibold text-foreground">
                  Demo Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lead-phone"
                  placeholder="+91 99999 00021"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={formErrors.phone ? 'border-red-500 text-xs font-mono' : 'text-xs font-mono'}
                />
                {formErrors.phone && (
                  <p className="text-[10px] text-red-500">{formErrors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="lead-email" className="text-xs font-semibold text-foreground">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="vikram@royalheritage-demo.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={formErrors.email ? 'border-red-500 text-xs' : 'text-xs'}
                />
                {formErrors.email && (
                  <p className="text-[10px] text-red-500">{formErrors.email}</p>
                )}
              </div>

              {/* Source Channel */}
              <div className="space-y-1.5">
                <label htmlFor="lead-source" className="text-xs font-semibold text-foreground">Acquisition Source</label>
                <select
                  id="lead-source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  {SOURCES.filter((s) => s !== 'All Sources').map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pipeline Status */}
              <div className="space-y-1.5">
                <label htmlFor="lead-initial-status" className="text-xs font-semibold text-foreground">Initial Status</label>
                <select
                  id="lead-initial-status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  {STATUSES.filter((s) => s !== 'All Statuses').map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interest Level */}
              <div className="space-y-1.5">
                <label htmlFor="lead-interest-level" className="text-xs font-semibold text-foreground">Interest Level</label>
                <select
                  id="lead-interest-level"
                  value={formData.interest}
                  onChange={(e) =>
                    setFormData({ ...formData, interest: e.target.value as LeadInterest })
                  }
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Undecided">Undecided</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label htmlFor="lead-notes" className="text-xs font-semibold text-foreground">Hotelier Notes & Context</label>
              <textarea
                id="lead-notes"
                rows={2}
                placeholder="e.g. Currently high OTA dependence (25% commission). Wants guest direct bidding for weekend slots."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground shadow-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Hotel Prospect
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
