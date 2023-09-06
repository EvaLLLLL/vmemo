'use client'

import { WordItem } from '@/components/WordItem'
import { TranslationItem } from '@/utils/translate'
import { useEffect, useState } from 'react'

export default function Vocabulary() {
  const [vocabularyList, setVocabularyList] = useState<TranslationItem[]>([])

  useEffect(() => {
    getData().then((res) => setVocabularyList(res))
  }, [])

  return (
    <div className="p-4 flex flex-col gap-y-3">
      {vocabularyList.map((item) => (
        <WordItem key={item.origin} word={item} />
      ))}
    </div>
  )
}

async function getData() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API + '/api/vocabulary/list',
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
