'use client'

import { useState } from 'react'
import { SelectedVocabularies } from '@/components/SelectedVocabularies'
import { useSelectedWordsStore } from '@/hooks/useSelectedWordsStore'
import { Input } from '@/components/ui/input'

export default function Dictionary() {
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
    <div className="flex h-full flex-1 flex-col gap-y-4">
      <SearchDict onSelectWord={onSelectWord} />
      <SelectedVocabularies />
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
    <div className="px-8 pt-4">
      <Input
        autoFocus
        placeholder="type here, press Enter to get translation"
        tabIndex={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.code === 'Enter' && onEnter()}
      />
    </div>
  )
}
