'use client'

import { WordItem } from '@/components/WordItem'
import { useVocabularies } from '@/hooks/useVocabularies'
import cn from '@/utils/cn'
import { useState } from 'react'

const mockExcelList = ['saved', '3000-random', 'jijing']

export default function Vocabulary() {
  const { vocabularies, deleteWord } = useVocabularies()

  const [selectedList, setSelectedList] = useState(mockExcelList[0])

  const onClickMenuItem = (i: string) => setSelectedList(i)

  return (
    <div className="flex flex-col gap-y-3 p-4">
      <div className="flex h-screen justify-center align-middle">
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
            {vocabularies?.map((word, idx) => (
              <WordItem
                key={idx}
                word={word}
                onDelete={() => deleteWord(word?.origin)}
              />
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
