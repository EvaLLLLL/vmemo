import { VocabularyServices } from '@/lib/services'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useVocabularies = () => {
  const { data: vocabularies, refetch: refetchVocabularies } = useQuery({
    queryKey: [VocabularyServices.getVocabularies.key],
    queryFn: VocabularyServices.getVocabularies.fn
  })

  const { mutate: save } = useMutation({
    mutationKey: [VocabularyServices.saveVocabularies.key],
    mutationFn: VocabularyServices.saveVocabularies.fn,
    onSuccess: () => refetchVocabularies()
  })

  return { save, vocabularies }
}
