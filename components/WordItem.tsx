import { TVocabulary } from '@/types/vocabulary'
import { useEffect, useRef, MouseEvent } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { HeadphonesIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const WordItem: React.FC<{
  word: TVocabulary
  isSelected?: boolean
  onClick?: () => void
  onDelete?: () => void
}> = ({ word, isSelected, onDelete, onClick }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const onClickSound = () => {
    if (onClick) {
      onClick()
      return
    }

    if (!word.audio) return
    const audioPlayer = new Audio(word.audio)
    audioPlayer.play()
  }

  const onClickDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation()
    onDelete?.()
  }

  useEffect(() => {
    if (isSelected) {
      ref?.current?.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [isSelected])

  return (
    <Alert ref={ref}>
      <AlertTitle>{word.origin}</AlertTitle>
      <AlertDescription>{word.translation}</AlertDescription>

      <div className="absolute right-4 top-4">
        <Button variant="ghost" size="icon" onClick={onClickSound}>
          <HeadphonesIcon />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClickDelete}>
          <XIcon />
        </Button>
      </div>
    </Alert>
  )
}
