'use client'

import cn from '@/utils/cn'
import { useEffect, useState } from 'react'
import {
  ydTranslate,
  ecdictTranslate,
  TranslationItem
} from '@/utils/translate'
import { copyToClipboard } from '@/utils/copy'
import { WordItem } from '@/components/WordItem'

export default function Reading() {
  const [isAutoSpeak, setIsAutoSpeak] = useState(true)
  const [selectedWords, setSelectedWords] = useState<TranslationItem[]>([])
  const [selected, setSelected] = useState<TranslationItem | undefined>(
    selectedWords[0]
  )

  useEffect(() => {
    if (selectedWords[0]?.origin) setSelected(selectedWords[0])
  }, [selectedWords])

  const onSelectWord = async (word?: string) => {
    const formattedWord = word?.trim()
    const storedWord = selectedWords.find((w) => w?.origin === formattedWord)

    const isSentence = (word?.split(' ').length || 0) >= 10

    if (storedWord?.audio && !isSentence && isAutoSpeak) {
      const audioPlayer = new Audio(storedWord.audio)
      audioPlayer.play()
    }

    setSelected(storedWord)

    if (!formattedWord || !!storedWord) return

    const ydRes = await ydTranslate(formattedWord)
    const ecdictRes = await ecdictTranslate(formattedWord)

    const result = {
      isSentence,
      origin: formattedWord,
      audio: ydRes.audio || ecdictRes.audio,
      translation:
        ecdictRes.translation?.replaceAll(/\\n/g, '; ') || ydRes.translation
    }

    setSelectedWords([result, ...selectedWords])

    if (result?.audio && !isSentence && isAutoSpeak) {
      const audioPlayer = new Audio(result.audio)
      audioPlayer.play()
    }
  }

  return (
    <div className="flex justify-center align-center flex-1 py-8 px-16 overflow-hidden">
      <div className="h-full w-full flex overflow-hidden rounded-3xl">
        <ReadingText
          onSelectWord={onSelectWord}
          isAutoSpeak={isAutoSpeak}
          setIsAutoSpeak={setIsAutoSpeak}
        />
        <SelectedVocabularies
          selected={selected}
          setSelected={setSelected}
          selectedWords={selectedWords}
          setSelectedWords={setSelectedWords}
        />
      </div>
    </div>
  )
}

const ReadingText: React.FC<{
  isAutoSpeak: boolean
  setIsAutoSpeak: (v: boolean) => void
  onSelectWord: (word?: string) => void
}> = ({ onSelectWord, isAutoSpeak, setIsAutoSpeak }) => {
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
          <div className="absolute w-full -top-5 flex items-center justify-between">
            <button
              onClick={() => setIsEdit((pre) => !pre)}
              className="rounded-full py-1 px-8 bg-orange-200 hover:bg-orange-100">
              edit
            </button>
            <button
              onClick={() => setIsAutoSpeak(!isAutoSpeak)}
              className={cn(
                'rounded-full py-1 px-8 bg-orange-200 hover:bg-orange-100',
                isAutoSpeak && 'bg-teal-200 hover:bg-teal-100'
              )}>
              auto speak
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const SelectedVocabularies: React.FC<{
  selected?: TranslationItem
  setSelected: (v: TranslationItem) => void
  selectedWords: TranslationItem[]
  setSelectedWords: (words: TranslationItem[]) => void
}> = ({ selectedWords, selected, setSelected, setSelectedWords }) => {
  // const saveWords = async () => {
  //   await fetch(process.env.NEXT_PUBLIC_API + '/api/vocabulary/save', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(selectedWords)
  //   })
  // }
  return (
    <div className="p-8 w-2/5 bg-slate-200">
      <div className="relative h-full pt-6">
        <div className="flex flex-col gap-2 h-full overflow-y-auto py-8 px-3 pt-0">
          {selectedWords.map((word, index) => (
            <WordItem
              key={`${word.origin}-${index}`}
              word={word}
              onClick={() => {
                setSelected(word)
                if (word.audio && !word.isSentence) {
                  const audioPlayer = new Audio(word.audio)
                  audioPlayer.play()
                }
              }}
              isSelected={word.origin === selected?.origin}
              onDelete={() =>
                setSelectedWords(selectedWords.filter((w) => w !== word))
              }
            />
          ))}
        </div>
        <div className="w-full absolute -top-5 flex items-center justify-between">
          <button
            onClick={() => setSelectedWords([])}
            className="rounded-full py-1 px-4 bg-teal-200 hover:bg-teal-100">
            clear
          </button>
          {/* <button
            onClick={saveWords}
            className="rounded-full py-1 px-4 bg-teal-200 hover:bg-teal-100">
            save
          </button> */}
          <button
            onClick={async () => {
              const content = selectedWords
                .reverse()
                .map((w) => `${w.origin}\t${w.translation}`)
                .join('\r')
              copyToClipboard(content, () => console.log('Copied: ', content))
            }}
            className="rounded-full py-1 px-4 bg-teal-200 hover:bg-teal-100">
            copy {selectedWords.length || ''}
          </button>
        </div>
      </div>
    </div>
  )
}
