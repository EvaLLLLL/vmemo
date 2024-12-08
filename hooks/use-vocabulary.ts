import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { VocabularyServices } from '@/lib/services'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

export const useVocabulary = () => {
  const { refetchVocabularies } = useVocabularies()

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

  const { mutate: deleteVocabularies } = useMutation({
    mutationKey: [VocabularyServices.deleteVocabulary.key],
    mutationFn: VocabularyServices.deleteVocabulary.fn,
    onSuccess: () => refetchVocabularies()
  })

  return {
    createVocabularies,
    updateVocabulary,
    deleteVocabularies,
    isCreatingVocabularies
  }
}

export const useVocabularies = (
  pg: { size: number; offset: number } = { size: 10, offset: 0 }
) => {
  const { isAuthenticated } = useAuth()
  const [pagination, setPagination] = useState(pg)

  const { data: vocabulariesResponse, refetch: refetchVocabularies } = useQuery(
    {
      queryKey: [VocabularyServices.getMyVocabularies.key, pagination],
      queryFn: () =>
        VocabularyServices.getMyVocabularies.fn({
          size: pagination.size,
          offset: pagination.offset
        }),
      placeholderData: keepPreviousData,
      enabled: isAuthenticated
    }
  )

  const currentPage = Math.floor(pagination.offset / pagination.size) + 1
  const hasPreviousPage = currentPage > 1
  const hasNextPage =
    !!vocabulariesResponse?.data?.pagination.totalPages &&
    currentPage < vocabulariesResponse?.data?.pagination.totalPages
  const totalPages = vocabulariesResponse?.data?.pagination.totalPages

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
  const fetchFirstPage = () =>
    setPagination({
      ...pagination,
      offset: 0
    })
  const fetchLastPage = () => {
    if (!vocabulariesResponse?.data?.pagination?.totalPages) return
    setPagination({
      ...pagination,
      offset:
        (vocabulariesResponse?.data?.pagination?.totalPages - 1) *
        pagination.size
    })
  }

  return {
    vocabularies: vocabulariesResponse?.data?.data,
    refetchVocabularies,
    fetchNextPage,
    fetchPreviousPage,
    fetchFirstPage,
    fetchLastPage,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    totalPages,
    setPagination,
    pagination
  }
}
