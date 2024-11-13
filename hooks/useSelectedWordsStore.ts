import { create } from 'zustand'
import { EcdictServices } from '@/lib/services'
import { ITranslationItem } from '@/types/vocabulary'

interface SelectedWordsStore {
  isAutoSpeak: boolean
  setIsAutoSpeak: (v: boolean) => void

  translatedWords?: ITranslationItem[]
  addTranslatedWord: (plain: string) => Promise<ITranslationItem | undefined>
  removeTranslatedWord: (plain: string) => void
  purgeTranslatedWords: () => void

  selectedWord?: ITranslationItem
  setSelectedWord: (plain: string) => void
}

export const useSelectedWordsStore = create<SelectedWordsStore>()((set) => {
  return {
    isAutoSpeak: false,
    translatedWords: undefined,
    selectedWord: undefined,

    setIsAutoSpeak: (v) => set(() => ({ isAutoSpeak: v })),
    addTranslatedWord: async (plain) => {
      const formattedWord = plain?.trim()
      if (!formattedWord) return undefined

      const ydRes = await EcdictServices.ydTranslate.fn(formattedWord)
      const ecdictRes = await EcdictServices.ecTranslate.fn(formattedWord)
      const isSentence = (plain?.split(' ').length || 0) >= 10

      const result: ITranslationItem = {
        isSentence,
        origin: formattedWord,
        audio: ydRes.audio || ecdictRes.audio,
        translation:
          ecdictRes?.translation?.replaceAll(/\\n/g, '; ') || ydRes.translation
      }

      set((state) => {
        const stored = !!state.translatedWords?.find((v) => v.origin === plain)
        if (stored) return {}

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
