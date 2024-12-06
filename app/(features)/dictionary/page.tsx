'use client'

import { useState } from 'react'
import { SelectedVocabularies } from '@/components/selected-vocabularies'
import { Input } from '@/components/ui/input'
import { recite } from '@/lib/recite'
import { useSelectedWordsStore } from '@/hooks/use-selected-store'

export default function Dictionary() {
  const { isAutoSpeak, addTranslatedWord } = useSelectedWordsStore()

  const onSelectWord = async (word?: string) => {
    if (!word) return

    await addTranslatedWord(word)

    if (isAutoSpeak) recite(word)
  }

  return (
    <div className="flex size-full flex-1 flex-col gap-y-4 overflow-hidden">
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
