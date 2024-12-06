'use client'

import * as React from 'react'
// import dayjs from 'dayjs'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
// import { useMemo } from 'react'
// import groupBy from 'lodash/groupBy'
// import { useMemory } from '@/hooks/use-memory'

export const MemoriesOverview: React.FC = () => {
  return <ActivityCart />
}

const chartConfig = {
  views: {
    label: 'Word Count'
  }
} satisfies ChartConfig

export function ActivityCart() {
  // const { allMemories } = useMemory()

  // const chartData = useMemo(() => {
  //   const allDate = allMemories?.map((m) =>
  //     dayjs(m.updatedAt || m.updatedAt)
  //       .format('YYYY-MM-DD')
  //       .toString()
  //   )

  //   const grouped = groupBy(allDate)

  //   const m = Object.keys(grouped)
  //     .map((k) => ({
  //       date: k,
  //       count: grouped[k].length
  //     }))
  //     .sort((a, b) => (dayjs(a.date).isAfter(b.date) ? 1 : -1))

  //   return m
  // }, [allMemories])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Number of Saved or Memorized Words Chart</CardTitle>
          <CardDescription>
            Display the Number of Words Saved or Memorized Each Day
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={[]}
            margin={{
              left: 12,
              right: 12
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  }}
                />
              }
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
