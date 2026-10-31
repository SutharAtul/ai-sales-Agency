import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

/* ─── ConfirmDialog ─────────────────────────────────────
   Controlled confirmation dialog built on shadcn
   AlertDialog. Supports destructive and default variants.
   ────────────────────────────────────────────────────── */

interface ConfirmDialogProps {
  /** Controlled open state */
  open: boolean
  /** Called when the open state changes (e.g. on backdrop click / cancel) */
  onOpenChange: (open: boolean) => void
  /** Dialog title */
  title: string
  /** Optional supporting description */
  description?: string
  /** Label for the confirm button. @default "Confirm" */
  confirmLabel?: string
  /** Label for the cancel button. @default "Cancel" */
  cancelLabel?: string
  /** Called when the user confirms */
  onConfirm: () => void
  /** Visual variant — "destructive" shows a red confirm button */
  variant?: 'default' | 'destructive'
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" size="default">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            size="default"
            className={cn(
              variant === 'destructive' && 'bg-destructive text-white hover:bg-destructive/90',
            )}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
