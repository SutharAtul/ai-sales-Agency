import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/* ─── StatusBadge ───────────────────────────────────────
   Semantic status indicator with optional leading dot.
   Maps CRM statuses to consistent color pairs.
   ────────────────────────────────────────────────────── */

export type StatusVariant =
  | 'qualified'
  | 'hot'
  | 'new'
  | 'in-conversation'
  | 'follow-up'
  | 'active'
  | 'paused'
  | 'scheduled'
  | 'overdue'
  | 'default'

const variantStyles: Record<StatusVariant, string> = {
  qualified: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  hot: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
  new: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400',
  'in-conversation': 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
  'follow-up': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  paused: 'bg-muted text-muted-foreground',
  scheduled: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  overdue: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  default: 'bg-muted text-muted-foreground',
}

interface StatusBadgeProps {
  /** Semantic status variant */
  variant?: StatusVariant
  /** Show a small colored dot before the label */
  dot?: boolean
  /** Label text */
  children: React.ReactNode
  className?: string
}

export function StatusBadge({
  variant = 'default',
  dot = false,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 border-transparent px-2 py-0.5 text-[9px] font-semibold',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span className="size-1.5 shrink-0 rounded-full bg-current" />
      )}
      {children}
    </Badge>
  )
}

