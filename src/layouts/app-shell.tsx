import { useState, useEffect, type ReactNode } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { MOCK_OPERATOR, type OperatorProfile } from './navigation-data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  Search,
  ArrowRight,
  PhoneCall,
  Building,
} from 'lucide-react'
import { useMockData } from '@/context'

interface AppShellProps {
  children?: ReactNode
  operator?: OperatorProfile
}

export function AppShell({
  children,
  operator = MOCK_OPERATOR,
}: AppShellProps) {
  const navigate = useNavigate()
  const { leads, calls, campaigns } = useMockData()

  // Collapsed sidebar state (desktop)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jusbid_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  // Mobile menu drawer state
  const [mobileOpen, setMobileOpen] = useState(false)

  // Notification Drawer/Modal state
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  // Global Command / Search state
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Save collapse state to localStorage
  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('jusbid_sidebar_collapsed', String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  // Keyboard shortcut `[` or `Ctrl+B` for sidebar, `⌘K` or `Ctrl+K` for global search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
        return
      }

      if (isInput) return

      if (e.key === '[' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b')) {
        e.preventDefault()
        handleToggleCollapse()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filtered search results
  const filteredSearchLeads = leads
    .filter(
      (l) =>
        searchQuery &&
        (l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.city.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice(0, 4)

  const filteredSearchCalls = calls
    .filter(
      (c) =>
        searchQuery &&
        (c.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.outcome.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice(0, 3)

  const filteredSearchCampaigns = campaigns
    .filter(
      (c) =>
        searchQuery &&
        (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice(0, 3)

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:text-indigo-200">
      {/* Skip to main content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2.5 focus:text-xs focus:font-semibold focus:text-primary-foreground focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Responsive Collapsible Sidebar (Fixed to screen) */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        operator={operator}
      />

      {/* Main Content Area (Fixed Topbar + Scrollable Main Content) */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Topbar
          sidebarCollapsed={collapsed}
          onToggleSidebarCollapse={handleToggleCollapse}
          onOpenMobileMenu={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          onSearchQueryChange={() => setSearchOpen(true)}
          operator={operator}
          onNotificationClick={() => setNotificationsOpen(true)}
        />

        {/* Main Content Region - Only this area scrolls */}
        <main
          id="main-content"
          tabIndex={-1}
          role="main"
          className="flex-1 overflow-y-auto outline-none"
        >
          <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* ────────────────── GLOBAL NOTIFICATIONS MODAL ────────────────── */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Bell className="size-4 text-primary" />
                Live Agency Handoff Alerts
              </DialogTitle>
              {unreadCount > 0 && (
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-[10px]">
                  {unreadCount} New
                </Badge>
              )}
            </div>
            <DialogDescription>
              Real-time events dispatched from autonomous voice agents and triage queues.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="rounded-lg border border-border bg-card p-3 space-y-1 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Immediate Handoff Requested</span>
                </div>
                <span className="text-[10px] text-muted-foreground">14 min ago</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Priya Nair (Mango Tree Boutique Stay, Kochi) requested specialist review on 31 rooms and Ayurvedic package bidding.
              </p>
              <div className="pt-1.5 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] px-2"
                  onClick={() => {
                    setNotificationsOpen(false)
                    navigate('/onboarding/handoff-1')
                  }}
                >
                  View Ticket <ArrowRight className="ml-1 size-2.5" />
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-500" />
                  <span>AI Qualifier Turn Succeeded</span>
                </div>
                <span className="text-[10px] text-muted-foreground">38 min ago</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Ava completed qualification for Coastal Bay Resort (Goa). Intent evaluated at 89/100.
              </p>
              <div className="pt-1.5 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] px-2"
                  onClick={() => {
                    setNotificationsOpen(false)
                    navigate('/calls/call-2')
                  }}
                >
                  View Transcript <ArrowRight className="ml-1 size-2.5" />
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span>Scheduled Callback Due</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Today, 2:30 PM</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Vikramaditya Singh (Blue Lotus Heritage Haveli) callback scheduled for Dev (Follow-up Specialist).
              </p>
              <div className="pt-1.5 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] px-2"
                  onClick={() => {
                    setNotificationsOpen(false)
                    navigate('/followups')
                  }}
                >
                  Open Follow-up Queue <ArrowRight className="ml-1 size-2.5" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setUnreadCount(0)}
            >
              Mark all as read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotificationsOpen(false)}
            >
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ────────────────── GLOBAL COMMAND / SEARCH MODAL ────────────────── */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border border-border bg-card shadow-2xl">
          <div className="flex items-center border-b border-border px-3 py-2.5">
            <Search className="size-4 text-muted-foreground mr-2 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search hotelier leads, calls, campaigns, or specialist team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          <div className="max-h-80 overflow-y-auto p-3 space-y-4 text-xs">
            {searchQuery ? (
              <>
                {/* Leads Results */}
                {filteredSearchLeads.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-1">
                      Hotelier Leads ({filteredSearchLeads.length})
                    </span>
                    {filteredSearchLeads.map((lead) => (
                      <button
                        key={lead.id}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false)
                          navigate(`/leads/${lead.id}`)
                        }}
                        className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Building className="size-3.5 text-primary" />
                          <span className="font-medium text-foreground">{lead.property}</span>
                          <span className="text-muted-foreground">({lead.city})</span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {lead.status}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {/* Calls Results */}
                {filteredSearchCalls.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-1">
                      Call Transcripts ({filteredSearchCalls.length})
                    </span>
                    {filteredSearchCalls.map((call) => (
                      <button
                        key={call.id}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false)
                          navigate(`/calls/${call.id}`)
                        }}
                        className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <PhoneCall className="size-3.5 text-indigo-400" />
                          <span className="font-medium text-foreground">{call.property}</span>
                          <span className="text-muted-foreground">· {call.outcome}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{call.duration}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Campaigns Results */}
                {filteredSearchCampaigns.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-1">
                      Campaigns ({filteredSearchCampaigns.length})
                    </span>
                    {filteredSearchCampaigns.map((camp) => (
                      <button
                        key={camp.id}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false)
                          navigate('/campaigns')
                        }}
                        className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-foreground">{camp.name}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {camp.status}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {filteredSearchLeads.length === 0 &&
                  filteredSearchCalls.length === 0 &&
                  filteredSearchCampaigns.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      No matching records found for "{searchQuery}".
                    </div>
                  )}
              </>
            ) : (
              <div className="py-6 text-center space-y-2 text-muted-foreground">
                <Search className="size-8 mx-auto opacity-40" />
                <p>Type to search hoteliers, simulated transcripts, active campaigns, or specialists.</p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px]"
                    onClick={() => {
                      setSearchOpen(false)
                      navigate('/leads')
                    }}
                  >
                    View Leads
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px]"
                    onClick={() => {
                      setSearchOpen(false)
                      navigate('/calls')
                    }}
                  >
                    View Calls
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px]"
                    onClick={() => {
                      setSearchOpen(false)
                      navigate('/handoffs')
                    }}
                  >
                    View Handoffs
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
