import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

export const LevelStar: React.FC<{ level: number }> = ({ level }) => {
  return (
    <div className="flex items-center gap-x-1">
      <Star
        className={cn('size-4 text-gray-400', level >= 1 && 'text-green-700')}
      />
      <Star
        className={cn('size-4 text-gray-400', level >= 2 && 'text-green-700')}
      />
      <Star
        className={cn('size-4 text-gray-400', level >= 3 && 'text-green-700')}
      />
    </div>
  )
}
