import { useCallback, useEffect, useState } from 'react'
import { useDragControls, motion, AnimatePresence, PanInfo } from 'motion/react'
import { cn } from '@/lib/utils'
import { Skeleton } from './ui/skeleton'

export interface FlashCard {
  id: number
  front?: string
  back?: string
}

interface FlashCardsProps {
  cards: FlashCard[]
  onComplete?: () => void
  onFlip?: (card: FlashCard) => Promise<string>
  onSwipeLeft?: (card: FlashCard) => Promise<void>
  onSwipeRight?: (card: FlashCard) => Promise<void>
}

export default function FlashCards({
  cards,
  onComplete,
  onFlip,
  onSwipeLeft,
  onSwipeRight
}: FlashCardsProps) {
  const [currentCards, setCurrentCards] = useState(cards)
  const [flipped, setFlipped] = useState(false)
  const dragControls = useDragControls()
  const [isLoading, setIsLoading] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [keyColor, setKeyColor] = useState<'pink' | 'green' | null>(null)

  const handleFlip = useCallback(async () => {
    if (!flipped && currentCards[0] && !currentCards[0].back) {
      setIsLoading(true)
      try {
        const backContent = await onFlip?.(currentCards[0])
        setCurrentCards((prevCards: FlashCard[]) => {
          const [first, ...rest] = prevCards
          return [{ ...first, back: backContent }, ...rest]
        })
      } catch (error) {
        console.error('Error flipping card:', error)
      } finally {
        setIsLoading(false)
      }
    }
    setFlipped(!flipped)
  }, [onFlip, currentCards, flipped])

  const moveCard = useCallback(() => {
    if (currentCards.length === 1) {
      onComplete?.()
    }

    setFlipped(false)

    setCurrentCards((cards) => {
      return [...cards.slice(1)]
    })
  }, [currentCards.length, onComplete])

  const handleDrag = (_: DragEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
      setDragX(info.offset.x)
    }
  }

  const handleDragEnd = async (_: DragEvent, info: PanInfo) => {
    const threshold = 100
    const currentCard = currentCards[0]
    setDragX(0)

    if (
      Math.abs(info.offset.x) > threshold &&
      Math.abs(info.offset.x) > Math.abs(info.offset.y)
    ) {
      try {
        if (info.offset.x > 0) {
          await onSwipeRight?.(currentCard)
        } else {
          await onSwipeLeft?.(currentCard)
        }
        moveCard()
      } catch (error) {
        console.error('Error handling swipe:', error)
        return
      }
    }
  }

  const handleClick = useCallback(() => {
    if (Math.abs(dragX) < 10) {
      handleFlip()
    }
  }, [dragX, handleFlip])

  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (currentCards.length === 0) return
      const currentCard = currentCards[0]

      switch (e.key.toLowerCase()) {
        case 'q':
          try {
            setKeyColor('green')
            await onSwipeLeft?.(currentCard)
            moveCard()
          } finally {
            setTimeout(() => setKeyColor(null), 200)
          }
          break
        case 'e':
          try {
            setKeyColor('pink')
            await onSwipeRight?.(currentCard)
            moveCard()
          } finally {
            setTimeout(() => setKeyColor(null), 200)
          }
          break
        case 'w':
          handleFlip()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentCards, handleFlip, moveCard, onSwipeLeft, onSwipeRight])

  const getRandomOffset = (index: number) => ({
    x: index === 0 ? 0 : Math.random() * 50 - 4,
    y: index * 8 + (Math.random() * 4 - 2),
    rotate: index === 0 ? 0 : Math.random() * 10 - 3
  })

  return (
    <div className="relative mx-auto aspect-[3/4] w-[300px] [perspective:1000px]">
      <AnimatePresence mode="popLayout">
        {currentCards.map((card, index) => {
          const offset = getRandomOffset(index)

          return (
            <motion.div
              key={card.front}
              onClick={() => index === 0 && handleClick()}
              dragControls={dragControls}
              drag={index === 0}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.6}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              initial={{ scale: 1, y: 0, zIndex: currentCards.length - index }}
              animate={{
                scale: 1 - index * 0.05,
                y: offset.y,
                x: offset.x,
                zIndex: currentCards.length - index,
                rotateY: index === 0 ? (flipped ? 180 : 0) : 0,
                rotateZ: offset.rotate,
                backgroundColor:
                  index === 0
                    ? keyColor === 'pink'
                      ? 'rgba(255, 192, 203, 0.3)'
                      : keyColor === 'green'
                        ? 'rgba(144, 238, 144, 0.3)'
                        : dragX > 0
                          ? 'rgba(255, 192, 203, 0.3)'
                          : dragX < 0
                            ? 'rgba(144, 238, 144, 0.3)'
                            : undefined
                    : undefined
              }}
              exit={{
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200,
                opacity: 0,
                scale: 0.6
              }}
              transition={{
                duration: 0.3,
                flip: { duration: 0.5 }
              }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                filter: `brightness(${1 - index * 0.05})`
              }}
              className={cn(
                'absolute left-0 top-0 border bg-accent overflow-hidden text-popover-foreground h-full w-full cursor-grab rounded-xl active:cursor-grabbing',
                {
                  'shadow-lg': index === 0,
                  'shadow-sm': index !== 0,
                  'border-accent': index === 0,
                  'border-border/50': index !== 0
                }
              )}>
              <div
                style={{
                  transform:
                    flipped && index === 0 ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
                className="absolute flex size-full items-center justify-center text-xl">
                {isLoading && index === 0 ? (
                  <Skeleton className="absolute left-0 top-0 size-full bg-accent/10" />
                ) : flipped && index === 0 ? (
                  card.back
                ) : (
                  card.front
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
