import { useEffect, useMemo, useState } from 'react'
import { useVocabularies } from './useVocabularies'
import { useVocabularyActions } from './useVocabularyActions'

export const useMemory = () => {
  const { vocabularies, refetchVocabularies } = useVocabularies()
  const { addMemory, reduceMemory } = useVocabularyActions()

  const [addIds, setAddIds] = useState<number[]>([])
  const [reduceIds, setReduceIds] = useState<number[]>([])

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (vocabularies?.length) {
      setCurrentIndex(0)
    }
  }, [vocabularies?.length])

  const currrentVocabulary = useMemo(
    () => vocabularies?.[currentIndex],
    [currentIndex, vocabularies]
  )

  const preVocabulary = useMemo(() => {
    if (currentIndex === 0) {
      return undefined
    }
    return vocabularies?.[currentIndex]
  }, [currentIndex, vocabularies])

  const nextVocabulary = useMemo(() => {
    if (currentIndex + 1 === vocabularies?.length) {
      return undefined
    }
    return vocabularies?.[currentIndex + 1]
  }, [currentIndex, vocabularies])

  const isSummary = useMemo(() => currentIndex === -1, [currentIndex])

  const remember = async () => {
    if (!currrentVocabulary || !vocabularies?.length) return
    setAddIds([...addIds, currrentVocabulary.id])

    const isLast =
      !!vocabularies?.length && currentIndex === vocabularies?.length - 1

    if (isLast) {
      setCurrentIndex(-1)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const forget = async () => {
    if (!currrentVocabulary || !vocabularies?.length) return
    setReduceIds([...reduceIds, currrentVocabulary.id])

    const isLast =
      !!vocabularies?.length && currentIndex === vocabularies?.length - 1

    if (isLast) {
      setCurrentIndex(-1)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const submit = async () => {
    if (!addIds.length && !reduceIds.length) {
      return
    }

    if (addIds.length) {
      await addMemory(addIds)
    }

    if (reduceIds.length) {
      await reduceMemory(reduceIds)
    }

    await refetchVocabularies()
    setCurrentIndex(0)
  }

  return {
    vocabularies,
    preVocabulary,
    currrentVocabulary,
    nextVocabulary,
    remember,
    forget,
    submit,
    isSummary
  }
}
