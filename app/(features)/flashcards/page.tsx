'use client'

import { useState } from 'react'
import FlashCards, { FlashCard } from '@/components/flash-cards'
import { useDueReviews, useMemory } from '@/hooks/use-memory'
import { DictServices } from '@/lib/services'
import { IBaiduDict } from '@/types/dict'
import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { formatDictResult } from '@/utils/dict'

export default function Flashcards() {
  const { reviewMemory } = useMemory()
  const { dueReviews, pagination } = useDueReviews()
  const queryClient = useQueryClient()

  const cards =
    dueReviews?.map((review) => ({
      id: review.id,
      front: review.vocabulary.word
    })) || []

  const onSwipeLeft = async (card: FlashCard) => {
    await reviewMemory({ memoryId: card.id, remembered: false })
  }

  const onSwipeRight = async (card: FlashCard) => {
    await reviewMemory({ memoryId: card.id, remembered: true })
  }

  const onFlip = async (c: FlashCard) => {
    if (!c.front) return null

    const cachedData = queryClient.getQueryData<IBaiduDict>([
      DictServices.translate.key,
      c.front
    ])

    let result = formatDictResult(cachedData)

    if (cachedData) {
      result = formatDictResult(cachedData)
    } else {
      const dictResult = await DictServices.translate.fn(c.front as string)

      queryClient.setQueryData(
        [DictServices.translate.key, c.front],
        dictResult
      )

      result = formatDictResult(dictResult?.data)
    }

    const { simpleMeans, derivatives, examples } = result

    return (
      <div className="flex flex-col gap-6 p-4">
        <div className="text-xl">{c.front}</div>

        {simpleMeans && (
          <div className="text-base font-medium text-foreground">
            {simpleMeans}
          </div>
        )}

        {examples && examples.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Examples
            </h3>
            <div className="space-y-3">
              {examples.map((e) => (
                <div key={e.pos} className="space-y-2">
                  <div className="text-sm leading-relaxed">
                    <span className="font-medium text-foreground">{e.pos}</span>
                    <span className="mx-2">·</span>
                    {e.tr_group[0].example[0]}
                  </div>
                  {e.tr_group[0].similar_word[0] && (
                    <div className="text-xs text-muted-foreground">
                      Similar: {e.tr_group[0].similar_word[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {derivatives && Object.keys(derivatives).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Derivatives
            </h3>
            <div className="text-sm text-foreground">
              {Object.values(derivatives).join(' · ')}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse overflow-auto p-4 !pt-2 sm:flex-row sm:p-12">
      <div className="mt-4 flex-1 sm:mt-0">
        <div className="mb-4 flex flex-col items-center gap-2 sm:mb-8 sm:gap-4">
          <h1 className="text-xl font-bold sm:text-3xl">Today&apos;s Review</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            You have{' '}
            <span className="font-semibold text-foreground">
              {pagination?.total || 0}
            </span>{' '}
            cards to review today
          </p>
        </div>

        {cards.length > 0 ? (
          <FlashCards
            cards={cards}
            onFlip={onFlip}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
          />
        ) : (
          <div className="my-auto flex h-1/3 flex-col items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">
              No cards to review today.
            </p>
            <p className="text-sm text-muted-foreground">
              Save some words to start reviewing!
            </p>
          </div>
        )}
      </div>

      <ReviewPlan />
    </div>
  )
}

const ReviewPlan = () => {
  const { pagination } = useDueReviews()
  const { allNotCompletedReviews } = useMemory()

  const [expandedDate, setExpandedDate] = useState<string | null>(null)
  const [isReviewPlanVisible, setIsReviewPlanVisible] = useState(true)

  return (
    <div
      className={cn(
        'w-full sm:w-[400px]',
        !isReviewPlanVisible && 'w-0 sm:w-0'
      )}>
      <AnimatePresence initial={false}>
        {isReviewPlanVisible && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full sm:w-auto">
            <div className="overflow-hidden rounded-lg border bg-card p-3 shadow-sm sm:mb-8 sm:w-[400px] sm:p-6">
              <div className="mb-2 flex items-center justify-between sm:mb-3">
                <h2 className="text-lg font-semibold sm:text-2xl">
                  Your Review Plan
                </h2>
                <button
                  onClick={() => setIsReviewPlanVisible(false)}
                  className="text-muted-foreground transition-colors hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:size-6">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <p className="mb-3 text-xs text-muted-foreground sm:mb-6 sm:text-sm">
                Today, you have{' '}
                <span className="font-medium text-foreground">
                  {pagination?.total || 0}
                </span>{' '}
                cards to review.
              </p>
              <div className="max-h-[200px] overflow-y-auto sm:max-h-[400px]">
                <ul className="space-y-1.5 sm:space-y-3">
                  {Object.entries(allNotCompletedReviews || {}).map(
                    ([date, reviews]) => (
                      <li key={date}>
                        <button
                          onClick={() =>
                            setExpandedDate(expandedDate === date ? null : date)
                          }
                          className="flex w-full items-center justify-between rounded-md bg-muted/50 px-2 py-1 hover:bg-muted/70 sm:px-4 sm:py-1.5">
                          <span className="text-[10px] font-medium sm:text-sm">
                            {date}
                          </span>
                          <span className="text-[10px] text-muted-foreground sm:text-sm">
                            {reviews.length} cards
                          </span>
                        </button>
                        <AnimatePresence>
                          {expandedDate === date && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-1 grid h-full max-h-[120px] grid-cols-1 gap-1 overflow-y-auto pl-2 sm:mt-1.5 sm:max-h-[300px] sm:gap-2 sm:pl-4">
                              {reviews.map((review) => (
                                <motion.li
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  exit={{ x: -20, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  key={review.id}
                                  className="rounded-md bg-background p-1 text-[10px] sm:p-2 sm:text-sm">
                                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                                    <span className="font-medium">
                                      {review.vocabulary.word}
                                    </span>
                                    <span className="text-[8px] text-muted-foreground/80 sm:text-xs">
                                      {review.vocabulary.translation}
                                    </span>
                                  </div>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isReviewPlanVisible && (
        <button
          onClick={() => setIsReviewPlanVisible(true)}
          className="fixed bottom-0 left-0 z-10 flex h-12 w-full items-center justify-center bg-accent/80 text-accent-foreground transition-colors hover:bg-accent sm:absolute sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:w-12">
          <div className="flex items-center gap-2 sm:flex-col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:size-5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-xs font-medium sm:[writing-mode:vertical-lr]">
              Review Plan
            </span>
          </div>
        </button>
      )}
    </div>
  )
}
