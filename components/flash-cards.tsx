import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import {
  useDragControls,
  motion,
  AnimatePresence,
  PanInfo
} from 'framer-motion'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { FlipIcon, LeftIcon, RightIcon } from '@/icons'

/**
 * dueReviews refetch passes new `cards[]` without `back`. Keep the user's stack aligned
 * and re-attach `back` by id so the flipped side does not disappear.
 */
function alignCardsPreserveBack(
  next: FlashCard[],
  prev: FlashCard[]
): FlashCard[] {
  if (prev.length === 0) return [...next]

  const backById = new Map<number, ReactNode>()
  for (const c of prev) {
    if (c.back !== undefined && c.back !== null) {
      backById.set(c.id, c.back)
    }
  }

  const anchor = next.findIndex((c) => c.id === prev[0].id)
  if (anchor < 0) {
    return next.map((c) => ({
      ...c,
      back: prev.find((p) => p.id === c.id)?.back ?? backById.get(c.id)
    }))
  }

  const aligned = next.slice(anchor, anchor + prev.length)

  const stackMatches =
    aligned.length === prev.length &&
    aligned.every((c, i) => c.id === prev[i]?.id)

  if (stackMatches) {
    return aligned.map((c, i) => ({
      ...c,
      back: prev[i].back ?? backById.get(c.id)
    }))
  }

  return next.map((c) => ({
    ...c,
    back: prev.find((p) => p.id === c.id)?.back ?? backById.get(c.id)
  }))
}

export interface FlashCard {
  id: number
  front?: ReactNode
  back?: ReactNode
}

interface FlashCardsProps {
  cards: FlashCard[]
  onComplete?: () => Promise<void>
  onFlip?: (card: { id: number; front?: ReactNode }) => Promise<ReactNode>
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
  const flippedRef = useRef(false)

  flippedRef.current = flipped

  const cardsRef = useRef(currentCards)
  cardsRef.current = currentCards

  const handleFlip = useCallback(async () => {
    const stack = cardsRef.current
    if (!stack.length) return

    const top = stack[0]

    if (flippedRef.current) {
      setFlipped(false)
      return
    }

    setIsLoading(true)
    try {
      if (!onFlip) {
        setFlipped(true)
        return
      }

      let backContent: ReactNode = null

      try {
        backContent = await onFlip(top)
      } catch (e) {
        console.error('Error loading card back:', e)
      }

      if (backContent == null) {
        backContent = (
          <div className="flex flex-col gap-3 p-4 text-center text-sm text-muted-foreground">
            <p>Unable to load details for this card.</p>
            <p className="text-xs">Tap again after a moment.</p>
          </div>
        )
      }

      setCurrentCards((prev) => {
        if (!prev.length || prev[0].id !== top.id) return prev
        const merged = [...prev]
        merged[0] = { ...merged[0], back: backContent }
        return merged
      })
      setFlipped(true)
    } finally {
      setIsLoading(false)
    }
  }, [onFlip])

  const moveCard = useCallback(async () => {
    if (currentCards.length === 1) {
      await onComplete?.()
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
          await onSwipeLeft?.(currentCard)
          moveCard()
          break
        case 'e':
          await onSwipeRight?.(currentCard)
          moveCard()
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

  useEffect(() => {
    setCurrentCards((prev) => alignCardsPreserveBack(cards, prev))
  }, [cards])

  return (
    <div className="relative">
      <div className="relative mx-auto aspect-[3/4] w-[300px] [perspective:1000px]">
        <AnimatePresence mode="popLayout">
          {currentCards.map((card, index) => {
            const offset = getRandomOffset(index)
            const isBackFace = flipped && index === 0

            return (
              <motion.div
                key={card.id}
                onClick={() => index === 0 && handleClick()}
                dragControls={dragControls}
                drag={index === 0}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.6}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                initial={{
                  scale: 1,
                  y: 0,
                  zIndex: currentCards.length - index
                }}
                animate={{
                  scale: 1 - index * 0.05,
                  y: offset.y,
                  x: offset.x,
                  zIndex: currentCards.length - index,
                  rotateZ: offset.rotate
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
                  className={cn(
                    'absolute inset-0 flex size-full flex-col p-4 text-xl [transform-style:flat]',
                    isBackFace
                      ? 'items-stretch overflow-y-auto text-left'
                      : 'items-center justify-center overflow-hidden text-center'
                  )}>
                  {isLoading && index === 0 ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl backdrop-blur-[2px]">
                      <Loader2
                        className="size-8 animate-spin text-primary"
                        aria-hidden
                      />
                      <p className="text-xs font-medium text-muted-foreground">
                        Loading definitions…
                      </p>
                    </div>
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
      {currentCards.length > 0 && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-1.5 py-0.5">Q</kbd>
              <span>Swipe Left - Don&apos;t Remember</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-1.5 py-0.5">W</kbd>
              <span>Flip Card</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-1.5 py-0.5">E</kbd>
              <span>Swipe Right - Remember</span>
            </span>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={async () => {
                if (currentCards[0]) {
                  if (!flipped) {
                    await handleFlip()
                  }
                  await onSwipeLeft?.(currentCards[0])
                  moveCard()
                }
              }}
              className="rounded-full bg-red-500 p-3 text-white shadow-md hover:bg-red-600"
              aria-label="Swipe Left">
              <LeftIcon />
            </button>
            <button
              onClick={handleFlip}
              className="rounded-full bg-blue-500 p-3 text-white shadow-md hover:bg-blue-600"
              aria-label="Flip Card">
              <FlipIcon />
            </button>
            <button
              onClick={async () => {
                if (currentCards[0]) {
                  if (!flipped) {
                    await handleFlip()
                  }
                  await onSwipeRight?.(currentCards[0])
                  moveCard()
                }
              }}
              className="rounded-full bg-green-500 p-3 text-white shadow-md hover:bg-green-600"
              aria-label="Swipe Right">
              <RightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
