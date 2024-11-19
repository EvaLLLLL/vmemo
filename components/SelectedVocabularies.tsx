import cn from '@/utils/cn'
import { WordItem } from '@/components/WordItem'
import { useSelectedWordsStore } from '@/hooks/useSelectedWordsStore'
import { useVocabularyActions } from '@/hooks/useVocabularyActions'
import { useMemo } from 'react'

export const SelectedVocabularies: React.FC<{
  isDict: boolean
}> = ({ isDict }) => {
  const {
    translatedWords,
    removeTranslatedWord,
    selectedWord,
    setSelectedWord,
    purgeTranslatedWords
  } = useSelectedWordsStore()
  const { saveWords } = useVocabularyActions()

  const wordsCount = useMemo(
    () => translatedWords?.length ?? 0,
    [translatedWords]
  )

  const onSave = () => {
    if (!translatedWords?.length) return
    saveWords(translatedWords)
  }

  return (
    <div
      className={cn(
        'px-8 pt-8 pb-4 w-2/5 bg-slate-200',
        isDict && 'w-full flex-1 overflow-hidden'
      )}>
      <div className="relative h-full pt-6">
        <div className="flex h-full flex-col gap-2 overflow-y-auto">
          {translatedWords?.map((word, index) => (
            <WordItem
              key={`${word.origin}-${index}`}
              word={word}
              onClick={() => {
                setSelectedWord(word?.origin)
                if (word.audio && !word.isSentence) {
                  const audioPlayer = new Audio(word.audio)
                  audioPlayer.play()
                }
              }}
              isSelected={word.origin === selectedWord?.origin}
              onDelete={() => removeTranslatedWord(word?.origin)}
            />
          ))}
        </div>
        <div className="absolute -top-5 flex w-full items-center justify-between">
          <button
            onClick={purgeTranslatedWords}
            className="rounded-full bg-teal-200 px-4 py-1 hover:bg-teal-100">
            clear
          </button>
          <button
            onClick={onSave}
            className="rounded-full bg-teal-200 px-4 py-1 hover:bg-teal-100">
            save({wordsCount})
          </button>
        </div>
      </div>
    </div>
  )
}
