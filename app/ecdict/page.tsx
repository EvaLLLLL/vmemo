'use client'

import { useState } from 'react'
import { SelectedVocabularies } from '@/components/SelectedVocabularies'
import { useSelectedWordsStore } from '@/hooks/useSelectedWordsStore'

export default function Ecdict() {
  const { isAutoSpeak, addTranslatedWord } = useSelectedWordsStore()

  const onSelectWord = async (word?: string) => {
    if (!word) return
    const translated = await addTranslatedWord(word)

    if (translated?.audio && !translated?.isSentence && isAutoSpeak) {
      const audioPlayer = new Audio(translated.audio)
      audioPlayer.play()
    }
  }

  return (
    <div>
      <SearchDict onSelectWord={onSelectWord} />
      <SelectedVocabularies isDict />
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
    <div className="flex size-full max-h-16 shrink-0 flex-col items-center justify-center gap-y-2 bg-stone-100 px-4">
      <input
        autoFocus
        tabIndex={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.code === 'Enter' && onEnter()}
        className="w-full rounded border-2 border-orange-100 bg-slate-100 px-2 py-1 outline-none transition-colors duration-200 focus:border-teal-400"
      />
    </div>
  )
}
