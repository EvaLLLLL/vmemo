import { IWord } from '@/types/dict'

export interface DictExample {
  pos: string
  en: string
  zh: string
  similar?: string
}

export const formatDictResult = (word?: IWord | null) => {
  if (!word?.exists) {
    return {
      simpleMeans: undefined,
      derivatives: undefined,
      examples: undefined,
      phonetic: undefined
    }
  }

  const simpleMeans = word.entries
    .map((e) => `${e.partOfSpeech} ${e.meanings.slice(0, 2).join('，')}`)
    .join('；')

  const examples: DictExample[] = word.entries
    .filter((e) => e.example.en)
    .map((e) => ({
      pos: e.partOfSpeech,
      en: e.example.en,
      zh: e.example.zh,
      similar: e.synonyms.slice(0, 3).join(', ') || undefined
    }))

  return {
    simpleMeans,
    derivatives: word.inflections,
    examples,
    phonetic: word.phonetic
  }
}
