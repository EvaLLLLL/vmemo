import cn from '@/utils/cn'
import { TranslationItem } from '@/utils/translate'
import { useEffect, useRef } from 'react'

export const WordItem: React.FC<{
  word: TranslationItem
  isSelected?: boolean
  onClick?: () => void
  onDelete?: () => void
}> = ({ word, isSelected, onDelete, onClick }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (isSelected) {
      ref?.current?.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [isSelected])

  return (
    <div
      ref={ref}
      onClick={
        onClick ??
        function () {
          const audioPlayer = new Audio(word.audio)
          audioPlayer.play()
        }
      }
      className={cn(
        'flex flex-col justify-center py-1 px-4 bg-teal-50 rounded-2xl hover:bg-teal-200 cursor-pointer whitespace-pre-wrap relative group',
        isSelected && 'bg-teal-200'
      )}>
      <div className="font-semibold">{word.origin}</div>
      <div>{word.translation}</div>
      <div
        className="invisible absolute right-2 flex size-6 items-center justify-center rounded-full bg-slate-200 p-1 text-gray-400 hover:bg-slate-300 group-hover:visible"
        onClick={(e) => {
          e?.stopPropagation()
          onDelete?.()
        }}>
        x
      </div>
    </div>
  )
}
