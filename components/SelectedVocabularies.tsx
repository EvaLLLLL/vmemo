import cn from "@/utils/cn"
import { copyToClipboard } from "@/utils/copy"
import { TranslationItem } from "@/utils/translate"
import { WordItem } from "@/components/WordItem"
import { useSelectedWordsStore } from "@/store/selectedWords"

export const SelectedVocabularies: React.FC<{
    isDict: boolean
}> = ({ isDict }) => {
    // const saveWords = async () => {
    //   await fetch(process.env.NEXT_PUBLIC_API + '/api/vocabulary/save', {
    //     method: 'POST',
    // credentials: 'include',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(selectedWords)
    //   })
    // }

    const { translatedWords, removeTranslatedWord, selectedWord, setSelectedWord, purgeTranslatedWords } = useSelectedWordsStore()

    return (
        <div
            className={cn(
                'px-8 pt-8 pb-4 w-2/5 bg-slate-200',
                isDict && 'w-full flex-1 overflow-hidden'
            )}>
            <div className="relative h-full pt-6">
                <div className="flex flex-col gap-2 h-full overflow-y-auto">
                    {translatedWords?.map((word, index) => (
                        <WordItem
                            key={`${word.origin}-${index}`}
                            word={word}
                            onClick={() => {
                                setSelectedWord(word?.origin)
                                if (word.audio && !word.isSentence) {
                                    const audioPlayer = new Audio(word.audio)
                                    audioPlayer.play()
                                }
                            }}
                            isSelected={word.origin === selectedWord?.origin}
                            onDelete={() =>
                                removeTranslatedWord(word?.origin)
                            }
                        />
                    ))}
                </div>
                <div className="w-full absolute -top-5 flex items-center justify-between">
                    <button
                        onClick={() => purgeTranslatedWords()}
                        className="rounded-full py-1 px-4 bg-teal-200 hover:bg-teal-100">
                        clear
                    </button>
                    {/* <button
            onClick={saveWords}
            className="rounded-full py-1 px-4 bg-teal-200 hover:bg-teal-100">
            save
          </button> */}
                    <button
                        onClick={async () => {
                            const content = translatedWords?.reverse()
                                .map((w) => `${w.origin}\t${w.translation}`)
                                .join('\r')

                            if (!content) return

                            copyToClipboard(content, () => console.log('Copied: ', content))
                        }}
                        className="rounded-full py-1 px-4 bg-teal-200 hover:bg-teal-100">
                        copy {translatedWords?.length || ''}
                    </button>
                </div>
            </div>
        </div>
    )
}