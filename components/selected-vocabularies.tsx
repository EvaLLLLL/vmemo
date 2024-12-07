import { useEffect, useMemo, useRef, MouseEvent } from 'react'
import { Button } from './ui/button'
import { HeadphonesIcon, Loader2, XIcon } from 'lucide-react'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { cn } from '@/lib/utils'
import { recite } from '@/lib/recite'
import { useSelectedWordsStore } from '@/hooks/use-selected-store'
import { useVocabulary } from '@/hooks/use-vocabulary'
import { Vocabulary } from '@prisma/client'
import { MemoryServices, VocabularyServices } from '@/lib/services'
import { fontClasses } from '@/config/fonts'

export const SelectedVocabularies = () => {
  const {
    translatedWords,
    removeTranslatedWord,
    selectedWord,
    setSelectedWord,
    purgeTranslatedWords
  } = useSelectedWordsStore()
  const { isCreatingVocabularies } = useVocabulary()
  const { isAutoSpeak, setIsAutoSpeak } = useSelectedWordsStore()

  const wordsCount = useMemo(
    () => translatedWords?.length ?? 0,
    [translatedWords]
  )

  const onSave = async () => {
    if (!translatedWords?.length) return
    const vocabulariesRes = await VocabularyServices.checkVocabularies.fn(
      translatedWords.map((word) => word.word).join(',')
    )
    const vocabularyIds = vocabulariesRes?.data?.map(
      (vocabulary) => vocabulary.id
    )
    if (!vocabularyIds?.length) return
    await MemoryServices.initializeMemories.fn(vocabularyIds)
  }

  return (
    <div className="flex-1 overflow-hidden px-8">
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
          {isCreatingVocabularies ? (
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
              key={`${word.word}-${index}`}
              word={word}
              onClick={() => setSelectedWord(word?.word)}
              isSelected={word.word === selectedWord?.word}
              onDelete={() => removeTranslatedWord(word?.word)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const WordItem: React.FC<{
  word: Vocabulary
  isSelected?: boolean
  onClick?: () => void
  onDelete?: () => void
}> = ({ word, isSelected, onDelete, onClick }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const onClickSound = () => {
    if (onClick) {
      onClick()
    }

    recite(word.word)
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
      className={cn(
        'group',
        isSelected && 'border-primary',
        fontClasses.reading
      )}
      onClick={onClick}>
      <AlertTitle>{word.word}</AlertTitle>
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
