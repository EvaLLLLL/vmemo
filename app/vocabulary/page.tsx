'use client'

import { WordItem } from '@/components/WordItem'
import { useVocabularies } from '@/hooks/useVocabularies'

export default function Vocabulary() {
  const { vocabularies, reduceMemory, addMemory } = useVocabularies()

  return (
    <div>
      <div className="flex flex-col gap-y-3 border-b">
        <div className="flex w-full items-center justify-center gap-x-10">
          <button>back</button>
          <div className="font-semibold text-purple-400">3000random.excel</div>
        </div>
      </div>

      <div className="mx-auto mt-4 grid w-3/5 grid-cols-4 gap-8">
        {vocabularies?.map((word, idx) => (
          <WordItem
            key={idx}
            word={word}
            onClick={() => addMemory([word.id])}
            onDelete={() => reduceMemory([word.id])}
          />
        ))}
      </div>
    </div>
  )
}
