'use client'

import cn from '@/utils/cn'
import { useState } from 'react'
import { SelectedVocabularies } from '@/components/SelectedVocabularies'
import { useSelectedWordsStore } from '@/hooks/useSelectedWordsStore'

export default function Reading() {
  const { addTranslatedWord, isAutoSpeak } = useSelectedWordsStore()

  const onSelectWord = async (word?: string) => {
    if (!word) return

    const result = await addTranslatedWord(word)

    if (result?.audio && !result?.isSentence && isAutoSpeak) {
      const audioPlayer = new Audio(result.audio)
      audioPlayer.play()
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center overflow-hidden align-middle">
      <div className="flex size-full overflow-hidden">
        <ReadingText onSelectWord={onSelectWord} />
        <SelectedVocabularies isDict={false} />
      </div>
    </div>
  )
}

const ReadingText: React.FC<{
  onSelectWord: (word?: string) => void
}> = ({ onSelectWord }) => {
  const { isAutoSpeak, setIsAutoSpeak } = useSelectedWordsStore()

  const [isEdit, setIsEdit] = useState(true)
  const [textContent, setTextContent] = useState('')

  return (
    <div className="h-full w-3/5 break-words bg-slate-100 p-8">
      <div className="relative h-full pt-6">
        <div className="absolute -top-5 flex w-full items-center justify-between">
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
          <div className="relative size-full">
            <textarea
              tabIndex={0}
              autoFocus
              className="size-full resize-none break-words rounded border-2 border-orange-100 bg-transparent p-8 pb-20 outline-none transition-colors duration-200 focus:border-teal-400"
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
            className="size-full overflow-y-auto whitespace-pre-wrap break-words p-8 pb-20 outline-2 outline-transparent selection:bg-teal-200"
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
