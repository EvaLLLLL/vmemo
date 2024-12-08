'use client'

import { useState } from 'react'
import { SelectedVocabularies } from '@/components/selected-vocabularies'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { recite } from '@/lib/recite'
import { useSelectedWordsStore } from '@/hooks/use-selected-store'
import { fontClasses } from '@/config/fonts'
import { cn } from '@/lib/utils'
import { Pencil, BookOpen } from 'lucide-react'

export default function Reading() {
  const { addTranslatedWord, isAutoSpeak } = useSelectedWordsStore()

  const onSelectWord = async (word?: string) => {
    if (!word) return

    await addTranslatedWord(word)

    if (isAutoSpeak) recite(word)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden sm:flex-row">
      <div className="h-full sm:w-[600px]">
        <ReadingText onSelectWord={onSelectWord} />
      </div>
      <div className="h-full flex-1">
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
    'Reviving the practice of using elements of popular music in classical composition, an approach that had been in hibernation in the United States during the 1960s, composer Philip Glass (born 1937) embraced the ethos of popular music in his compositions.\nGlass based two symphonies on music by rock musicians David Bowie and Brian Eno, but the symphonies’ sound is distinctively his. Popular elements do not appear out of place in Glass’s classical music, which from its early days has shared certain harmonies and rhythms with rock music.\nYet this use of popular elements has not made Glass a composer of popular music. His music is not a version of popular music packaged to attract classical listeners; it is high art for listeners steeped in rock rather than the classics.'
  )

  return (
    <div className="size-full break-words p-8">
      <div className="relative h-full pt-6">
        <div className="absolute -top-5 flex w-full items-center justify-between">
          <div className="flex items-center gap-x-2">
            <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
              <Switch
                id="switch-isEdit"
                checked={isEdit}
                onCheckedChange={setIsEdit}
                className="peer absolute inset-0 h-[inherit] w-auto data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
              />
              <span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=checked]:text-muted-foreground/70">
                <BookOpen size={16} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=unchecked]:text-muted-foreground/70">
                <Pencil size={16} strokeWidth={2} aria-hidden="true" />
              </span>
            </div>
            <Label
              htmlFor="switch-isEdit"
              className={cn(
                'text-xl',
                isEdit ? 'text-primary' : 'text-muted-foreground'
              )}>
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
              className={cn(
                'h-full flex-1 resize-none text-lg',
                fontClasses.reading
              )}
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
            className={cn(
              'size-full overflow-y-auto text-lg whitespace-pre-wrap break-words p-8 pb-20 outline-2 outline-transparent selection:bg-primary selection:text-primary-foreground select-none',
              fontClasses.reading
            )}>
            {textContent.split(/\n/).map((paragraph, pIndex) => (
              <div key={`p-${pIndex}`} className="mb-2 flex">
                <span className="mr-2 mt-1 select-none font-mono text-sm text-muted-foreground/60">
                  {String(pIndex + 1).padStart(2, '0')}.
                </span>
                <div className="flex flex-1 flex-wrap gap-x-1">
                  {paragraph.split(/\s+/).map((word, index) => (
                    <span
                      key={`${pIndex}-${index}`}
                      className="cursor-pointer rounded px-0.5 transition-colors duration-200 hover:bg-primary/30"
                      onClick={() => onSelectWord(word)}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
