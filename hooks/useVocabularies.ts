import { useState, useEffect } from 'react'
import { VocabularyServices } from '@/lib/services'
import {
  keepPreviousData,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'

const defaultPagination = {
  level: -1,
  pageIndex: 1,
  size: 10
}

export const useVocabularies = (pg?: {
  level: number
  pageIndex: number
  size: number
}) => {
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState(pg || defaultPagination)

  const {
    data,
    refetch: refetchVocabularies,
    isPlaceholderData
  } = useQuery({
    queryKey: [VocabularyServices.getVocabularies.key, pagination],
    queryFn: () =>
      VocabularyServices.getVocabularies.fn({
        size: pagination.size,
        level: pagination.level,
        page: pagination.pageIndex
      }),
    placeholderData: keepPreviousData
  })

  // prefetch the next page
  useEffect(() => {
    if (!isPlaceholderData && !data?.isLastPage) {
      queryClient.prefetchQuery({
        queryKey: [VocabularyServices.getVocabularies.key, pagination],
        queryFn: () =>
          VocabularyServices.getVocabularies.fn({
            size: pagination.size,
            level: pagination.level,
            page: pagination.pageIndex
          })
      })
    }
  }, [data?.isLastPage, isPlaceholderData, pagination, queryClient])

  const hasPreviousPage = pagination.pageIndex > 1
  const hasNextPage =
    !!data?.pageCount && pagination.pageIndex < data?.pageCount
  const counts = data?.counts
  const pageCount = data?.pageCount

  const fetchNextPage = () =>
    hasNextPage &&
    setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })
  const fetchPreviousPage = () =>
    hasPreviousPage &&
    setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })

  return {
    vocabularies: data?.vocabularies,
    counts,
    refetchVocabularies,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    pageCount,
    setPagination,
    pagination
  }
}
