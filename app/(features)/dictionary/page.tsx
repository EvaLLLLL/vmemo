'use client'

import { useState } from 'react'
import { SelectedVocabularies } from '@/components/selected-vocabularies'
import { Input } from '@/components/ui/input'
import { recite } from '@/lib/recite'
import { useSelectedWordsStore } from '@/hooks/use-selected-store'
import { fontClasses } from '@/config/fonts'
import { cn } from '@/lib/utils'

export default function Dictionary() {
  const { isAutoSpeak, addTranslatedWord } = useSelectedWordsStore()

  const onSelectWord = async (word?: string) => {
    if (!word) return

    await addTranslatedWord(word)

    if (isAutoSpeak) recite(word)
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4 sm:p-8">
      <div className="w-full">
        <SearchDict onSelectWord={onSelectWord} />
      </div>
      <div className="flex-1 overflow-hidden">
        <SelectedVocabularies />
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
    <div className="w-full px-8 pt-4">
      <Input
        autoFocus
        placeholder="type word to search, press Enter to get translation"
        tabIndex={0}
        value={value}
        className={cn(fontClasses.reading)}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.code === 'Enter' && onEnter()}
      />
    </div>
  )
}
