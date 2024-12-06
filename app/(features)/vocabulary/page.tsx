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
      cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>
    },
    {
      accessorKey: 'word',
      header: 'word',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('word')}</div>
      )
    },
    {
      accessorKey: 'translation',
      header: 'translation',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('translation')}</div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'saved at',
      cell: ({ row }) => (
        <div>{dayjs(row.getValue('createdAt')).format('DD/MM/YYYY')}</div>
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
    currentPage,
    pagination,
    setPagination
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => setPagination({ ...pagination, offset: 0 })}
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
            onClick={() => setPagination({ ...pagination, offset: 0 })}
            disabled={!hasNextPage}>
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
