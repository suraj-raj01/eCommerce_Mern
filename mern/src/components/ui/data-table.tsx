import { useEffect, useState } from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { Skeleton } from '../../components/ui/skeleton'
import api from "../../API"

// ✅ Table skeleton rows component
const TableSkeleton = ({ columns, rows = 5 }: { columns: number; rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={`skeleton-${rowIndex}`}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`} className="py-4">
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
)

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  currentPage: number
  onPageChange: (page: number) => void
  onSearch?: (query: string) => void
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  currentPage,
  onPageChange,
  onSearch,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // ✅ Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch?.(globalFilter)
    }, 500)
    return () => clearTimeout(timeout)
  }, [globalFilter, onSearch])

  return (
    <div className="w-full space-y-4 overflow-hidden">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        {isLoading ? (
          <Skeleton className="h-9 w-full sm:w-80" />
        ) : (
          <Input
            placeholder="Search ..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        )}

        {isLoading ? (
          <Skeleton className="h-9 w-full sm:w-20 sm:ml-auto" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto sm:ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-w-[95vw]" // ✅ prevent overflow on small devices
            >
              <DropdownMenuLabel>Manage View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table with horizontal scroll for mobile */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full sm:min-w-[600px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {isLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : header.isPlaceholder ? null : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={columns.length} rows={5} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {(() => {
                        const cellValue = cell.getValue()
                        const isImage =
                          typeof cellValue === 'string' &&
                          (/\.(jpeg|jpg|png|gif|webp|svg)$/i.test(cellValue) ||
                            cellValue.toLowerCase().startsWith('https') ||
                            cellValue.startsWith('data:image'))

                        if (isImage) {
                          let imageUrl
                          if (/^https?:\/\//.test(cellValue)) {
                            imageUrl = cellValue
                          } else {
                            imageUrl = `${api}/uploads/${cellValue}`
                          }
                          return (
                            <div className="shrink-0">
                              <img
                                src={imageUrl}
                                alt="Image"
                                width={40}
                                height={40}
                                className="object-cover rounded-full"
                              />
                            </div>
                          )
                        }
                        return flexRender(cell.column.columnDef.cell, cell.getContext())
                      })()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-12" />
          </>
        ) : (
          <>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= pageCount}
              >
                Next
              </Button>
            </div>
            <span className="text-center sm:text-right">
              Page {currentPage} of {pageCount}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
