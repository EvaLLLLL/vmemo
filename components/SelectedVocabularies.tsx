import { useSelectedWordsStore } from '@/hooks/useSelectedWordsStore'
import { useVocabularyActions } from '@/hooks/useVocabularyActions'
import { useEffect, useMemo, useRef, MouseEvent } from 'react'
import { Button } from './ui/button'
import { HeadphonesIcon, Loader2, XIcon } from 'lucide-react'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { TVocabulary } from '@/types/vocabulary'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { cn } from '@/lib/utils'

export const SelectedVocabularies = () => {
  const {
    translatedWords,
    removeTranslatedWord,
    selectedWord,
    setSelectedWord,
    purgeTranslatedWords
  } = useSelectedWordsStore()
  const { saveWords, isSaving } = useVocabularyActions()
  const { isAutoSpeak, setIsAutoSpeak } = useSelectedWordsStore()

  const wordsCount = useMemo(
    () => translatedWords?.length ?? 0,
    [translatedWords]
  )

  const onSave = () => {
    if (!translatedWords?.length) return
    saveWords(translatedWords)
  }

  return (
    <div className="overflow-hidden px-8">
      <div className="flex h-full flex-col gap-y-4">
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" onClick={purgeTranslatedWords}>
            Clear
          </Button>
          <div className="flex items-center gap-x-2">
            <Switch
              id="auto-speak"
              checked={isAutoSpeak}
              onCheckedChange={(e) => {
                setIsAutoSpeak(e)
              }}
            />
            <Label
              htmlFor="airplane-mode"
              className={
                isAutoSpeak ? 'text-primary' : 'text-muted-foreground'
              }>
              Auto speak
            </Label>
          </div>
          {isSaving ? (
            <Button variant="outline" disabled>
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button variant="outline" onClick={onSave}>
              Save({wordsCount})
            </Button>
          )}
        </div>
        <div className="flex h-full flex-1 flex-col gap-2 overflow-y-auto pb-12">
          {translatedWords?.map((word, index) => (
            <WordItem
              key={`${word.origin}-${index}`}
              word={word}
              onClick={() => setSelectedWord(word?.origin)}
              isSelected={word.origin === selectedWord?.origin}
              onDelete={() => removeTranslatedWord(word?.origin)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const WordItem: React.FC<{
  word: TVocabulary
  isSelected?: boolean
  onClick?: () => void
  onDelete?: () => void
}> = ({ word, isSelected, onDelete, onClick }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const onClickSound = () => {
    if (onClick) {
      onClick()
    }

    const audioPlayer = new Audio(
      `https://dict.youdao.com/dictvoice?type=0&audio=${word.origin}`
    )
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
    <Alert
      ref={ref}
      className={cn('group', isSelected && 'border-primary')}
      onClick={onClick}>
      <AlertTitle>{word.origin}</AlertTitle>
      <AlertDescription>{word.translation}</AlertDescription>
      <div className="invisible absolute right-4 top-4 group-hover:visible">
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
