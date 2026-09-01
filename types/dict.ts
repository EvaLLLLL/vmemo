import { z } from 'zod'

const WordEntrySchema = z.object({
  partOfSpeech: z
    .string()
    .describe('Part of speech, e.g. n. v. adj. adv. prep. conj.'),
  meanings: z
    .array(z.string())
    .describe('Chinese definitions for this part of speech'),
  example: z.object({
    en: z.string().describe('One example sentence in English'),
    zh: z.string().describe('Chinese translation of the example sentence')
  }),
  synonyms: z
    .array(z.string())
    .describe('Up to 3 English synonyms for this sense. Empty array if none.')
})

export const WordSchema = z.object({
  exists: z.boolean().describe('Whether the word exists in English'),
  word: z
    .string()
    .describe(
      'The English headword, lowercased. When the input is Chinese, this is its primary English equivalent — never the Chinese input.'
    ),
  translation: z
    .string()
    .describe('Short Chinese gloss, at most 12 characters, for word lists'),
  phonetic: z
    .string()
    .describe('IPA transcription without slashes, e.g. ˈɛɡzæmpl'),
  inflections: z
    .array(z.string())
    .describe(
      'Inflected forms — plural, third person, gerund, past, past participle. Empty array if the word does not inflect.'
    ),
  suggestions: z
    .array(z.string())
    .describe(
      'Up to 3 similar valid English words if the input does not exist. Empty array if it does.'
    ),
  entries: z
    .array(WordEntrySchema)
    .describe(
      'One entry per part of speech. Empty array if the word does not exist.'
    )
})

export type IWord = z.infer<typeof WordSchema>
