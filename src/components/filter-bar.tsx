import { type ReactNode, type ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── FilterBar ─────────────────────────────────────────
   Horizontal control bar with tabs, search, and extra
   filter slots. Used above tables and list views.
   ────────────────────────────────────────────────────── */

export interface FilterTab {
  label: string
  value: string
  count?: string
}

interface FilterBarProps {
  /** Tab items rendered on the left */
  tabs?: FilterTab[]
  /** Currently active tab value */
  activeTab?: string
  /** Called when a tab is clicked */
  onTabChange?: (value: string) => void
  /** Search input value */
  searchValue?: string
  /** Search placeholder */
  searchPlaceholder?: string
  /** Called on search input change */
  onSearchChange?: (value: string) => void
  /** Extra controls (filter buttons, date pickers, etc.) */
  children?: ReactNode
  className?: string
}

export function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  searchPlaceholder = 'Search…',
  onSearchChange,
  children,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex min-h-[52px] flex-wrap items-center justify-between gap-3 border-b border-border px-4',
        className,
      )}
    >
      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="flex gap-5 self-stretch" role="tablist">
          {tabs.map((tab) => {
            const active = activeTab === tab.value
            return (
              <button
                key={tab.value}
                role="tab"
                aria-selected={active}
                onClick={() => onTabChange?.(tab.value)}
                className={cn(
                  'relative border-b-2 px-0.5 text-[11px] transition-colors',
                  active
                    ? 'border-primary font-semibold text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
                {tab.count && (
                  <span
                    className={cn(
                      'ml-1.5 rounded-full px-1.5 py-0.5 text-[8px]',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Right side: search + extra children */}
      <div className="flex items-center gap-2">
        {onSearchChange !== undefined && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              placeholder={searchPlaceholder}
              className="h-8 w-40 pl-8 text-[11px]"
            />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

