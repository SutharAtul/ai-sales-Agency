import { type ChangeEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  Search,
  Bell,
  ChevronRight,
} from 'lucide-react'
import { findNavMetaByPath, MOCK_OPERATOR, type OperatorProfile } from './navigation-data'

interface TopbarProps {
  sidebarCollapsed: boolean
  onToggleSidebarCollapse: () => void
  onOpenMobileMenu: () => void
  searchQuery?: string
  onSearchQueryChange?: (val: string) => void
  operator?: OperatorProfile
  onNotificationClick?: () => void
}

export function Topbar({
  sidebarCollapsed,
  onToggleSidebarCollapse,
  onOpenMobileMenu,
  searchQuery = '',
  onSearchQueryChange,
  operator = MOCK_OPERATOR,
  onNotificationClick,
}: TopbarProps) {
  const location = useLocation()
  const { category, label, parentPath } = findNavMetaByPath(location.pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md transition-colors sm:px-6">
      {/* Left section: toggles & breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu hamburger button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open sidebar menu"
          className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="size-4" />
        </button>

        {/* Desktop sidebar collapse toggle */}
        <button
          type="button"
          onClick={onToggleSidebarCollapse}
          aria-label={sidebarCollapsed ? 'Expand sidebar (Shortcut: [)' : 'Collapse sidebar (Shortcut: [)'}
          title={sidebarCollapsed ? 'Expand sidebar (Shortcut: [)' : 'Collapse sidebar (Shortcut: [)'}
          className="hidden size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>

        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <li className="hidden items-center gap-1.5 md:flex">
              <Link to="/overview" className="font-medium hover:text-foreground transition-colors">
                JusBid Sales
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
            </li>

            <li className="flex items-center gap-1.5">
              <Link to={parentPath} className="font-medium text-muted-foreground hover:text-foreground transition-colors">
                {category}
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
            </li>

            <li className="min-w-0">
              <span
                className="block truncate font-semibold text-foreground"
                aria-current="page"
              >
                {label}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Right section: live status, search, notifications, operator profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Live Calling Status Indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 xl:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span>AI Calling Active:</span>
          <span className="font-semibold text-emerald-800 dark:text-emerald-200">
            Ava · Aria · Dev live
          </span>
        </div>

        {/* Global Search Bar (Desktop) */}
        {onSearchQueryChange && (
          <div className="relative hidden w-56 sm:block md:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onSearchQueryChange(e.target.value)
              }
              placeholder="Search leads, calls, team..."
              className="h-8 w-full rounded-lg border border-border bg-card pl-8 pr-12 text-xs text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              aria-label="Global search across pipeline"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        )}

        {/* Global Search Button (Mobile only) */}
        {onSearchQueryChange && (
          <button
            type="button"
            onClick={() => onSearchQueryChange('')}
            aria-label="Open global search (Shortcut: ⌘K)"
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Search className="size-4" />
          </button>
        )}

        {/* Notifications Button */}
        <button
          type="button"
          onClick={onNotificationClick}
          aria-label="View notifications (1 unread)"
          className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-indigo-600 ring-2 ring-background" />
        </button>

        <div className="hidden h-5 w-px bg-border sm:block" />

        {/* Operator Profile Pill */}
        <Link
          to="/settings"
          className="flex items-center gap-2 rounded-lg border border-border/80 bg-card p-1 pr-2 text-left transition-colors hover:border-indigo-400/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Signed in as ${operator.name}. Click to view settings.`}
        >
          <div className="flex size-7 items-center justify-center rounded-md bg-indigo-600/20 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            {operator.initials}
          </div>
          <div className="hidden flex-col text-left sm:flex">
            <span className="text-[11px] font-semibold leading-tight text-foreground">
              {operator.name}
            </span>
            <span className="text-[9px] leading-none text-muted-foreground">
              {operator.role}
            </span>
          </div>
        </Link>
      </div>
    </header>
  )
}
