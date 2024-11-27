import { create } from 'zustand'
import { EcdictServices } from '@/lib/services'
import { TVocabulary } from '@/types/vocabulary'
import { defaultSelectedWord, defaultTranslatedWords } from '@/config/data'
import { getIsSentence } from '@/lib/string'

interface SelectedWordsStore {
  isAutoSpeak: boolean
  setIsAutoSpeak: (v: boolean) => void

  translatedWords?: TVocabulary[]
  addTranslatedWord: (plain: string) => Promise<TVocabulary | undefined>
  removeTranslatedWord: (plain: string) => void
  purgeTranslatedWords: () => void

  selectedWord?: TVocabulary
  setSelectedWord: (plain: string) => void
}

export const useSelectedWordsStore = create<SelectedWordsStore>()((set) => {
  return {
    isAutoSpeak: true,
    translatedWords: defaultTranslatedWords,
    selectedWord: defaultSelectedWord,

    setIsAutoSpeak: (v) => set(() => ({ isAutoSpeak: v })),
    addTranslatedWord: async (plain) => {
      const formattedWord = plain?.trim()
      if (!formattedWord) return undefined

      const ydRes = await EcdictServices.ydTranslate.fn(formattedWord)
      const ecdictRes = await EcdictServices.ecTranslate.fn(formattedWord)

      const result: TVocabulary = {
        ...ecdictRes,
        isSentence: getIsSentence(plain),
        origin: formattedWord,
        audio: ydRes.audio || ecdictRes.audio || null,
        translation:
          ecdictRes?.translation?.replaceAll(/\\n/g, '; ') || ydRes.translation
      }

      set((state) => {
        const stored = !!state.translatedWords?.find((v) => v.origin === plain)
        if (stored) {
          return { selectedWord: result }
        }

        return {
          selectedWord: result,
          translatedWords: [result, ...(state.translatedWords || [])]
        }
      })

      return result
    },
    removeTranslatedWord: (plain) =>
      set((state) => ({
        translatedWords: state.translatedWords?.filter(
          (w) => w.origin !== plain
        )
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
          (w) => w?.origin === formattedWord
        )
        return { selectedWord: storedWord }
      })
    }
  }
})
