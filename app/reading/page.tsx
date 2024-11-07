'use client'

import cn from '@/utils/cn'
import { useState } from 'react'
import { SelectedVocabularies } from '@/components/SelectedVocabularies'
import { useSelectedWordsStore } from '@/store/selectedWords'

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
    <div className="flex flex-col justify-center align-center flex-1 overflow-hidden">
      <div className='h-full w-full flex overflow-hidden'>
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
