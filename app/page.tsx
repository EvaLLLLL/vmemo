'use client'

import Link from 'next/link'
import { Overview } from '@/components/OverviewV2'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
      href: '/flashcard',
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
      <Overview />

      <div className="flex w-full flex-col gap-y-4">
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
