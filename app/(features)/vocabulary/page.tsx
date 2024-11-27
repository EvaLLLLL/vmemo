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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useVocabularies } from '@/hooks/useVocabularies'
import { TVocabulary } from '@/types/vocabulary'
import { LevelStar } from '@/components/LevelStar'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'

const columns: ColumnDef<TVocabulary>[] = [
  {
    accessorKey: 'id',
    header: 'id',
    cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>
  },
  {
    accessorKey: 'origin',
    header: 'word',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('origin')}</div>
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
    accessorKey: 'level',
    header: 'level',
    cell: ({ row }) => <LevelStar level={row.getValue('level')} />
  },
  {
    accessorKey: 'createdAt',
    header: 'saved at',
    cell: ({ row }) => (
      <div>{dayjs(row.getValue('createdAt')).format('DD/MM/YYYY')}</div>
    )
  },
  {
    accessorKey: 'updatedAt',
    header: 'updated at',
    cell: ({ row }) => (
      <div>{dayjs(row.getValue('updatedAt')).format('DD/MM/YYYY')}</div>
    )
  }
]

export default function Vocabulary() {
  const {
    vocabularies,
    pageCount,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    pagination,
    setPagination,
    counts
  } = useVocabularies({ level: -2, pageIndex: 1, size: 10 })

  const table = useReactTable({
    data: vocabularies || [],
    columns,
    pageCount,
    manualPagination: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel()
  })

  const handleTabTrigger = (level: number) => {
    setPagination({
      ...pagination,
      level,
      pageIndex: 1
    })
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" onClick={() => handleTabTrigger(-2)}>
            All({counts?.totalCount})
          </TabsTrigger>
          <TabsTrigger value="level0" onClick={() => handleTabTrigger(0)}>
            <LevelStar level={0} /> ({counts?.level0Count})
          </TabsTrigger>
          <TabsTrigger value="level1" onClick={() => handleTabTrigger(1)}>
            <LevelStar level={1} /> ({counts?.level1Count})
          </TabsTrigger>
          <TabsTrigger value="level2" onClick={() => handleTabTrigger(2)}>
            <LevelStar level={2} /> ({counts?.level2Count})
          </TabsTrigger>
          <TabsTrigger value="level3" onClick={() => handleTabTrigger(3)}>
            <LevelStar level={3} /> ({counts?.level3Count})
          </TabsTrigger>
        </TabsList>
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
            Page {pagination.pageIndex} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden size-8 p-0 lg:flex"
              onClick={() => setPagination({ ...pagination, pageIndex: 1 })}
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
              onClick={() =>
                setPagination({ ...pagination, pageIndex: pageCount || 1 })
              }
              disabled={!hasNextPage}>
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
