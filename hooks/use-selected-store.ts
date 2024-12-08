import { create } from 'zustand'
import { Vocabulary } from '@prisma/client'
import { DictServices, VocabularyServices } from '@/lib/services'

interface SelectedWordsStore {
  isAutoSpeak: boolean
  setIsAutoSpeak: (v: boolean) => void

  translatedWords?: Vocabulary[]
  addTranslatedWord: (plain: string) => Promise<Vocabulary | undefined>
  removeTranslatedWord: (plain: string) => void
  purgeTranslatedWords: () => void

  selectedWord?: Vocabulary
  setSelectedWord: (plain: string) => void
}

export const useSelectedWordsStore = create<SelectedWordsStore>()((
  set,
  get
) => {
  return {
    isAutoSpeak: true,
    translatedWords: [],
    selectedWord: undefined,

    setIsAutoSpeak: (v) => set(() => ({ isAutoSpeak: v })),
    addTranslatedWord: async (word) => {
      const plain = word
        .replace(/[^a-zA-Z]/g, '')
        .trim()
        .toLowerCase()

      const state = get()
      const stored = state.translatedWords?.find((v) => v.word === plain)

      if (stored) {
        set({ selectedWord: stored })
        return stored
      }

      const translateResponse = await DictServices.translate.fn(plain)

      if (!translateResponse?.data?.dst) {
        return undefined
      }

      const vocabulariesResponse =
        await VocabularyServices.createVocabularies.fn([
          {
            word: plain,
            translation: translateResponse?.data?.dst
          }
        ])

      if (!vocabulariesResponse?.data?.[0]) {
        return undefined
      }

      // Get fresh state again in case it changed during async operations
      const currentState = get()
      set({
        selectedWord: vocabulariesResponse?.data?.[0],
        translatedWords: [
          vocabulariesResponse?.data?.[0],
          ...(currentState.translatedWords || [])
        ]
      })

      return vocabulariesResponse?.data?.[0]
    },
    removeTranslatedWord: (plain) =>
      set((state) => ({
        translatedWords: state.translatedWords?.filter((w) => w.word !== plain)
      })),
    purgeTranslatedWords: () =>
      set(() => ({
        translatedWords: []
      })),
    setSelectedWord: (plain) => {
      const formattedWord = plain?.trim()
      if (!formattedWord) return
      set((state) => {
        const storedWord = state.translatedWords?.find(
          (w) => w?.word === formattedWord
        )
        return { selectedWord: storedWord }
      })
    }
  }
})
