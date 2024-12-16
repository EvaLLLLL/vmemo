'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Clock,
  BookOpen,
  LucideIcon,
  TrendingUp,
  Flame,
  Book,
  Brain,
  History
} from 'lucide-react'
import { MemoriesOverview } from '@/components/memories-overview'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useStatistic } from '@/hooks/use-statistic'

export default function Dashboard() {
  return (
    <div className="flex size-full flex-col items-center gap-y-8 overflow-y-auto px-16 py-12 md:px-32 md:py-8">
      <WelcomeSection />
      <QuickStart />
      <MemoriesOverview />
    </div>
  )
}

const StatCard = ({
  title,
  value,
  icon: Icon
}: {
  title: string
  value: number | string
  icon: LucideIcon
}) => (
  <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow">
    <div className="rounded-full bg-primary/10 p-3">
      <Icon className="size-6 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
)

const getTimeOfDay = (hour: number) => {
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

const QuickStart = () => {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-semibold">Quick Start</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard
          icon={Brain}
          title="Review Due"
          description="Review words scheduled for today"
          href="/flashcards"
        />
        <QuickActionCard
          icon={BookOpen}
          title="Continue Reading"
          description="Pick up where you left off"
          href="/reading"
        />
        <QuickActionCard
          icon={Book}
          title="Dictionary"
          description="Look up new words"
          href="/dictionary"
        />
        <QuickActionCard
          icon={History}
          title="Recent Words"
          description="Review recently learned words"
          href="/vocabulary"
        />
      </div>
    </div>
  )
}

const WelcomeSection = () => {
  const { data: session } = useSession()
  const { todayProgress, streak, wordsCount, studyHours } = useStatistic()
  const [timeOfDay, setTimeOfDay] = useState('morning')

  const user = session?.user

  useEffect(() => {
    const hour = new Date().getHours()
    setTimeOfDay(getTimeOfDay(hour))
  }, [])

  return (
    <div className="w-full space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">
        Good {timeOfDay}, {user?.name}!
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Progress"
          value={`${todayProgress}%`}
          icon={TrendingUp}
        />
        <StatCard title="Study Streak" value={`${streak} days`} icon={Flame} />
        <StatCard
          title="Words Learned"
          value={wordsCount || 0}
          icon={BookOpen}
        />
        <StatCard title="Study Time" value={`${studyHours}h`} icon={Clock} />
      </div>
    </div>
  )
}

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  href
}: {
  icon: LucideIcon
  title: string
  description: string
  href: string
}) => (
  <Link href={href}>
    <Button
      variant="outline"
      className="flex h-auto w-full flex-col items-start gap-2 p-6 hover:bg-accent">
      <Icon className="size-6 text-primary" />
      <div className="w-full text-left">
        <h3 className="font-semibold">{title}</h3>
        <p className="w-full truncate text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </Button>
  </Link>
)
