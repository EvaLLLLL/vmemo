import { MemoryServices } from '@/lib/services'
import { useQuery } from '@tanstack/react-query'

export const useMemoryList = () => {
  const { data: memoryList } = useQuery({
    queryKey: [MemoryServices.getMemoryList.key],
    queryFn: MemoryServices.getMemoryList.fn
  })

  return { memoryList }
}
