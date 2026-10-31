import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* ─── EmptyState ────────────────────────────────────────
   Centered placeholder for lists, tables, or pages
   with no data. Shows icon, title, description, and
   an optional call-to-action.
   ────────────────────────────────────────────────────── */

interface EmptyStateProps {
  /** Decorative icon (e.g. lucide-react component or <Icon />) */
  icon?: ReactNode
  /** Headline text */
  title: string
  /** Supporting description */
  description?: string
  /** Action element (typically a <Button />) */
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
          {icon}
        </div>
      )}

      <h3 className="text-sm font-semibold text-foreground">{title}</h3>

      {description && (
        <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

