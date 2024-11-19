import jquery from 'jquery'
import CryptoJS from 'crypto-js'

import { Memory, User } from '@prisma/client'
import { axiosInstance } from '@/lib/axios'
import { truncate } from '@/utils/string'
import { TVocabulary } from '@/types/vocabulary'

interface ISignupForm {
  name: string
  email?: string
  password: string
}

interface ISigninForm {
  name?: string
  email?: string
  password: string
}

interface IGetVocabulariesParams {
  page: number
  size: number
  level?: number
}

interface IVocabulariesResponse {
  isLastPage: boolean
  pageCount: number
  vocabularies: TVocabulary[]
  counts: {
    totalCount: number
    level0Count: number
    level1Count: number
    level2Count: number
    level3Count: number
    levelLCount: number
  }
}

export const AuthServices = {
  getUser: {
    key: 'AuthServices.check',
    fn: () => axiosInstance.get<User>('/api/auth/check').then((res) => res.data)
  },
  signUp: {
    key: 'AuthServices.signup',
    fn: (data: ISignupForm) => axiosInstance.post('/api/auth/signup', data)
  },
  signIn: {
    key: 'AuthServices.signin',
    fn: (data: ISigninForm) => axiosInstance.post('/api/auth/signin', data)
  },
  logOut: {
    key: 'AuthServices.logOut',
    fn: () => axiosInstance.post('/api/auth/logout')
  }
}

export const EcdictServices = {
  ecTranslate: {
    key: 'EcdictServices.ecTranslate',
    fn: (word: string) =>
      axiosInstance
        .get<TVocabulary>(`/api/ecdict?word=${word}`)
        .then((res) => res.data)
  },
  ydTranslate: {
    key: 'EcdictServices.ydTranslate',
    fn: async (word: string) => {
      const key = process.env.NEXT_PUBLIC_YUDAO_KEY
      const appKey = process.env.NEXT_PUBLIC_YUDAO_APPKEY
      const salt = new Date().getTime()
      const curtime = Math.round(new Date().getTime() / 1000)
      const to = 'zh-CHS'
      const from = 'en'
      const vocabId = false
      const str1 = appKey + truncate(word) + salt + curtime + key
      const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex)

      const data = {
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

      const result = await jquery.ajax({
        url: 'https://openapi.youdao.com/api',
        type: 'post',
        dataType: 'jsonp',
        data
      })

      return {
        origin: word,
        translation:
          result?.basic?.explains?.join('; ') || result?.translation?.[0],
        audio:
          result?.basic?.['us-speech'] ||
          result?.basic?.['uk-speech'] ||
          result?.speakUrl
      } as TVocabulary
    }
  }
}

export const VocabularyServices = {
  getVocabularies: {
    key: 'VocabularyServices.getVocabularies',
    fn: (params: IGetVocabulariesParams) =>
      axiosInstance
        .get<IVocabulariesResponse>('/api/vocabulary/list', { params })
        .then((res) => res.data)
  },
  saveVocabularies: {
    key: 'VocabularyServices.saveVocabularies',
    fn: (data: TVocabulary[]) =>
      axiosInstance.post('/api/vocabulary/save', data)
  },
  deleteWord: {
    key: 'VocabularyServices.deleteWord',
    fn: (data: string) => axiosInstance.post('/api/vocabulary/delete', data)
  }
}

export const MemoryServices = {
  getMemoryList: {
    key: 'MemoryServices.getMemoryList',
    fn: () =>
      axiosInstance.get<Memory[]>('/api/memory/list').then((res) => res.data)
  },
  addMemory: {
    key: 'MemoryServices.addMemory',
    fn: (vocabularyIds: number[]) =>
      axiosInstance.post('/api/memory/update', { vocabularyIds, action: 'add' })
  },
  reduceMemory: {
    key: 'MemoryServices.reduceMemory',
    fn: (vocabularyIds: number[]) =>
      axiosInstance.post('/api/memory/update', {
        vocabularyIds,
        action: 'reduce'
      })
  }
}
