'use client'

import * as React from 'react'
import dayjs from 'dayjs'
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
import { useMemo } from 'react'
import { useMemory } from '@/hooks/use-memory'

export const MemoriesOverview: React.FC = () => {
  return <ActivityChart />
}

const chartConfig = {
  views: {
    label: 'Word Count'
  }
} satisfies ChartConfig

export function ActivityChart() {
  const { allMemories } = useMemory()

  const chartData = useMemo(() => {
    if (!allMemories?.length) return []

    // Create an array of the last 30 days
    const dates = Array.from({ length: 30 }, (_, i) => {
      return dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    }).reverse()

    // Count memories for each date
    const dateCountMap = dates.reduce(
      (acc, date) => {
        const count = allMemories.filter(
          (memory) =>
            dayjs(memory.createdAt).format('YYYY-MM-DD') === date ||
            dayjs(memory.updatedAt).format('YYYY-MM-DD') === date
        ).length

        acc.push({
          date,
          count
        })
        return acc
      },
      [] as { date: string; count: number }[]
    )

    return dateCountMap
  }, [allMemories])

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
        {chartData.length === 0 ? (
          <div className="flex h-[250px] flex-col items-center justify-center gap-2 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              No data yet
            </p>
            <p className="text-sm text-muted-foreground">
              Start saving and memorizing words to see your progress here!
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full">
            <BarChart
              data={chartData}
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
        )}
      </CardContent>
    </Card>
  )
}
