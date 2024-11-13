import { MemoryServices, VocabularyServices } from '@/lib/services'
import { useMutation } from '@tanstack/react-query'
import { useVocabularies } from './useVocabularies'

export const useVocabularyActions = () => {
  const { refetchVocabularies } = useVocabularies()

  const { mutate: saveWords } = useMutation({
    mutationKey: [VocabularyServices.saveVocabularies.key],
    mutationFn: VocabularyServices.saveVocabularies.fn,
    onSuccess: () => refetchVocabularies()
  })

  const { mutate: deleteWord } = useMutation({
    mutationKey: [VocabularyServices.deleteWord.key],
    mutationFn: VocabularyServices.deleteWord.fn,
    onSuccess: () => refetchVocabularies()
  })

  const { mutate: addMemory } = useMutation({
    mutationKey: [MemoryServices.addMemory.key],
    mutationFn: MemoryServices.addMemory.fn,
    onSuccess: () => refetchVocabularies()
  })

  const { mutate: reduceMemory } = useMutation({
    mutationKey: [MemoryServices.reduceMemory.key],
    mutationFn: MemoryServices.reduceMemory.fn,
    onSuccess: () => refetchVocabularies()
  })

  return { saveWords, deleteWord, addMemory, reduceMemory }
}
