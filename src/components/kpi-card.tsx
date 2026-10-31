import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/* ─── KpiCard ───────────────────────────────────────────
   Compact metric card for dashboards.
   Shows value, label, trend change, and optional icon.
   ────────────────────────────────────────────────────── */

interface KpiCardProps {
  /** Metric label (e.g. "Total leads") */
  label: string
  /** Formatted metric value (e.g. "1,284") */
  value: string
  /** Change string (e.g. "+12.8%") */
  change?: string
  /** Direction of the change */
  changeType?: 'positive' | 'negative' | 'neutral'
  /** Extra context shown below the label */
  note?: string
  /** Icon element rendered in the top-left */
  icon?: ReactNode
  className?: string
}

const changeBg: Record<string, string> = {
  positive: 'text-status-success',
  negative: 'text-status-danger',
  neutral: 'text-muted-foreground',
}

export function KpiCard({
  label,
  value,
  change,
  changeType = 'positive',
  note,
  icon,
  className,
}: KpiCardProps) {
  return (
    <Card className={cn('relative min-h-[136px]', className)}>
      <CardContent className="p-4">
        {/* Top row: icon + change badge */}
        <div className="flex items-start justify-between">
          {icon && (
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary">
              {icon}
            </div>
          )}
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[10px] font-semibold',
                changeBg[changeType],
              )}
            >
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              {change}
            </span>
          )}
        </div>

        {/* Value */}
        <p className="mt-3 font-serif text-[26px] leading-none tracking-tight text-foreground">
          {value}
        </p>

        {/* Label */}
        <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground">
          {label}
        </p>

        {/* Note */}
        {note && (
          <p className="mt-1 text-[9px] text-muted-foreground/70">{note}</p>
        )}
      </CardContent>
    </Card>
  )
}

