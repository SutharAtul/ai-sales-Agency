import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── DataTable ─────────────────────────────────────────
   Generic typed table with column config, optional row
   click, hover state, and pagination footer.
   ────────────────────────────────────────────────────── */

export interface Column<T> {
  /** Column header text */
  header: string
  /** Key in the data object to auto-render */
  accessorKey?: keyof T & string
  /** Custom cell renderer (overrides accessorKey) */
  cell?: (row: T, index: number) => ReactNode
  /** Header cell class */
  headerClassName?: string
  /** Body cell class */
  className?: string
}

interface DataTableProps<T> {
  /** Column definitions */
  columns: Column<T>[]
  /** Row data array */
  data: T[]
  /** Unique key extractor — defaults to index */
  rowKey?: (row: T, index: number) => string | number
  /** Called when a row is clicked */
  onRowClick?: (row: T) => void
  /** Message shown when data is empty */
  emptyMessage?: string
  /** Current page (1-based) */
  currentPage?: number
  /** Items per page */
  pageSize?: number
  /** Total number of items (for pagination display) */
  totalItems?: number
  /** Called when the page changes */
  onPageChange?: (page: number) => void
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  emptyMessage = 'No results found.',
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  className,
}: DataTableProps<T>) {
  const showPagination =
    currentPage !== undefined &&
    pageSize !== undefined &&
    totalItems !== undefined &&
    totalItems > pageSize

  const totalPages = showPagination
    ? Math.ceil(totalItems! / pageSize!)
    : 1

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-card', className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((col) => (
                <TableHead
                  key={col.header}
                  className={cn(
                    'h-9 text-[9px] font-bold uppercase tracking-[0.6px] text-muted-foreground',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={rowKey ? rowKey(row, index) : index}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'text-[11px]',
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.header}
                      className={cn('py-3', col.className)}
                    >
                      {col.cell
                        ? col.cell(row, index)
                        : col.accessorKey
                          ? String((row as Record<string, unknown>)[col.accessorKey] ?? '')
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      {showPagination && (
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <span className="text-[10px] text-muted-foreground">
            Showing{' '}
            <strong className="text-foreground">
              {Math.min(data.length, pageSize!)}
            </strong>{' '}
            of {totalItems!.toLocaleString()} results
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage! - 1)}
              className="h-7 px-2 text-[10px]"
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange?.(page)}
                  className="h-7 min-w-[28px] px-2 text-[10px]"
                >
                  {page}
                </Button>
              )
            })}

            {totalPages > 3 && (
              <span className="px-1 text-[10px] text-muted-foreground">…</span>
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage! + 1)}
              className="h-7 gap-1 px-2 text-[10px]"
            >
              Next
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

