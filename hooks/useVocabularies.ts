import { VocabularyServices } from '@/lib/services'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useVocabularies = () => {
  const { data: vocabularies, refetch: refetchVocabularies } = useQuery({
    queryKey: [VocabularyServices.getVocabularies.key],
    queryFn: VocabularyServices.getVocabularies.fn
  })

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

  return { saveWords, deleteWord, vocabularies }
}
