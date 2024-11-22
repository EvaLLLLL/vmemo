'use client'

import { TrendingUp } from 'lucide-react'
import { PolarGrid, RadialBar, RadialBarChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { LevelStar } from './LevelStar'
const chartData = [
  { level: 'level0', count: 275, fill: 'var(--color-level0)' },
  { level: 'level1', count: 200, fill: 'var(--color-level1)' },
  { level: 'level2', count: 187, fill: 'var(--color-level2)' },
  { level: 'level3', count: 173, fill: 'var(--color-level3)' },
  { level: 'levelL', count: 90, fill: 'var(--color-levelL)' }
]

const chartConfig = {
  counts: {
    label: 'counts'
  },
  level0: {
    label: <LevelStar level={0} />,
    color: 'hsl(var(--chart-1))'
  },
  level1: {
    label: <LevelStar level={1} />,
    color: 'hsl(var(--chart-2))'
  },
  level2: {
    label: <LevelStar level={2} />,
    color: 'hsl(var(--chart-3))'
  },
  level3: {
    label: <LevelStar level={3} />,
    color: 'hsl(var(--chart-4))'
  },
  levelL: {
    label: 'other',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig

export function Overview() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Grid</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={100}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="level" />}
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="count" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
