import { ecTranslate, TranslationItem, ydTranslate } from '@/utils/translate'
import { create } from 'zustand'

interface SelectedWordsStore {
    isAutoSpeak: boolean
    setIsAutoSpeak: (v: boolean) => void

    translatedWords?: TranslationItem[]
    addTranslatedWord: (plain: string) => Promise<TranslationItem | undefined>
    removeTranslatedWord: (plain: string) => void
    purgeTranslatedWords: () => void

    selectedWord?: TranslationItem
    setSelectedWord: (plain: string) => void
}

export const useSelectedWordsStore = create<SelectedWordsStore>()((set) => ({
    isAutoSpeak: false,
    translatedWords: undefined,
    selectedWord: undefined,

    setIsAutoSpeak: (v => set(() => ({ isAutoSpeak: v }))),
    addTranslatedWord: async (plain) => {
        const formattedWord = plain?.trim()
        if (!formattedWord) return undefined

        const ydRes = await ydTranslate(formattedWord)
        const ecdictRes = await ecTranslate(formattedWord)
        const isSentence = (plain?.split(' ').length || 0) >= 10

        const result: TranslationItem = {
            isSentence,
            origin: formattedWord,
            audio: ydRes.audio || ecdictRes.audio,
            translation:
                ecdictRes?.translation?.replaceAll(/\\n/g, '; ') || ydRes.translation
        }

        set(state => {
            const stored = !!state.translatedWords?.find(v => v.origin === plain)
            if (stored) return {}

            return {
                selectedWord: result,
                translatedWords: [result, ...(state.translatedWords || [])]
            }
        })

        return result
    }
    ,
    removeTranslatedWord: (plain) =>
        set(state => ({
            translatedWords: state.translatedWords?.filter(w => w.origin === plain)
        }))
    ,
    purgeTranslatedWords: () =>
        set(() => ({
            translatedWords: []
        }))
    ,
    setSelectedWord: (plain) => {
        const formattedWord = plain?.trim()
        if (!formattedWord) return
        set(state => {
            const storedWord = state.translatedWords?.find((w) => w?.origin === formattedWord)
            return { selectedWord: storedWord }
        })
    }
}))