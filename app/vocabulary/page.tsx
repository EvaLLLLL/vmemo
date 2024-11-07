'use client'

import { WordItem } from "@/components/WordItem"
import cn from "@/utils/cn"
import { TranslationItem } from '@/utils/translate'
import { useEffect, useState } from 'react'

const wordList = Array(20).fill('funny')
const mockExcelList = ['a.excel', 'b.excel', 'c.excel']

export default function Vocabulary() {
  const [vocabularyList, setVocabularyList] = useState<TranslationItem[]>([])

  const [selectedList, setSelectedList] = useState(mockExcelList[0])
  const onClickMenuItem = (i: string) => setSelectedList(i)

  useEffect(() => {
    getData().then((res) => setVocabularyList(res))
  }, [])

  return (
    <div className="p-4 flex flex-col gap-y-3">
      <div className="flex justify-center align-center h-screen">
        <div className="w-96">
          {mockExcelList.map((item) => (
            <MenuItem
              key={item}
              item={item}
              active={item === selectedList}
              onClick={() => onClickMenuItem(item)}
            />
          ))}
        </div>
        <div className="flex-1 border p-4">
          <div className="grid grid-cols-4 gap-8">
            {wordList.map((word, idx) => (
              <WordItem key={idx} word={word} />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

const MenuItem: React.FC<{
  item: string
  active: boolean
  onClick: () => void
}> = ({ item, active, onClick }) => {
  return (
    <div
      className={cn(
        'pt-8 py-14 border-b flex justify-center align-center hover:bg-emerald-200 hover:cursor-pointer',
        active && 'bg-emerald-200'
      )}
      onClick={onClick}>
      {item}
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
