'use client'

import { useState } from "react"
import { SelectedVocabularies } from "@/components/SelectedVocabularies"
import { useSelectedWordsStore } from "@/store/selectedWords"

export default function Ecdict() {
    const { isAutoSpeak, addTranslatedWord } = useSelectedWordsStore()

    const onSelectWord = async (word?: string) => {
        if (!word) return
        const translated = await addTranslatedWord(word)

        if (translated?.audio && !translated?.isSentence && isAutoSpeak) {
            const audioPlayer = new Audio(translated.audio)
            audioPlayer.play()
        }
    }

    return <div>
        <SearchDict onSelectWord={onSelectWord} />
        <SelectedVocabularies isDict />
    </div>
}

const SearchDict: React.FC<{
    onSelectWord: (word?: string) => void
}> = ({ onSelectWord }) => {
    const [value, setValue] = useState('')
    const onEnter = () => {
        onSelectWord(value)
        setValue('')
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 px-4 max-h-16 gap-y-2 flex-shrink-0">
            <input
                autoFocus
                tabIndex={0}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.code === 'Enter' && onEnter()}
                className="w-full bg-stale-100 px-2 py-1 border-2 outline-none border-orange-100 focus:border-teal-400 transition-colors duration-200 rounded"
            />
        </div>
    )
}
