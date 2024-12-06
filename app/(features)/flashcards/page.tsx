'use client'

import FlashCards, { FlashCard } from '@/components/flash-cards'
import { useDueReviews, useMemory } from '@/hooks/use-memory'
import { DictServices } from '@/lib/services'
import { IBaiduDict } from '@/types/dict'
import { useQueryClient } from '@tanstack/react-query'

export default function Flashcards() {
  const { reviewMemory } = useMemory()
  const { dueReviews, fetchNextPage, hasNextPage } = useDueReviews()
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

  const onComplete = async () => {
    if (!hasNextPage) {
      console.log('complete')
      return
    }

    await fetchNextPage()
  }

  const onFlip = async (c: FlashCard) => {
    if (!c.front) return ''

    const cachedData = queryClient.getQueryData<IBaiduDict>([
      DictServices.translate.key,
      c.front
    ])

    if (cachedData) return cachedData.dst || ''

    const dictResult = await DictServices.translate.fn(c.front)

    queryClient.setQueryData([DictServices.translate.key, c.front], dictResult)

    return dictResult?.data?.dst || ''
  }

  if (!cards.length) return null

  return (
    <FlashCards
      cards={cards}
      onFlip={onFlip}
      onComplete={onComplete}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
    />
  )
}
