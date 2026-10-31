import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* ─── PageHeader ────────────────────────────────────────
   Top-of-page block with optional eyebrow, title,
   description, and action buttons.
   ────────────────────────────────────────────────────── */

interface PageHeaderProps {
  /** Small uppercase label above the title */
  eyebrow?: string
  /** Page title (required) */
  title: string
  /** Short supporting description below the title */
  description?: string
  /** Action buttons / controls rendered on the right */
  children?: ReactNode
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        'mb-6',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[1.4px] text-primary/70">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-2xl font-medium tracking-tight text-foreground lg:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}

