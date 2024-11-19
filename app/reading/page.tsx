'use client'

import { useState } from 'react'
import { SelectedVocabularies } from '@/components/SelectedVocabularies'
import { useSelectedWordsStore } from '@/hooks/useSelectedWordsStore'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export default function Reading() {
  const { addTranslatedWord, isAutoSpeak } = useSelectedWordsStore()

  const onSelectWord = async (word?: string) => {
    if (!word) return

    const result = await addTranslatedWord(word)

    if (result?.audio && !result?.isSentence && isAutoSpeak) {
      const audioPlayer = new Audio(result.audio)
      audioPlayer.play()
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center overflow-hidden align-middle">
      <div className="flex size-full overflow-hidden">
        <ReadingText onSelectWord={onSelectWord} />
        <SelectedVocabularies />
      </div>
    </div>
  )
}

const ReadingText: React.FC<{
  onSelectWord: (word?: string) => void
}> = ({ onSelectWord }) => {
  const [isEdit, setIsEdit] = useState(true)
  const [textContent, setTextContent] = useState('')

  return (
    <div className="size-full break-words bg-slate-100 p-8">
      <div className="relative h-full pt-6">
        <div className="absolute -top-5 flex w-full items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Switch
              id="auto-speak"
              checked={isEdit}
              onCheckedChange={(e) => {
                setIsEdit(e)
              }}
            />
            <Label
              htmlFor="airplane-mode"
              className={isEdit ? 'text-slate-500' : 'text-slate-400'}>
              {isEdit ? 'Editing' : 'Reading'}
            </Label>
          </div>
        </div>
        {isEdit ? (
          <div className="flex size-full flex-col gap-y-2">
            <Textarea
              tabIndex={0}
              autoFocus
              placeholder="Type your passage here"
              className="h-full flex-1 resize-none"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
            <Button
              disabled={!textContent}
              onClick={() => textContent && setIsEdit(false)}
              className="w-full">
              Start Reading
            </Button>
          </div>
        ) : (
          <div
            className="size-full overflow-y-auto whitespace-pre-wrap break-words p-8 pb-20 outline-2 outline-transparent selection:bg-teal-200"
            onMouseUp={() => {
              onSelectWord(window?.getSelection()?.toString())
            }}>
            {textContent}
          </div>
        )}
      </div>
    </div>
  )
}
