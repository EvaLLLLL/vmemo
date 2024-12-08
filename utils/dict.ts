import { IBaiduDict } from '@/types/dict'

export const formatDictResult = (dictResult?: IBaiduDict) => {
  if (!dictResult)
    return {
      simpleMeans: undefined,
      derivatives: undefined,
      examples: undefined
    }

  const simpleMeans = dictResult?.dict?.word_result?.simple_means?.symbols
    ?.flatMap((s) =>
      s.parts.flatMap((p) => p.part + p.means.slice(0, 2).join(','))
    )
    .join('; ')

  const derivatives = dictResult?.dict?.word_result?.simple_means?.exchange

  // { pos: srting; tr_group: { tr: srting[]; example: string[]; similar_word: srting[] }[] }
  const examples = dictResult?.dict?.word_result?.edict?.item

  return { simpleMeans, derivatives, examples }
}
