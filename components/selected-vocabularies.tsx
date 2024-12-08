import { useEffect, useMemo, useRef, MouseEvent, useState } from 'react'
import { Button } from './ui/button'
import { HeadphonesIcon, Loader2, XIcon } from 'lucide-react'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { cn } from '@/lib/utils'
import { recite } from '@/lib/recite'
import { useSelectedWordsStore } from '@/hooks/use-selected-store'
import { useVocabulary } from '@/hooks/use-vocabulary'
import { Vocabulary } from '@prisma/client'
import {
  DictServices,
  MemoryServices,
  VocabularyServices
} from '@/lib/services'
import { fontClasses } from '@/config/fonts'
import { useQuery } from '@tanstack/react-query'
import { formatDictResult } from '@/utils/dict'

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
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const { data: dictResult } = useQuery({
    queryKey: [DictServices.translate.key, word],
    queryFn: () => DictServices.translate.fn(word.word),
    select: (v) => v.data,
    enabled: isExpanded
  })

  const { simpleMeans, derivatives, examples } = formatDictResult(dictResult)

  const handleOnclick = () => {
    setIsExpanded(true)
    onClick?.()
  }

  const handleOnClickSound = (e: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation()

    if (onClick) {
      onClick()
    }

    recite(word.word)
  }

  const handleOnClickDelete = (e: MouseEvent<HTMLButtonElement>) => {
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

      setIsExpanded(true)
    } else {
      setIsExpanded(false)
    }
  }, [isSelected])

  return (
    <div
      ref={ref}
      className={cn(
        'group border relative cursor-pointer transition-all',
        'relative w-full cursor-pointer rounded-lg border px-4 py-3 text-sm shadow hover:bg-chart-2 hover:shadow-xl',
        isSelected && 'border-primary',
        isExpanded && 'shadow-lg',
        fontClasses.reading
      )}
      onClick={handleOnclick}>
      <div>
        <span>{word.word} </span>
        <span>{word.translation} </span>
      </div>

      {isExpanded && (
        <div className="grid transition-all duration-200">
          <div className="space-y-4 overflow-hidden p-2">
            {simpleMeans && (
              <div className="text-sm text-gray-600">{simpleMeans}</div>
            )}

            {examples && examples.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-gray-500">
                  Examples:
                </span>
                {examples.map((e) => (
                  <div key={e.pos} className="ml-2 space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">{e.pos}.</span>{' '}
                      {e.tr_group[0].example[0]}
                    </div>
                    {e.tr_group[0].similar_word[0] && (
                      <div className="text-xs text-gray-500">
                        Similar words: {e.tr_group[0].similar_word[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {derivatives && Object.keys(derivatives).length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500">
                  Derivatives:{' '}
                </span>
                <span className="text-sm">
                  {Object.values(derivatives).join('; ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="invisible absolute right-4 top-1 group-hover:visible">
        <Button variant="ghost" size="icon" onClick={handleOnClickSound}>
          <HeadphonesIcon />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleOnClickDelete}>
          <XIcon />
        </Button>
      </div>
    </div>
  )
}
