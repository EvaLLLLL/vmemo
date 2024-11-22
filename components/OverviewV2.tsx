'use client'

import * as React from 'react'
import dayjs from 'dayjs'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

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
import { useMemoryList } from '@/hooks/useMemoryList'
import { useMemo } from 'react'
import groupBy from 'lodash/groupBy'
import { useVocabularies } from '@/hooks/useVocabularies'

export const Overview: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-x-4">
      <ActivityCart />
      <LevelChart />
    </div>
  )
}

const chartConfig = {
  views: {
    label: 'Word Count'
  },
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

export function ActivityCart() {
  const { memoryList } = useMemoryList()

  const chartData = useMemo(() => {
    const allDate = memoryList?.map((m) =>
      dayjs(m.updatedAt || m.updatedAt)
        .format('YYYY-MM-DD')
        .toString()
    )

    const grouped = groupBy(allDate)

    const m = Object.keys(grouped)
      .map((k) => ({
        date: k,
        count: grouped[k].length
      }))
      .sort((a, b) => (dayjs(a.date).isAfter(b.date) ? 1 : -1))

    return m
  }, [memoryList])

  return (
    <Card>
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
            <Bar dataKey="count" fill="hsl(var(--chart-5))" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const LevelChart: React.FC = () => {
  const { counts } = useVocabularies()

  const chartData = useMemo(
    () => [
      {
        level: 'level0',
        count: counts?.level0Count,
        fill: 'var(--color-level0)'
      },
      {
        level: 'level1',
        count: counts?.level1Count,
        fill: 'var(--color-level1)'
      },
      {
        level: 'level2',
        count: counts?.level2Count,
        fill: 'var(--color-level2)'
      },
      {
        level: 'level3',
        count: counts?.level3Count,
        fill: 'var(--color-level3)'
      },
      {
        level: 'levelL',
        count: counts?.levelLCount,
        fill: 'var(--color-levelL)'
      }
    ],
    [counts]
  )

  const chartConfig = {
    count: {
      label: 'count'
    },
    level0: {
      label: 'level0',
      color: 'hsl(var(--chart-1))'
    },
    level1: {
      label: 'level1',
      color: 'hsl(var(--chart-2))'
    },
    level2: {
      label: 'level2',
      color: 'hsl(var(--chart-3))'
    },
    level3: {
      label: 'level3',
      color: 'hsl(var(--chart-4))'
    },
    levelL: {
      label: 'Other',
      color: 'hsl(var(--chart-other))'
    }
  } satisfies ChartConfig

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Word Level Count</CardTitle>
        <CardDescription>Level Distribution of All Saved Words</CardDescription>
      </CardHeader>
      <CardContent className="pt-10">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0
            }}>
            <YAxis
              dataKey="level"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
