import { useEffect, useMemo, useRef, MouseEvent, useState } from 'react'
import { Button } from './ui/button'
import {
  HeadphonesIcon,
  Loader2,
  XIcon,
  EarOff,
  FileAudio2,
  Save,
  Trash2
} from 'lucide-react'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { recite } from '@/lib/recite'
import { useSelectedWordsStore } from '@/hooks/use-selected-store'
import { useVocabulary } from '@/hooks/use-vocabulary'
import { MemoryLevel, MemoryStatus, Vocabulary } from '@prisma/client'
import {
  DictServices,
  MemoryServices,
  VocabularyServices
} from '@/lib/services'
import { fontClasses } from '@/config/fonts'
import { useQuery } from '@tanstack/react-query'
import { formatDictResult } from '@/utils/dict'
import { useAuth } from '@/hooks/use-auth'

export const SelectedVocabularies = () => {
  const { isAuthenticated } = useAuth()
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
          <Button
            variant="ghost"
            onClick={purgeTranslatedWords}
            className="flex gap-x-2 hover:bg-destructive/90 hover:text-destructive-foreground">
            <Trash2 size={16} />
            Clear
          </Button>
          <div className="flex items-center gap-x-2">
            <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
              <Switch
                id="switch-isAutoSpeak"
                checked={isAutoSpeak}
                onCheckedChange={setIsAutoSpeak}
                className="peer absolute inset-0 h-[inherit] w-auto data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
              />
              <span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=checked]:text-muted-foreground/70">
                <EarOff size={16} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=unchecked]:text-muted-foreground/70">
                <FileAudio2 size={16} strokeWidth={2} aria-hidden="true" />
              </span>
            </div>
            <Label
              htmlFor="switch-isAutoSpeak"
              className={cn(
                'text-xl',
                isAutoSpeak ? 'text-primary' : 'text-muted-foreground'
              )}>
              {isAutoSpeak ? 'Auto speak' : 'Auto speak off'}
            </Label>
          </div>
          {isCreatingVocabularies ? (
            <Button disabled className="min-w-[120px]">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              disabled={!isAuthenticated}
              onClick={onSave}
              className={cn(
                'flex min-w-[120px] gap-x-2 bg-primary text-primary-foreground hover:bg-primary/90',
                !isAuthenticated && 'opacity-50 cursor-not-allowed'
              )}>
              <Save size={16} />
              Save
              {wordsCount > 0 && (
                <span className="ml-1 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
                  {wordsCount}
                </span>
              )}
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

  const { data: memory } = useQuery({
    queryKey: [MemoryServices.getMemoryByWord.key, word.word],
    queryFn: () => MemoryServices.getMemoryByWord.fn(word.word),
    select: (v) => v.data
  })

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

  const StatusBadge = ({ status }: { status?: MemoryStatus }) => {
    if (!status) return null

    const variant = status
      ? {
          NOT_STARTED: 'outline',
          IN_PROGRESS: 'secondary',
          COMPLETED: 'default'
        }[status]
      : 'outline'

    return (
      <Badge
        variant={
          variant as 'default' | 'secondary' | 'destructive' | 'outline'
        }>
        {status}
      </Badge>
    )
  }

  const LevelBadge = ({ level }: { level?: MemoryLevel }) => {
    if (!level) return null

    const variant = level
      ? {
          LEVEL_1: 'secondary',
          LEVEL_2: 'secondary',
          LEVEL_3: 'secondary',
          LEVEL_4: 'secondary',
          LEVEL_5: 'secondary',
          MASTERED: 'default'
        }[level]
      : 'outline'

    return (
      <Badge
        variant={
          variant as 'default' | 'secondary' | 'destructive' | 'outline'
        }>
        {level || 'N/A'}
      </Badge>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        'group border relative cursor-pointer transition-all',
        'relative w-full cursor-pointer rounded-lg border px-4 py-3 text-sm shadow hover:bg-primary/20 hover:shadow-xl',
        isSelected && 'border-primary',
        isExpanded && 'shadow-lg'
      )}
      onClick={handleOnclick}>
      <div className="flex items-center gap-x-2">
        <span className={cn(fontClasses.reading, 'font-semibold')}>
          {word.word}
        </span>
        <span>{word.translation}</span>
        <StatusBadge status={memory?.status} />
        <LevelBadge level={memory?.level} />
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
