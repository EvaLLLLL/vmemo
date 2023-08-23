import jquery from 'jquery'
import CryptoJS from 'crypto-js'

export type TranslationItem = {
  origin: string
  translation: string
  audioUrl?: string
}

export const translate = async (word: string): Promise<TranslationItem> => {
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
    audioUrl:
      result?.basic?.['us-speech'] ||
      result?.basic?.['uk-speech'] ||
      result?.speakUrl
  }
}

function truncate(q: string) {
  var len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}
