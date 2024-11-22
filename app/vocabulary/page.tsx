'use client'

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

export const columns: ColumnDef<TVocabulary>[] = [
  //   {
  //     id: 'select',
  //     header: '',
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false
  //   },
  {
    accessorKey: 'id',
    header: 'id',
    cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>
  },
  {
    accessorKey: 'origin',
    header: 'origin',
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
    cell: ({ row }) => <div className="capitalize">{row.getValue('level')}</div>
  }
]

export default function Vocabulary() {
  //   const [rowSelection, setRowSelection] = useState({})

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
    // onRowSelectionChange: setRowSelection,
    // state: {
    //   rowSelection
    // }
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
          {/* <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div> */}
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPreviousPage()}
              disabled={!hasPreviousPage}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage}>
              Next
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
