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
import prisma from '@/lib/prisma'
import dayjs from 'dayjs'
import { MemoryStatus } from '@prisma/client'
import { checkAuth } from './api/(routes)/auth/check'
import { auth } from '@/lib/next-auth'

export default async function Dashboard() {
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

const getTimeOfDay = () => {
  const hour = new Date().getHours()
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

async function getStatistics(userId: string) {
  const allMemories = await prisma.memory.findMany({
    where: { userId }
  })

  const dueReviews = await prisma.memory.findMany({
    where: {
      userId,
      nextReviewDate: {
        lte: new Date()
      }
    }
  })

  // Calculate today's progress
  const totalDueToday = dueReviews.length
  const completedToday = totalDueToday - dueReviews.length
  const todayProgress = totalDueToday
    ? (completedToday / totalDueToday) * 100
    : 0

  // Calculate streak
  const reviewDates = allMemories
    .filter((memory) => memory.lastReviewedAt)
    .map((memory) => dayjs(memory.lastReviewedAt).format('YYYY-MM-DD'))
    .sort()
    .reverse()

  let streak = 0
  let currentDate = dayjs()

  while (reviewDates.includes(currentDate.format('YYYY-MM-DD'))) {
    streak++
    currentDate = currentDate.subtract(1, 'day')
  }

  // Calculate total words learned
  const wordsCount = allMemories.filter(
    (memory) => memory.status !== MemoryStatus.NOT_STARTED
  ).length

  // Estimate study hours
  const studyHours = allMemories.reduce((total, memory) => {
    return total + ((memory.reviewCount || 0) * 2) / 60
  }, 0)

  return {
    todayProgress: Math.round(todayProgress),
    streak,
    wordsCount,
    studyHours: Number(studyHours.toFixed(1))
  }
}

const WelcomeSection = async () => {
  const timeOfDay = getTimeOfDay()
  const user = await checkAuth()
  const session = await auth()

  if (!user) {
    return (
      <div className="w-full space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Guest!</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Today's Progress" value="0%" icon={TrendingUp} />
          <StatCard title="Study Streak" value="0 days" icon={Flame} />
          <StatCard title="Words Learned" value={0} icon={BookOpen} />
          <StatCard title="Study Time" value="0h" icon={Clock} />
        </div>
      </div>
    )
  }

  const stats = await getStatistics(user.id)

  return (
    <div className="w-full space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">
        Good {timeOfDay}, {session?.user?.name || 'Guest'}!
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Progress"
          value={`${stats.todayProgress}%`}
          icon={TrendingUp}
        />
        <StatCard
          title="Study Streak"
          value={`${stats.streak} days`}
          icon={Flame}
        />
        <StatCard
          title="Words Learned"
          value={stats.wordsCount}
          icon={BookOpen}
        />
        <StatCard
          title="Study Time"
          value={`${stats.studyHours}h`}
          icon={Clock}
        />
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
      <div className="text-left">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Button>
  </Link>
)
