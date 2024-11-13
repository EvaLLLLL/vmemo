'use client'

import { WordItem } from '@/components/WordItem'
import { useMemory } from '@/hooks/useMemory'
import { useVocabularies } from '@/hooks/useVocabularies'
import { TVocabulary } from '@/types/vocabulary'
import { useState } from 'react'

export default function Vocabulary() {
  const { submit, currrentVocabulary, isSummary, remember, forget } =
    useMemory()
  const { vocabularies, counts } = useVocabularies()

  return (
    <div className="flex h-full flex-col">
      <div className="mt-4 flex items-center justify-center gap-x-2 text-center">
        <span>totalCount: {counts?.totalCount}</span>
        <span>leve0: {counts?.level0Count}</span>
        <span>leve1: {counts?.level1Count}</span>
        <span>leve2: {counts?.level2Count}</span>
        <span>leve3: {counts?.level3Count}</span>
        <span>levelL: {counts?.levelLCount}</span>
      </div>

      <div className="mx-auto my-4 flex h-full w-3/5 flex-1 flex-col justify-between rounded-sm border-2">
        {isSummary ? (
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-y-4">
              {vocabularies?.map((v) => <WordItem key={v.id} word={v} />)}
            </div>
            <button onClick={() => submit()}>submit（空格）</button>
          </div>
        ) : (
          !!currrentVocabulary && (
            <VocabularyItem
              vocabulary={currrentVocabulary}
              onForget={forget}
              onRemember={remember}
            />
          )
        )}
      </div>
    </div>
  )
}

const VocabularyItem: React.FC<{
  vocabulary: TVocabulary
  onForget: () => void
  onRemember: () => void
}> = ({ vocabulary, onForget, onRemember }) => {
  const [revealed, setRevealed] = useState(false)

  return (
    <div>
      <div
        onClick={() => setRevealed(true)}
        className="mx-auto flex aspect-square w-1/2 flex-col items-center justify-center gap-y-2 rounded-md bg-pink-300 text-xl font-bold text-white">
        <span>{vocabulary.level}</span>
        <span>{vocabulary.origin}</span>
        <span>{revealed && vocabulary.translation}</span>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => onRemember()}>记得（Q）</button>
        <button onClick={() => onForget()}>不记得（E）</button>
      </div>
    </div>
  )
}
