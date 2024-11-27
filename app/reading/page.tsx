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
      const audioPlayer = new Audio(
        `https://dict.youdao.com/dictvoice?type=0&audio=${word}`
      )
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
  const [textContent, setTextContent] = useState(
    'Reviving the practice of using elements of popular music in classical composition, an approach that had been in hibernation in the United States during the 1960s, composer Philip Glass (born 1937) embraced the ethos of popular music in his compositions. Glass based two symphonies on music by rock musicians David Bowie and Brian Eno, but the symphonies’ sound is distinctively his. Popular elements do not appear out of place in Glass’s classical music, which from its early days has shared certain harmonies and rhythms with rock music. Yet this use of popular elements has not made Glass a composer of popular music. His music is not a version of popular music packaged to attract classical listeners; it is high art for listeners steeped in rock rather than the classics.'
  )

  return (
    <div className="size-full w-3/5 break-words p-8">
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
              className={isEdit ? 'text-primary' : 'text-muted-foreground'}>
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
            className="size-full overflow-y-auto whitespace-pre-wrap break-words p-8 pb-20 outline-2 outline-transparent selection:bg-primary selection:text-primary-foreground"
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
