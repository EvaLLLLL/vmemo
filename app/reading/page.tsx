'use client'

import cn from '@/utils/cn'
import { useEffect, useRef, useState } from 'react'
import { translate, TranslationItem } from '@/utils/translate'
import { copyToClipboard } from '@/utils/copy'

export default function Reading() {
  const [selectedWords, setSelectedWords] = useState<TranslationItem[]>([])
  const [selected, setSelected] = useState<string | undefined>(
    selectedWords[0]?.origin
  )

  useEffect(() => {
    if (selectedWords[0]?.origin) setSelected(selectedWords[0].origin)
  }, [selectedWords])

  const onSelectWord = async (word?: string) => {
    const formattedWord = word?.trim()
    const storedWord = selectedWords.find((w) => w?.origin === formattedWord)

    const isSentence = (word?.split(' ').length || 0) >= 10

    if (storedWord?.audioUrl && !isSentence) {
      const audioPlayer = new Audio(storedWord.audioUrl)
      audioPlayer.play()
    }

    setSelected(storedWord?.origin)

    if (!formattedWord || !!storedWord) return

    const result = await translate(formattedWord)

    setSelectedWords([result, ...selectedWords])

    if (result?.audioUrl && !isSentence) {
      const audioPlayer = new Audio(result.audioUrl)
      audioPlayer.play()
    }
  }
  return (
    <div className="flex justify-center align-center flex-1 py-8 px-16 overflow-hidden">
      <div className="h-full w-full flex overflow-hidden rounded-3xl">
        <ReadingText onSelectWord={onSelectWord} />
        <SelectedVocabularies
          selected={selected}
          selectedWords={selectedWords}
          setSelectedWords={setSelectedWords}
        />
      </div>
    </div>
  )
}

const ReadingText: React.FC<{
  onSelectWord: (word?: string) => void
}> = ({ onSelectWord }) => {
  const [isEdit, setIsEdit] = useState(true)
  const [textContent, setTextContent] = useState('')
  return (
    <div className="w-3/5 bg-slate-100 h-full p-8 break-words flex">
      {isEdit ? (
        <div className="h-full w-full relative">
          <textarea
            className="border-2 border-orange-200 rounded-3xl h-full w-full focus:outline-orange-300 bg-transparent break-words resize-none p-8 pb-20 caret-orange-300"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
          <button
            onClick={() => textContent && setIsEdit(false)}
            className={cn(
              'absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4',
              'rounded-full bg-orange-200 hover:bg-orange-100 py-1 px-8',
              !textContent && 'bg-orange-100 cursor-not-allowed text-gray-500'
            )}>
            start
          </button>
        </div>
      ) : (
        <div className="w-full h-full relative pt-6">
          <div
            className="h-full w-full overflow-y-auto break-words p-8 whitespace-pre-wrap selection:bg-teal-200 pt-0"
            onMouseUp={() => {
              onSelectWord(window?.getSelection()?.toString())
            }}>
            {textContent}
          </div>
          <button
            onClick={() => setIsEdit((pre) => !pre)}
            className={cn(
              'absolute left-2 -top-5',
              'rounded-full py-1 px-8 bg-orange-200 hover:bg-orange-100'
            )}>
            edit
          </button>
        </div>
      )}
    </div>
  )
}

const SelectedVocabularies: React.FC<{
  selected?: string
  selectedWords: TranslationItem[]
  setSelectedWords: (words: TranslationItem[]) => void
}> = ({ selectedWords, selected, setSelectedWords }) => {
  return (
    <div className="p-8 w-2/5 bg-slate-200">
      <div className="relative h-full pt-6">
        <div className="flex flex-col gap-2 h-full overflow-y-auto py-8 px-3 pt-0">
          {selectedWords.map((word) => (
            <WordItem
              key={word.origin}
              word={word}
              isSelected={word.origin === selected}
              onDelete={() =>
                setSelectedWords(selectedWords.filter((w) => w !== word))
              }
            />
          ))}
        </div>
        <button
          onClick={() => setSelectedWords([])}
          className={cn(
            'absolute left-2 -top-5',
            'rounded-full py-1 px-8 bg-teal-200 hover:bg-teal-100'
          )}>
          clear
        </button>
        <button
          onClick={async () => {
            const content = selectedWords
              .map((w) => `${w.origin}\t${w.translation}`)
              .join('\r')
            copyToClipboard(content, () => console.log('Copied: ', content))
          }}
          className={cn(
            'absolute right-2 -top-5',
            'rounded-full py-1 px-8 bg-teal-200 hover:bg-teal-100'
          )}>
          copy {selectedWords.length || ''}
        </button>
      </div>
    </div>
  )
}

const WordItem: React.FC<{
  word: TranslationItem
  isSelected: boolean
  onDelete: () => void
}> = ({ word, isSelected, onDelete }) => {
  const ref = useRef<HTMLDivElement | null>(null)
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
    <div
      ref={ref}
      onClick={() => {
        if (!word.audioUrl) return
        const isSentence = (word.origin.split(' ').length || 0) >= 10
        if (isSentence) return
        const audio = new Audio(word.audioUrl)
        audio.play()
      }}
      className={cn(
        'flex flex-col justify-center py-1 px-4 bg-teal-50 rounded-2xl hover:bg-teal-200 cursor-pointer whitespace-pre-wrap relative group',
        isSelected && 'bg-teal-200'
      )}>
      <div className="font-semibold">{word.origin}</div>
      <div>{word.translation}</div>
      <div
        className="absolute right-2 rounded-full p-1 bg-slate-200 h-6 w-6 invisible group-hover:visible hover:bg-slate-300 text-gray-400 flex items-center justify-center"
        onClick={(e) => {
          e?.stopPropagation()
          onDelete()
        }}>
        x
      </div>
    </div>
  )
}
