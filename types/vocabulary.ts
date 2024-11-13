import { Vocabulary } from '@prisma/client'

export interface ITranslationItem {
  origin: string
  translation: string
  audio?: string
  isSentence?: boolean
}

export type TVocabulary = Vocabulary & { level: number }
