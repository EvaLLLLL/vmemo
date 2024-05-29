import jquery from 'jquery'
import CryptoJS from 'crypto-js'

export type YdTranslationItem = {
  origin: string
  translation: string
  audioUrl?: string
  mTerminalDictUtl?: string | undefined
}

export const ydTranslate = async (word: string): Promise<YdTranslationItem> => {
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
      result?.speakUrl,
    mTerminalDictUtl: result?.mTerminalDict?.url || result?.webdict?.url
  }
}

function truncate(q: string) {
  var len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}
