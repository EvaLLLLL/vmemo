'use client'

import { useEffect, useState } from 'react'
import { SelectedVocabularies } from '@/components/selected-vocabularies'
import { Input } from '@/components/ui/input'
import { recite } from '@/lib/recite'
import { useSelectedWordsStore } from '@/hooks/use-selected-store'
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
  const [isValid, setIsValid] = useState(true)

  const onEnter = () => {
    if (value.trim() === '' || !isValid) return

    onSelectWord(value)
    setValue('')
  }

  useEffect(() => {
    if (value) {
      setIsValid(/^[a-zA-Z]+$/.test(value.trim()))
    }
  }, [value])

  return (
    <div className="w-full px-8">
      <div className="relative">
        <Input
          className={cn(
            'pe-11',
            !isValid &&
              'border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20'
          )}
          placeholder="type word to search, press Enter to get translation"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onEnter()
            }
          }}
        />
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground">
          <kbd className="inline-flex h-5 max-h-full items-center rounded border border-border px-1 font-[inherit] font-medium text-muted-foreground/70">
            Enter
          </kbd>
        </div>
      </div>

      {!isValid && (
        <p
          className="mt-2 text-xs text-destructive"
          role="alert"
          aria-live="polite">
          Invalid word
        </p>
      )}
    </div>
  )
}
