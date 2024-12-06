import { useCallback } from 'react'
import { MemoryServices } from '@/lib/services'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useMemory = () => {
  const { data: dueReviewsResponse, refetch: refetchDueReviews } = useQuery({
    queryKey: [MemoryServices.getDueReviews.key],
    queryFn: MemoryServices.getDueReviews.fn
  })

  const { data: allMemoriesResponse, refetch: refetchAllMemories } = useQuery({
    queryKey: [MemoryServices.getAllMemories.key],
    queryFn: MemoryServices.getAllMemories.fn
  })

  const refetch = useCallback(() => {
    refetchDueReviews()
    refetchAllMemories()
  }, [refetchDueReviews, refetchAllMemories])

  const { mutate: reviewMemory } = useMutation({
    mutationKey: [MemoryServices.review.key],
    mutationFn: MemoryServices.review.fn,
    onSuccess: () => refetch()
  })

  const { mutate: initializeMemories } = useMutation({
    mutationKey: [MemoryServices.initializeMemories.key],
    mutationFn: MemoryServices.initializeMemories.fn,
    onSuccess: () => refetch()
  })

  const { mutate: updateMemories } = useMutation({
    mutationKey: [MemoryServices.updateMemories.key],
    mutationFn: MemoryServices.updateMemories.fn,
    onSuccess: () => refetch()
  })

  const dueReviews = dueReviewsResponse?.data
  const allMemories = allMemoriesResponse?.data

  return {
    dueReviews,
    allMemories,
    reviewMemory,
    initializeMemories,
    updateMemories
  }
}
