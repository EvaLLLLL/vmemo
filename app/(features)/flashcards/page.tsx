'use client'

import FlashCards, { FlashCard } from '@/components/flash-cards'
import { useMemory } from '@/hooks/use-memory'
import { DictServices } from '@/lib/services'
import { IBaiduDict } from '@/types/dict'
import { useQueryClient } from '@tanstack/react-query'

export default function Flashcards() {
  const { dueReviews, reviewMemory } = useMemory()
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

  if (!cards.length) return null

  return (
    <FlashCards
      cards={cards}
      onComplete={() => {
        console.log('complete')
      }}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      onFlip={async (c) => {
        if (!c.front) return ''

        const cachedData = queryClient.getQueryData<IBaiduDict>([
          DictServices.translate.key,
          c.front
        ])

        if (cachedData) return cachedData.dst || ''

        const dictResult = await DictServices.translate.fn(c.front)

        queryClient.setQueryData(
          [DictServices.translate.key, c.front],
          dictResult
        )

        return dictResult?.data?.dst || ''
      }}
    />
  )
}
