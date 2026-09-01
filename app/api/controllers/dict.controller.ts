import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { HttpStatusCode } from 'axios'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { DictError } from '@/app/api/errors/dict-error'
import { WordSchema, type IWord } from '@/types/dict'

const MODEL = 'claude-opus-5'

const SYSTEM =
  'You are a professional English-Chinese dictionary. ' +
  'Always give IPA phonetics. ' +
  'If the input cannot be mapped to a valid English word, set exists to false, ' +
  'return empty entries, and suggest up to 3 similar valid English words. ' +
  'Give one example sentence per part of speech.'

const isChinese = (input: string) => /[一-鿿]/.test(input)

const client = new Anthropic()

export class DictController {
  /**
   * Looks a word up, using the global Vocabulary table as the definition cache:
   * a word is only ever sent to the model once, no matter how many users study it.
   */
  static async getDict(q: string): Promise<IWord | null> {
    const query = q.trim().toLowerCase()
    if (!query) return null

    const cached = await prisma.vocabulary.findUnique({
      where: { word: query },
      select: { definition: true }
    })
    if (cached?.definition) return cached.definition as unknown as IWord

    const word = await this.lookup(query)

    // Misses aren't cached: a typo shouldn't occupy a row, and the model may
    // resolve the same input differently once the user corrects it.
    if (!word.exists) return word

    const key = word.word.trim().toLowerCase()
    const definition = word as unknown as Prisma.InputJsonValue

    await prisma.vocabulary.upsert({
      where: { word: key },
      create: { word: key, translation: word.translation, definition },
      update: { translation: word.translation, definition }
    })

    return word
  }

  private static async lookup(query: string): Promise<IWord> {
    const prompt = isChinese(query)
      ? `The user provided the Chinese word or phrase "${query}". Find its primary English equivalent, then return a full dictionary entry for that English word.`
      : `Look up the English word "${query}".`

    try {
      const response = await client.messages.parse({
        model: MODEL,
        max_tokens: 16000,
        // A dictionary entry is a lookup, not a reasoning problem.
        output_config: { effort: 'low', format: zodOutputFormat(WordSchema) },
        system: SYSTEM,
        messages: [{ role: 'user', content: prompt }]
      })

      if (response.stop_reason === 'refusal') {
        throw new DictError(
          'The model declined to define this word',
          'DICT_REFUSED',
          HttpStatusCode.UnprocessableEntity
        )
      }

      if (!response.parsed_output) {
        throw new DictError(
          'Dictionary lookup returned no result',
          'DICT_EMPTY_RESULT',
          HttpStatusCode.BadGateway
        )
      }

      return response.parsed_output
    } catch (error) {
      if (error instanceof DictError) throw error
      throw this.toDictError(error)
    }
  }

  private static toDictError(error: unknown): DictError {
    if (error instanceof Anthropic.AuthenticationError) {
      return new DictError(
        'Dictionary provider rejected the API key',
        'DICT_AUTH_ERROR',
        HttpStatusCode.InternalServerError
      )
    }
    if (error instanceof Anthropic.RateLimitError) {
      return new DictError(
        'Dictionary is busy, please try again shortly',
        'DICT_RATE_LIMITED',
        HttpStatusCode.TooManyRequests
      )
    }
    if (error instanceof Anthropic.APIError) {
      return new DictError(
        'Dictionary lookup failed',
        'DICT_UPSTREAM_ERROR',
        HttpStatusCode.BadGateway
      )
    }
    return new DictError(
      'Dictionary lookup failed',
      'DICT_UNKNOWN_ERROR',
      HttpStatusCode.InternalServerError
    )
  }
}
