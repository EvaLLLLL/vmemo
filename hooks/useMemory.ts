import { useEffect, useMemo, useState } from 'react'
import { useVocabularies } from './useVocabularies'
import { useVocabularyActions } from './useVocabularyActions'

export const useMemory = () => {
  const { vocabularies: data, fetchNextPage } = useVocabularies()
  const { addMemory, reduceMemory } = useVocabularyActions()

  const [addIds, setAddIds] = useState<number[]>([])
  const [reduceIds, setReduceIds] = useState<number[]>([])

  const [currentIndex, setCurrentIndex] = useState(0)

  const vocabularies = data?.filter((v) => v.level < 3)

  useEffect(() => {
    if (vocabularies?.length) {
      setCurrentIndex(0)
    }
  }, [vocabularies?.length])

  const currrentVocabulary = useMemo(
    () => vocabularies?.[currentIndex],
    [currentIndex, vocabularies]
  )

  const isLast = useMemo(
    () => !!vocabularies?.length && currentIndex === vocabularies?.length - 1,
    [currentIndex, vocabularies?.length]
  )

  const isSummary = useMemo(() => currentIndex === -1, [currentIndex])

  const remember = async () => {
    if (!currrentVocabulary || !vocabularies?.length) return
    setAddIds([...addIds, currrentVocabulary.id])

    if (isLast) {
      setCurrentIndex(-1)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const forget = async () => {
    if (!currrentVocabulary || !vocabularies?.length) return
    setReduceIds([...reduceIds, currrentVocabulary.id])

    if (isLast) {
      setCurrentIndex(-1)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const submit = async () => {
    if (addIds.length) {
      await addMemory(addIds)
    }

    if (reduceIds.length) {
      await reduceMemory(reduceIds)
    }

    fetchNextPage()
  }

  return {
    vocabularies,
    currrentVocabulary,
    remember,
    forget,
    fetchNextPage,
    isLast,
    submit,
    isSummary
  }
}
