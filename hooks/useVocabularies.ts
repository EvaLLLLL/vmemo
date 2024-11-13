import { VocabularyServices } from '@/lib/services'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const useVocabularies = () => {
  // const queryClient = useQueryClient()
  const [currentPageNum, setCurrentPageNum] = useState(1)

  const {
    data,
    refetch: refetchVocabularies
    // isPlaceholderData
  } = useQuery({
    queryKey: [currentPageNum],
    queryFn: () =>
      VocabularyServices.getVocabularies.fn({
        page: currentPageNum,
        size: 10
      }),
    placeholderData: keepPreviousData
  })

  // prefetch the next page
  // useEffect(() => {
  //   if (!isPlaceholderData && !data?.isLastPage) {
  //     queryClient.prefetchQuery({
  //       queryKey: [currentPageNum + 1],
  //       queryFn: () =>
  //         VocabularyServices.getVocabularies.fn({
  //           page: currentPageNum + 1,
  //           size: 10
  //         })
  //     })
  //   }
  // }, [queryClient, currentPageNum, isPlaceholderData, data?.isLastPage])

  const hasPreviousPage = currentPageNum > 1
  const hasNextPage = !!data?.totalPages && currentPageNum < data?.totalPages
  const counts = data?.counts

  const fetchNextPage = () => hasNextPage && setCurrentPageNum((v) => v + 1)
  const fetchPreviousPage = () =>
    hasPreviousPage && setCurrentPageNum((v) => v - 1)

  return {
    vocabularies: data?.vocabularies,
    counts,
    refetchVocabularies,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage
  }
}
