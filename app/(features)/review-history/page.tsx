'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useReviewSessions } from '@/hooks/use-memory'
import { Badge } from '@/components/ui/badge'

export default function ReviewHistory() {
  const { sessions, isLoading } = useReviewSessions()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!sessions?.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8">
        <p className="text-sm text-muted-foreground">No review sessions yet.</p>
        <p className="text-sm text-muted-foreground">
          Complete a flashcard session to see your history here.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Review History</h2>
        <p className="text-muted-foreground">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => {
          const correct = session.items.filter((i) => i.isCorrect).length
          const total = session.items.length
          const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
          const isExpanded = expandedId === session.id

          return (
            <div
              key={session.id}
              className="rounded-lg border bg-card shadow-sm">
              <button
                onClick={() => setExpandedId(isExpanded ? null : session.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {dayjs(session.startedAt).format('MMM D, YYYY · HH:mm')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {total} card{total !== 1 ? 's' : ''} reviewed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {correct}/{total}
                  </span>
                  <Badge
                    variant={
                      accuracy >= 80
                        ? 'default'
                        : accuracy >= 50
                          ? 'secondary'
                          : 'destructive'
                    }>
                    {accuracy}%
                  </Badge>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <div className="border-t px-4 py-3">
                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                        {session.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm">
                            <div>
                              <span className="font-medium">
                                {item.vocabulary.word}
                              </span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {item.vocabulary.translation}
                              </span>
                            </div>
                            <Badge
                              variant={
                                item.isCorrect ? 'default' : 'destructive'
                              }
                              className="ml-2 shrink-0 text-xs">
                              {item.isCorrect ? 'correct' : 'wrong'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
