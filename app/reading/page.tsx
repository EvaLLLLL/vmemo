'use client'

import cn from '@/utils/cn'
import { useEffect, useMemo, useState } from 'react'
import { ydTranslate, TranslationItem } from '@/utils/translate'
import { copyToClipboard } from '@/utils/copy'
import { WordItem } from '@/components/WordItem'

export default function Reading() {
  const [isAutoSpeak, setIsAutoSpeak] = useState(false)
  const [selectedWords, setSelectedWords] = useState<TranslationItem[]>([])
  const [selected, setSelected] = useState<TranslationItem | undefined>(
    selectedWords[0]
  )

  useEffect(() => {
    if (selectedWords[0]?.origin) setSelected(selectedWords[0])
  }, [selectedWords])

  const copyContent = useMemo(() => {
    return selectedWords
      .reverse()
      .map((w) => `${w.origin}\t${w.translation}`)
      .join('\r')
  }, [selectedWords])

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'c') {
        copyToClipboard(copyContent, () => console.log('Copied: ', copyContent))
      }
      if (event.key.toLowerCase() === 'k') {
        setSelectedWords([])
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return document.removeEventListener('keydown', handleKeydown)
  }, [copyContent])

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
    const ecdictRes = await getData(formattedWord)

    const result = {
      isSentence,
      origin: formattedWord,
      audio: ydRes.audio || ecdictRes.audio,
      translation:
        ecdictRes?.translation?.replaceAll(/\\n/g, '; ') || ydRes.translation
    }

    setSelectedWords([result, ...selectedWords])

    if (result?.audio && !isSentence && isAutoSpeak) {
      const audioPlayer = new Audio(result.audio)
      audioPlayer.play()
    }
  }

  const [tab, setTab] = useState<'reading' | 'dict'>('dict')

  return (
    <div className="flex flex-col justify-center align-center flex-1 overflow-hidden">
      <div className="grid grid-cols-2 mb-1">
        <button
          className={cn(
            'py-2 px-4 bg-gray-200',
            tab === 'reading' && 'bg-teal-200',
            tab !== 'reading' && 'hover:bg-slate-300'
          )}
          onClick={() => setTab('reading')}>
          reading
        </button>
        <button
          className={cn(
            'py-2 px-4 bg-gray-200',
            tab === 'dict' && 'bg-teal-200',
            tab !== 'dict' && 'hover:bg-slate-300'
          )}
          onClick={() => setTab('dict')}>
          dict
        </button>
      </div>
      <div
        className={cn(
          'h-full w-full flex overflow-hidden',
          tab === 'dict' && 'flex-col'
        )}>
        {tab === 'reading' ? (
          <ReadingText
            onSelectWord={onSelectWord}
            isAutoSpeak={isAutoSpeak}
            setIsAutoSpeak={setIsAutoSpeak}
          />
        ) : (
          <SearchDict onSelectWord={onSelectWord} />
        )}
        <SelectedVocabularies
          isDict={tab === 'dict'}
          selected={selected}
          setSelected={setSelected}
          selectedWords={selectedWords}
          setSelectedWords={setSelectedWords}
        />
      </div>
    </div>
  )
}

const SearchDict: React.FC<{
  onSelectWord: (word?: string) => void
}> = ({ onSelectWord }) => {
  const [value, setValue] = useState('')
  const onEnter = () => {
    onSelectWord(value)
    setValue('')
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 px-4 max-h-16 gap-y-2 flex-shrink-0">
      <input
        autoFocus
        tabIndex={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.code === 'Enter' && onEnter()}
        className="w-full bg-stale-100 px-2 py-1 border-2 outline-none border-orange-100 focus:border-teal-400 transition-colors duration-200 rounded"
      />
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
    <div className="w-3/5 bg-slate-100 h-full p-8 break-words">
      <div className="relative pt-6 h-full">
        <div className="w-full absolute flex items-center justify-between -top-5">
          <button
            onClick={() => setIsEdit(true)}
            className={cn(
              'rounded-full py-1 px-8 bg-orange-200 hover:bg-orange-100',
              isEdit && 'bg-teal-200 hover:bg-teal-100'
            )}>
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
        {isEdit ? (
          <div className="h-full w-full relative">
            <textarea
              tabIndex={0}
              autoFocus
              className="outline-none border-2 border-orange-100 rounded h-full w-full focus:border-teal-400 bg-transparent break-words resize-none p-8 pb-20 transition-colors duration-200"
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
          <div
            className="h-full w-full overflow-y-auto break-words p-8 pb-20 whitespace-pre-wrap selection:bg-teal-200 outline-2 outline-transparent"
            onMouseUp={() => {
              onSelectWord(window?.getSelection()?.toString())
            }}>
            {textContent}
          </div>
        )}
      </div>
    </div>
  )
}

const SelectedVocabularies: React.FC<{
  isDict: boolean
  selected?: TranslationItem
  setSelected: (v: TranslationItem) => void
  selectedWords: TranslationItem[]
  setSelectedWords: (words: TranslationItem[]) => void
}> = ({ selectedWords, isDict, selected, setSelected, setSelectedWords }) => {
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
    <div
      className={cn(
        'px-8 pt-8 pb-4 w-2/5 bg-slate-200',
        isDict && 'w-full flex-1 overflow-hidden'
      )}>
      <div className="relative h-full pt-6">
        <div className="flex flex-col gap-2 h-full overflow-y-auto">
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

async function getData(word: string) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API + `/api/ecdict?word=${word}`,
    {
      method: 'GET',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 0 }
    }
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
