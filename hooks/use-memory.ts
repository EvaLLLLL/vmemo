import { useCallback, useEffect, useState } from 'react'
import { MemoryServices, VocabularyServices } from '@/lib/services'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { useAuth } from './use-auth'

export const useMemory = () => {
  const { refetchDueReviews } = useDueReviews()

  const { data: allMemoriesResponse, refetch: refetchAllMemories } = useQuery({
    queryKey: [MemoryServices.getAllMemories.key],
    queryFn: MemoryServices.getAllMemories.fn
  })

  const {
    data: allNotCompletedReviewsResponse,
    refetch: refetchAllNotCompletedReviews
  } = useQuery({
    queryKey: [MemoryServices.getAllNotCompletedReviews.key],
    queryFn: MemoryServices.getAllNotCompletedReviews.fn
  })

  const refetch = useCallback(() => {
    refetchDueReviews()
    refetchAllMemories()
    refetchAllNotCompletedReviews()
  }, [refetchDueReviews, refetchAllMemories, refetchAllNotCompletedReviews])

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

  const allMemories = allMemoriesResponse?.data
  const allNotCompletedReviews = allNotCompletedReviewsResponse?.data

  return {
    allMemories,
    reviewMemory,
    initializeMemories,
    updateMemories,
    allNotCompletedReviews
  }
}

export const useDueReviews = (
  pg: { size: number; offset: number } = { size: 10, offset: 0 }
) => {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState(pg)

  const {
    data: dueReviewsResponse,
    refetch: refetchDueReviews,
    isPlaceholderData
  } = useQuery({
    queryKey: [MemoryServices.getDueReviews.key, pagination],
    queryFn: () => MemoryServices.getDueReviews.fn(pagination),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated
  })

  const currentPage = Math.floor(pagination.offset / pagination.size) + 1
  const hasPreviousPage = currentPage > 1
  const hasNextPage =
    !!dueReviewsResponse?.data?.pagination?.totalPages &&
    currentPage < dueReviewsResponse?.data?.pagination?.totalPages
  const totalPages = dueReviewsResponse?.data?.pagination?.totalPages

  const fetchNextPage = () =>
    hasNextPage &&
    setPagination({
      ...pagination,
      offset: pagination.offset + pagination.size
    })
  const fetchPreviousPage = () =>
    hasPreviousPage &&
    setPagination({
      ...pagination,
      offset: pagination.offset - pagination.size
    })

  // prefetch the next page
  useEffect(() => {
    if (isAuthenticated && !isPlaceholderData && hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: [VocabularyServices.getMyVocabularies.key, pagination],
        queryFn: () => VocabularyServices.getMyVocabularies.fn(pagination)
      })
    }
  }, [hasNextPage, isAuthenticated, isPlaceholderData, pagination, queryClient])

  return {
    dueReviews: dueReviewsResponse?.data?.data,
    refetchDueReviews,
    pagination: dueReviewsResponse?.data?.pagination,
    setPagination,
    currentPage,
    hasPreviousPage,
    hasNextPage,
    totalPages,
    fetchNextPage,
    fetchPreviousPage
  }
}
