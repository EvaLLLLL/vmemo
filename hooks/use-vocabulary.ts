import { VocabularyServices } from '@/lib/services'
import {
  useQueryClient,
  keepPreviousData,
  useMutation,
  useQuery
} from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

export const useVocabulary = () => {
  const { vocabularies, refetchVocabularies } = useVocabularies()

  const { mutate: createVocabularies, isPending: isCreatingVocabularies } =
    useMutation({
      mutationKey: [VocabularyServices.createVocabularies.key],
      mutationFn: VocabularyServices.createVocabularies.fn,
      onSuccess: () => refetchVocabularies()
    })

  const { mutate: updateVocabulary } = useMutation({
    mutationKey: [VocabularyServices.updateVocabulary.key],
    mutationFn: VocabularyServices.updateVocabulary.fn,
    onSuccess: () => refetchVocabularies()
  })

  const { mutate: deleteVocabulary } = useMutation({
    mutationKey: [VocabularyServices.deleteVocabulary.key],
    mutationFn: VocabularyServices.deleteVocabulary.fn,
    onSuccess: () => refetchVocabularies()
  })

  return {
    vocabularies,
    createVocabularies,
    updateVocabulary,
    deleteVocabulary,
    isCreatingVocabularies
  }
}

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
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState(pg || defaultPagination)

  const {
    data: vocabulariesResponse,
    refetch: refetchVocabularies,
    isPlaceholderData
  } = useQuery({
    queryKey: [VocabularyServices.getVocabularies.key, pagination],
    queryFn: () =>
      VocabularyServices.getVocabularies.fn({
        size: pagination.size,
        page: pagination.pageIndex
      }),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated
  })

  // prefetch the next page
  useEffect(() => {
    if (
      isAuthenticated &&
      !isPlaceholderData &&
      pagination.pageIndex !== vocabulariesResponse?.data?.pagination.totalPages
    ) {
      queryClient.prefetchQuery({
        queryKey: [VocabularyServices.getVocabularies.key, pagination],
        queryFn: () =>
          VocabularyServices.getVocabularies.fn({
            size: pagination.size,
            page: pagination.pageIndex
          })
      })
    }
  }, [
    vocabulariesResponse?.data?.pagination.totalPages,
    isAuthenticated,
    isPlaceholderData,
    pagination,
    queryClient
  ])

  const hasPreviousPage = pagination.pageIndex > 1
  const hasNextPage =
    !!vocabulariesResponse?.data?.pagination.totalPages &&
    pagination.pageIndex < vocabulariesResponse?.data?.pagination.totalPages
  const pageCount = vocabulariesResponse?.data?.pagination.totalPages

  const fetchNextPage = () =>
    hasNextPage &&
    setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })
  const fetchPreviousPage = () =>
    hasPreviousPage &&
    setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })

  return {
    vocabularies: vocabulariesResponse?.data,
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
