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
import { useVocabularies, useVocabulary } from '@/hooks/use-vocabulary'
import { Memory, Vocabulary as VocabularyType } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useMemory } from '@/hooks/use-memory'

const columns: ColumnDef<VocabularyType & { memories?: Memory[] }>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(e) => table.toggleAllRowsSelected(!!e)}
        className="size-6 rounded-full border-gray-300"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(e) => row.toggleSelected(!!e)}
        className="size-6 rounded-full border-gray-300"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: 'id',
    cell: ({ row }) => <span className="capitalize">{row.getValue('id')}</span>
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
  },
  {
    accessorKey: 'updatedAt',
    header: 'updated at',
    cell: ({ row }) => (
      <span>{dayjs(row.getValue('updatedAt')).format('DD/MM/YYYY')}</span>
    )
  },
  {
    accessorKey: 'memoryStatus',
    header: 'memory status',
    cell: ({ row }) => {
      const status = row.original.memories?.[0]?.status
      const variant = status
        ? {
            NOT_STARTED: 'outline',
            IN_PROGRESS: 'secondary',
            COMPLETED: 'default'
          }[status]
        : 'outline'

      return (
        <Badge
          variant={
            variant as 'default' | 'secondary' | 'destructive' | 'outline'
          }>
          {status || 'N/A'}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'memoryLevel',
    header: 'memory level',
    cell: ({ row }) => {
      const level = row.original.memories?.[0]?.level
      const variant = level
        ? {
            LEVEL_1: 'secondary',
            LEVEL_2: 'secondary',
            LEVEL_3: 'secondary',
            LEVEL_4: 'secondary',
            LEVEL_5: 'secondary',
            MASTERED: 'default'
          }[level]
        : 'outline'

      return (
        <Badge
          variant={
            variant as 'default' | 'secondary' | 'destructive' | 'outline'
          }>
          {level || 'N/A'}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'lastReviewedAt',
    header: 'last reviewed at',
    cell: ({ row }) => {
      return (
        <span>
          {row.original.memories?.[0]?.lastReviewedAt
            ? dayjs(row.original.memories?.[0]?.lastReviewedAt).format(
                'DD/MM/YYYY'
              )
            : 'N/A'}
        </span>
      )
    }
  },
  {
    accessorKey: 'nextReviewAt',
    header: 'next review at',
    cell: ({ row }) => {
      return (
        <span>
          {row.original.memories?.[0]?.nextReviewDate
            ? dayjs(row.original.memories?.[0]?.nextReviewDate).format(
                'DD/MM/YYYY'
              )
            : 'N/A'}
        </span>
      )
    }
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
    currentPage,
    refetchVocabularies
  } = useVocabularies({ size: 10, offset: 0 })

  const table = useReactTable({
    data: vocabularies || [],
    columns,
    manualPagination: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel()
  })

  const { batchReview } = useMemory()
  const { deleteVocabularies } = useVocabulary()

  const handleReviewVocabularies = async () => {
    const selectedRows = table.getSelectedRowModel().rows
    const memories = selectedRows.map((row) => row.original.memories?.[0])
    await batchReview(
      memories?.map((m) => ({
        memoryId: m?.id as number,
        remembered: true
      }))
    )
    await refetchVocabularies()
    table.toggleAllRowsSelected(false)
  }

  const handleDeleteVocabularies = async () => {
    const selectedRows = table.getSelectedRowModel().rows
    const ids = selectedRows.map((row) => row.original.id)
    await deleteVocabularies(ids)
    await refetchVocabularies()
    table.toggleAllRowsSelected(false)
  }

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

      <div className="mb-4 flex items-center gap-2 justify-end">
        <Button
          variant="default"
          size="sm"
          onClick={handleReviewVocabularies}
          disabled={table.getSelectedRowModel().rows.length === 0}>
          Review Selected
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteVocabularies}
          disabled={table.getSelectedRowModel().rows.length === 0}>
          Delete Selected
        </Button>
        <div className="ml-2 text-sm text-muted-foreground">
          {table.getSelectedRowModel().rows.length} row(s) selected
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
