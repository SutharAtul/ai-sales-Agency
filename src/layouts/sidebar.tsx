import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  NAV_SECTIONS,
  MOCK_OPERATOR,
  type OperatorProfile,
} from './navigation-data'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
  operator?: OperatorProfile
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  operator = MOCK_OPERATOR,
}: SidebarProps) {
  const location = useLocation()
  const mobileRef = useRef<HTMLDivElement>(null)

  // Close mobile drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileOpen) {
        onCloseMobile()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen, onCloseMobile])

  // Automatically close mobile drawer upon navigation
  useEffect(() => {
    if (mobileOpen) {
      onCloseMobile()
    }
  }, [location.pathname, mobileOpen, onCloseMobile])

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const renderNavContent = (isMobile = false) => {
    const isCompact = collapsed && !isMobile

    return (
      <TooltipProvider delayDuration={150}>
        <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
          {/* Brand header */}
          <div
            className={cn(
              'flex items-center border-b border-sidebar-border/60 transition-all duration-200',
              isCompact ? 'h-16 justify-center px-2' : 'h-16 justify-between px-4',
            )}
          >
            <Link
              to="/overview"
              onClick={() => {
                if (isMobile) onCloseMobile()
              }}
              className="flex items-center gap-3 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-lg"
            >
              {/* Brand logo glyph */}
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-primary font-serif text-lg font-black text-white shadow-md shadow-indigo-950/40"
                aria-hidden="true"
              >
                J
              </div>

              {!isCompact && (
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-lg font-semibold tracking-tight text-white">
                      Jus<span className="text-indigo-400">Bid</span>
                    </span>
                    <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-indigo-300">
                      AI SALES
                    </span>
                  </div>
                  <span className="text-[10px] font-medium tracking-wide text-sidebar-foreground/60">
                    Hospitality Agency Suite
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile close button */}
            {isMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex size-8 items-center justify-center rounded-lg text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                aria-label="Close sidebar menu"
              >
                <X className="size-5" />
              </button>
            )}

            {/* Desktop collapse toggle */}
            {!isMobile && !isCompact && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden size-7 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring lg:flex"
                aria-label="Collapse sidebar (keyboard shortcut: [)"
                title="Collapse sidebar"
              >
                <ChevronLeft className="size-4" />
              </button>
            )}
          </div>

          {/* Workspace Switcher / Badge */}
          {!isCompact && (
            <div className="border-b border-sidebar-border/50 px-3 py-2.5">
              <Link
                to="/settings"
                onClick={() => {
                  if (isMobile) onCloseMobile()
                }}
                className="group flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border/70 bg-sidebar-accent/50 px-2.5 py-2 text-left transition-colors hover:border-indigo-400/50 hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-300">
                  <Layers className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-white">
                    {operator.workspace}
                  </p>
                  <p className="flex items-center gap-1 text-[9px] text-sidebar-foreground/60">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    3 AI Agents Calling Live
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Navigation Items Organized by the 6 Categories */}
          <nav
            className="flex-1 space-y-4 overflow-y-auto px-2.5 py-3 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent"
            aria-label="Main Navigation"
          >
            {NAV_SECTIONS.map((section) => (
              <div key={section.category} className="space-y-1">
                {/* Category Header */}
                {!isCompact ? (
                  <h3 className="px-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
                    {section.category}
                  </h3>
                ) : (
                  <div className="mx-auto my-1 h-px w-6 bg-sidebar-border/40" />
                )}

                {/* Items */}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const IconComponent = item.icon
                    const isActive =
                      item.path === '/overview'
                        ? location.pathname === '/' || location.pathname === '/overview'
                        : item.path === '/handoffs'
                          ? location.pathname === '/handoffs' ||
                            location.pathname.startsWith('/handoffs/') ||
                            location.pathname.startsWith('/onboarding')
                          : location.pathname === item.path || location.pathname.startsWith(item.path + '/')

                    const linkElement = (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => {
                          if (isMobile) onCloseMobile()
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'group relative flex w-full items-center rounded-lg text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                          isCompact
                            ? 'h-10 justify-center px-0'
                            : 'h-9 gap-3 px-2.5',
                          isActive
                            ? 'bg-sidebar-accent font-semibold text-white shadow-sm'
                            : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-white',
                        )}
                      >
                        {/* Active indicator bar */}
                        {isActive && (
                          <span
                            className={cn(
                              'absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-400',
                              isCompact && '-left-0.5',
                            )}
                            aria-hidden="true"
                          />
                        )}

                        <IconComponent
                          className={cn(
                            'size-4 shrink-0 transition-transform duration-150',
                            isActive
                              ? 'text-indigo-400'
                              : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground',
                            !isCompact && 'group-hover:scale-105',
                          )}
                        />

                        {!isCompact && (
                          <>
                            <span className="min-w-0 flex-1 truncate">
                              {item.label}
                            </span>

                            {item.badge && (
                              <span
                                className={cn(
                                  'ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none',
                                  item.badgeVariant === 'success' &&
                                    'bg-emerald-500/20 text-emerald-300',
                                  item.badgeVariant === 'warning' &&
                                    'bg-amber-500/20 text-amber-300',
                                  item.badgeVariant === 'info' &&
                                    'bg-sky-500/20 text-sky-300',
                                  (!item.badgeVariant || item.badgeVariant === 'default') &&
                                    'bg-sidebar-border/70 text-sidebar-foreground/80',
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    )

                    // In compact mode, wrap with tooltip
                    if (isCompact) {
                      return (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
                          <TooltipContent side="right" className="flex items-center gap-2">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="rounded bg-indigo-600 px-1 py-0.5 text-[9px] font-bold text-white">
                                {item.badge}
                              </span>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      )
                    }

                    return linkElement
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* AI Capacity widget (hidden when compact) */}
          {!isCompact && (
            <div className="mx-3 my-2 rounded-xl border border-sidebar-border/60 bg-gradient-to-b from-sidebar-accent/70 to-sidebar-accent/30 p-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <Sparkles className="size-3.5" />
                  AI Voice Minutes
                </span>
                <span className="font-mono text-[10px] text-sidebar-foreground/75">
                  72%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sidebar-border/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                  style={{ width: '72%' }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[9px] text-sidebar-foreground/60">
                <span>3,612 / 5,000 used</span>
                <Link
                  to="/analytics"
                  onClick={() => {
                    if (isMobile) onCloseMobile()
                  }}
                  className="font-semibold text-indigo-300 hover:underline"
                >
                  View limits →
                </Link>
              </div>
            </div>
          )}

          {/* Operator Profile Footer */}
          <div className="border-t border-sidebar-border/60 p-2.5">
            <Link
              to="/settings"
              onClick={() => {
                if (isMobile) onCloseMobile()
              }}
              className={cn(
                'group flex w-full items-center rounded-lg p-1.5 transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                isCompact ? 'justify-center' : 'gap-2.5',
              )}
              aria-label="Open operator profile & settings"
            >
              <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600/30 text-[11px] font-bold text-indigo-300 ring-1 ring-indigo-400/40">
                {operator.initials}
                <span
                  className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-sidebar bg-emerald-400"
                  title="Operator online"
                />
              </div>

              {!isCompact && (
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-xs font-semibold text-white group-hover:text-indigo-200">
                    {operator.name}
                  </p>
                  <p className="truncate text-[10px] text-sidebar-foreground/60">
                    {operator.role}
                  </p>
                </div>
              )}
            </Link>

            {/* Expand button when in compact desktop mode */}
            {isCompact && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="mt-2 flex h-7 w-full items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <ChevronRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      </TooltipProvider>
    )
  }

  return (
    <>
      {/* Desktop Sidebar (Fixed / Sticky on Left) */}
      <aside
        id="desktop-sidebar"
        aria-label="Application Navigation"
        className={cn(
          'sticky top-0 left-0 z-20 hidden h-screen shrink-0 border-r border-sidebar-border/60 transition-all duration-300 ease-in-out lg:block',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        {renderNavContent(false)}
      </aside>

      {/* Mobile Drawer Backdrop & Container */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            ref={mobileRef}
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transition-transform duration-300 ease-in-out"
          >
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  )
}
