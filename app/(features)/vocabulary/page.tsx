'use client'

import dayjs from 'dayjs'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { useVocabularies } from '@/hooks/use-vocabulary'

const columns: ColumnDef<{ id: number; word: string; translation: string }>[] =
  [
    {
      accessorKey: 'id',
      header: 'id',
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue('id')}</span>
      )
    },
    {
      accessorKey: 'word',
      header: 'word',
      cell: ({ row }) => <span>{row.getValue('word')}</span>
    },
    {
      accessorKey: 'translation',
      header: 'translation',
      cell: ({ row }) => <span>{row.getValue('translation')}</span>
    },
    {
      accessorKey: 'createdAt',
      header: 'saved at',
      cell: ({ row }) => (
        <span>{dayjs(row.getValue('createdAt')).format('DD/MM/YYYY')}</span>
      )
    }
  ]

export default function Vocabulary() {
  const {
    vocabularies,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    fetchFirstPage,
    fetchLastPage,
    currentPage
  } = useVocabularies({ size: 10, offset: 0 })

  const table = useReactTable({
    data: vocabularies || [],
    columns,
    manualPagination: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="w-full overflow-auto p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s your complete vocabulary list!
          </p>
        </div>
      </div>

      <div className="mt-2 rounded-md border shadow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
        <div className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={fetchFirstPage}
            disabled={!hasPreviousPage}>
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => fetchPreviousPage()}
            disabled={!hasPreviousPage}>
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage}>
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={fetchLastPage}
            disabled={!hasNextPage}>
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
