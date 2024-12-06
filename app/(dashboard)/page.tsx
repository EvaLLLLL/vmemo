'use client'

import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Clock, BookOpen, LucideIcon, TrendingUp, Flame } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { MemoriesOverview } from '@/components/memories-overview'

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

const WelcomeSection = () => {
  const { user } = useAuth()
  const timeOfDay = getTimeOfDay()

  const todayProgress = 65
  const streak = 7
  const wordsCount = 128
  const studyHours = 2.5

  return (
    <div className="w-full space-y-4">
      <h1
        suppressHydrationWarning
        className="text-3xl font-bold tracking-tight">
        Good {timeOfDay}, {user?.name || 'Guest'}!
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Progress"
          value={`${todayProgress}%`}
          icon={TrendingUp}
        />
        <StatCard title="Study Streak" value={`${streak} days`} icon={Flame} />
        <StatCard title="Words Learned" value={wordsCount} icon={BookOpen} />
        <StatCard title="Study Time" value={`${studyHours}h`} icon={Clock} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const data = [
    {
      title: 'Dictionary',
      href: '/dictionary',
      description:
        'Quickly look up definitions and meanings as you read. Understand every word with ease and never miss a context.'
    },
    {
      title: 'Reading',
      href: '/reading',
      description:
        ' Enjoy a seamless reading experience with built-in tools to support learning, from word lookup to vocabulary tracking.'
    },
    {
      title: 'Flashcard',
      href: '/flashcards',
      description:
        'Master new words using our interactive flashcard system, designed for effective memorization and retention.'
    },
    {
      title: 'Vocabulary List',
      href: '/vocabulary',
      description:
        'Keep track of all the words you’ve learned in one place. Organize, review, and reinforce your vocabulary anytime.'
    }
  ]

  return (
    <div className="flex size-full flex-col items-center gap-y-8 overflow-y-auto px-16 py-12 md:px-32 md:py-8">
      <WelcomeSection />
      <MemoriesOverview />

      <div className="grid w-full grid-cols-2 gap-4">
        {data.map((d, idx) => (
          <Link key={idx} href={d.href}>
            <Alert className="w-full cursor-pointer shadow hover:bg-chart-2 hover:shadow-xl">
              <AlertTitle>{d.title}</AlertTitle>
              <AlertDescription>{d.description}</AlertDescription>
            </Alert>
          </Link>
        ))}
      </div>
    </div>
  )
}
