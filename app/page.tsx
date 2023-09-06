'use client'

import { useState } from 'react'
import cn from '@/utils/cn'

const mockExcelList = ['a.excel', 'b.excel', 'c.excel']
const wordList = Array(20).fill('funny')

export default function Home() {
  const [selectedList, setSelectedList] = useState(mockExcelList[0])

  const onClickMenuItem = (i: string) => setSelectedList(i)

  return (
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

const WordItem: React.FC<{ word: string }> = ({ word }) => {
  return <div className="border border-pink-200 p-4 rounded-2xl">{word}</div>
}
