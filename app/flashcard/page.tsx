'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { useMemory } from '@/hooks/useMemory'
import { useVocabularies } from '@/hooks/useVocabularies'
import { TVocabulary } from '@/types/vocabulary'
import { useCallback, useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LevelStar } from '@/components/LevelStar'
import { ProgressLine } from '@/components/ui/progress'
import { getLevelColor } from '@/lib/utils'

export default function Flashcard() {
  const { vocabularies, counts } = useVocabularies()
  const {
    submit,
    currrentVocabulary,
    isSummary,
    remember,
    forget,
    isSubmiting
  } = useMemory()

  const onRemember = useCallback(
    () => !isSubmiting && remember(),
    [isSubmiting, remember]
  )
  const onForget = useCallback(
    () => !isSubmiting && forget(),
    [forget, isSubmiting]
  )
  const onSubmit = useCallback(
    () => !isSubmiting && submit(),
    [submit, isSubmiting]
  )

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (isSubmiting) return

      if (e.code === 'Space') {
        onSubmit()
      }
    }

    window.addEventListener('keydown', keyDownHandler)

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [isSubmiting, onSubmit])

  return (
    <div className="flex h-full flex-col items-center gap-y-8 bg-slate-200 pt-4 md:pt-20">
      <div className="w-full px-24">
        <ProgressLine
          label={`Word Memorization Progress (total: ${counts?.totalCount})`}
          visualParts={[
            {
              label: counts?.level3Count || 0,
              percentage: `${counts?.level3Count || 0 / (counts?.totalCount || 0)}%`,
              color: getLevelColor(3),
              tooltip: (
                <div className="flex items-center justify-center gap-x-2 text-gray-500">
                  {counts?.level3Count}
                  <LevelStar level={3} />
                </div>
              )
            },
            {
              label: counts?.level2Count || 0,
              percentage: `${counts?.level2Count || 0 / (counts?.totalCount || 0)}%`,
              color: getLevelColor(2),
              tooltip: (
                <div className="flex items-center justify-center gap-x-2 text-gray-500">
                  {counts?.level2Count}
                  <LevelStar level={2} />
                </div>
              )
            },
            {
              label: counts?.level1Count || 0,
              percentage: `${counts?.level1Count || 0 / (counts?.totalCount || 0)}%`,
              color: getLevelColor(1),
              tooltip: (
                <div className="flex items-center justify-center gap-x-2 text-gray-500">
                  {counts?.level1Count}
                  <LevelStar level={1} />
                </div>
              )
            },
            {
              label: counts?.level0Count || 0,
              percentage: `${counts?.level0Count || 0 / (counts?.totalCount || 0)}%`,
              color: getLevelColor(0),
              tooltip: (
                <div className="flex items-center justify-center gap-x-2 text-gray-500">
                  {counts?.level0Count}
                  <LevelStar level={0} />
                </div>
              )
            }
          ]}
        />
      </div>
      <Carousel className="flex items-center justify-center gap-x-10">
        {!isSummary && (
          <div className="max-w-xs">
            <CarouselContent>
              {vocabularies?.map((v) => (
                <VocabularyItem
                  key={v.id}
                  vocabulary={v}
                  isCurrent={currrentVocabulary?.id === v.id}
                />
              ))}
            </CarouselContent>
            <CarouselActionButton
              onForget={onForget}
              onSubmit={onSubmit}
              onRemember={onRemember}
              isSubmiting={isSubmiting}
            />
          </div>
        )}
        <div className="flex flex-col gap-y-4">
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-2">
              {vocabularies?.map((v) => (
                <ListItem
                  key={v.id}
                  vocabulary={v}
                  showTranslation={isSummary}
                />
              ))}
            </div>
          </div>
          {isSummary && (
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={onSubmit}>
              下一组（Space）
            </Button>
          )}
        </div>
      </Carousel>
    </div>
  )
}

const ListItem: React.FC<{
  vocabulary: TVocabulary
  showTranslation: boolean
}> = ({ vocabulary, showTranslation }) => {
  return (
    <Alert key={vocabulary.id} className="min-w-56 max-w-80">
      <AlertTitle className="flex items-center justify-between">
        {vocabulary.origin}
        <LevelStar level={vocabulary.level} />
      </AlertTitle>
      {showTranslation && (
        <AlertDescription className="line-clamp-2">
          {vocabulary.translation}
        </AlertDescription>
      )}
    </Alert>
  )
}

const CarouselActionButton: React.FC<{
  isSubmiting: boolean
  onSubmit: () => void
  onRemember: () => void
  onForget: () => void
}> = ({ isSubmiting, onRemember, onForget, onSubmit }) => {
  const { scrollNext } = useCarousel()

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (isSubmiting) return

      if (e.code === 'KeyQ') {
        onRemember()
        scrollNext()
      }

      if (e.code === 'KeyE') {
        onForget()
        scrollNext()
      }
    }

    window.addEventListener('keydown', keyDownHandler)

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [isSubmiting, onForget, onRemember, onSubmit, scrollNext])

  return (
    <div className="mt-2 grid grid-cols-2 gap-x-4">
      <Button
        variant="outline"
        onClick={() => {
          onRemember()
          scrollNext()
        }}>
        记住了（Q）
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          onForget()
          scrollNext()
        }}>
        忘记了（E）
      </Button>
    </div>
  )
}

const VocabularyItem: React.FC<{
  isCurrent: boolean
  vocabulary: TVocabulary
}> = ({ vocabulary, isCurrent }) => {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (revealed || !isCurrent) return

      if (e.code === 'KeyW') {
        setRevealed(true)
      }
    }

    window.addEventListener('keydown', keyDownHandler)

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [isCurrent, revealed])

  return (
    <CarouselItem>
      <div className="p-1">
        <Card onClick={() => !revealed && isCurrent && setRevealed(true)}>
          <CardContent className="relative flex aspect-square flex-col items-center justify-center gap-y-4 p-6">
            <div className="absolute top-4">
              <LevelStar level={vocabulary.level} />
            </div>
            <span className="text-4xl font-semibold">{vocabulary.origin}</span>
            <CardDescription className="text-center">
              {revealed ? vocabulary.translation : 'press W to reveal'}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  )
}
