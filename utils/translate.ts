import jquery from 'jquery'
import CryptoJS from 'crypto-js'

export interface TranslationItem {
  origin: string
  translation: string
  audio?: string
  isSentence?: boolean
}

export const ydTranslate = async (word: string): Promise<TranslationItem> => {
  const appKey = process.env.NEXT_PUBLIC_YUDAO_APPKEY
  const key = process.env.NEXT_PUBLIC_YUDAO_KEY
  const salt = new Date().getTime()
  const curtime = Math.round(new Date().getTime() / 1000)
  const to = 'zh-CHS'
  const from = 'en'
  const vocabId = false
  const str1 = appKey + truncate(word) + salt + curtime + key
  const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex)

  const result = await jquery.ajax({
    url: 'https://openapi.youdao.com/api',
    type: 'post',
    dataType: 'jsonp',
    data: {
      q: word,
      appKey: appKey,
      salt: salt,
      from: from,
      to: to,
      sign: sign,
      signType: 'v3',
      curtime: curtime,
      vocabId: vocabId
    }
  })

  return {
    origin: word,
    translation:
      result?.basic?.explains?.join('; ') || result?.translation?.[0],
    audio:
      result?.basic?.['us-speech'] ||
      result?.basic?.['uk-speech'] ||
      result?.speakUrl
  }
}

export async function ecTranslate(word: string) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API + `/api/ecdict?word=${word}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 0 }
    }
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

function truncate(q: string) {
  var len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}
