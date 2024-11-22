'use client'

import Link from 'next/link'
import { Overview } from '@/components/Overview'
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
      title: 'View Vocabulary List',
      href: '/vocabulary',
      description:
        'Keep track of all the words you’ve learned in one place. Organize, review, and reinforce your vocabulary anytime.'
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center gap-y-8 overflow-y-auto bg-slate-200 p-12">
      <Overview />

      <div className="flex flex-col gap-y-4">
        {data.map((d, idx) => (
          <Link key={idx} href={d.href}>
            <Alert className="cursor-pointer shadow hover:bg-emerald-300 hover:shadow-xl">
              <AlertTitle>{d.title}</AlertTitle>
              <AlertDescription>{d.description}</AlertDescription>
            </Alert>
          </Link>
        ))}
      </div>
    </div>
  )
}
