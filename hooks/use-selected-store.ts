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
      const query = word
        .replace(/[^a-zA-Z一-鿿\s'-]/g, '')
        .trim()
        .toLowerCase()

      if (!query) {
        return undefined
      }

      const state = get()
      const stored = state.translatedWords?.find((v) => v.word === query)

      if (stored) {
        set({ selectedWord: stored })
        return stored
      }

      const dict = (await DictServices.translate.fn(query))?.data

      if (!dict?.exists) {
        return undefined
      }

      // 中文 input resolves to an English headword — key the vocabulary on that,
      // so looking the same word up in either language lands on one entry.
      const headword = dict.word.trim().toLowerCase()
      const known = get().translatedWords?.find((v) => v.word === headword)

      if (known) {
        set({ selectedWord: known })
        return known
      }

      const vocabulariesResponse =
        await VocabularyServices.createVocabularies.fn([
          {
            word: headword,
            translation: dict.translation
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
