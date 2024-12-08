import { Memory, User, Vocabulary } from '@prisma/client'
import { axiosInstance } from '@/lib/axios'
import { IBaiduDict } from '@/types/dict'

interface IApiResponse<T> {
  data?: T
  message?: string
  status?: number
}

// Auth Types
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

// Vocabulary Types
interface IVocabularyCreate {
  word: string
  translation: string
}

interface IVocabularyUpdate {
  id: number
  translation: string
}

interface IGetVocabulariesParams {
  offset: number
  size: number
}

interface IPagination {
  page: number
  size: number
  total: number
  totalPages: number
}

interface IDueReviewsResponse {
  data: (Memory & { vocabulary: Vocabulary })[]
  pagination: IPagination
}

interface IGetAllNotCompletedReviews {
  [date: string]: (Memory & { vocabulary: Vocabulary })[]
}

interface IVocabularyResponse {
  data: (Vocabulary & { memories?: Memory[] })[]
  pagination: IPagination
}

// Memory Types
interface IMemoryReview {
  memoryId: number
  remembered: boolean
}

interface IMemoryUpdate {
  vocabularyIds: number[]
  action: 'add' | 'reduce'
}

// Service Definitions
export const AuthServices = {
  getUser: {
    key: 'AuthServices.check',
    fn: () =>
      axiosInstance
        .get<IApiResponse<User>>('/api/auth/check')
        .then((res) => res.data)
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

export const VocabularyServices = {
  checkVocabularies: {
    key: 'VocabularyServices.checkVocabularies',
    fn: (q: string) =>
      axiosInstance
        .get<IApiResponse<Vocabulary[]>>(`/api/vocabulary/check?q=${q}`)
        .then((res) => res.data)
  },
  getMyVocabularies: {
    key: 'VocabularyServices.getVocabularies',
    fn: (params: IGetVocabulariesParams) =>
      axiosInstance
        .get<IApiResponse<IVocabularyResponse>>('/api/vocabulary', { params })
        .then((res) => res.data)
  },
  createVocabularies: {
    key: 'VocabularyServices.createVocabularies',
    fn: (data: IVocabularyCreate[]) =>
      axiosInstance
        .post<IApiResponse<Vocabulary[]>>('/api/vocabulary', data)
        .then((res) => res.data)
  },
  updateVocabulary: {
    key: 'VocabularyServices.updateVocabulary',
    fn: (data: IVocabularyUpdate) =>
      axiosInstance
        .put<IApiResponse<Vocabulary>>('/api/vocabulary', data)
        .then((res) => res.data)
  },
  deleteVocabulary: {
    key: 'VocabularyServices.deleteVocabulary',
    fn: (ids: number[]) =>
      axiosInstance
        .delete<IApiResponse<Vocabulary>>(`/api/vocabulary?id=${ids.join(',')}`)
        .then((res) => res.data)
  }
}

export const MemoryServices = {
  getAllMemories: {
    key: 'MemoryServices.getAllMemories',
    fn: () =>
      axiosInstance
        .get<IApiResponse<Memory[]>>('/api/memory')
        .then((res) => res.data)
  },
  getAllNotCompletedReviews: {
    key: 'MemoryServices.getAllNotCompletedReviews',
    fn: () =>
      axiosInstance
        .get<IApiResponse<IGetAllNotCompletedReviews>>('/api/memory/reviews')
        .then((res) => res.data)
  },
  getDueReviews: {
    key: 'MemoryServices.getDueReviews',
    fn: (pg: IGetVocabulariesParams) =>
      axiosInstance
        .get<IApiResponse<IDueReviewsResponse>>('/api/memory/due-reviews', {
          params: pg
        })
        .then((res) => res.data)
  },
  initializeMemories: {
    key: 'MemoryServices.initializeMemories',
    fn: (vocabularyIds: number[]) =>
      axiosInstance
        .post<IApiResponse<Memory[]>>('/api/memory/initialize', {
          vocabularyIds
        })
        .then((res) => res.data)
  },
  review: {
    key: 'MemoryServices.review',
    fn: (data: IMemoryReview) =>
      axiosInstance
        .post<IApiResponse<Memory>>('/api/memory/review', data)
        .then((res) => res.data)
  },
  batchReview: {
    key: 'MemoryServices.batchReview',
    fn: (data: IMemoryReview[]) =>
      axiosInstance
        .post<IApiResponse<Memory[]>>('/api/memory/batch-review', data)
        .then((res) => res.data)
  },
  updateMemories: {
    key: 'MemoryServices.updateMemories',
    fn: (data: IMemoryUpdate) =>
      axiosInstance
        .post<IApiResponse<Memory[]>>('/api/memory/update', data)
        .then((res) => res.data)
  },
  getMemoryByWord: {
    key: 'MemoryServices.getMemoryByWord',
    fn: (q: string) =>
      axiosInstance
        .get<
          IApiResponse<Memory & { vocabulary: Vocabulary }>
        >(`/api/memory/word?q=${q}`)
        .then((res) => res.data)
  }
}

export const DictServices = {
  translate: {
    key: 'DictServices.translate',
    fn: (q: string) =>
      axiosInstance
        .get<IApiResponse<IBaiduDict>>(`/api/dict?q=${q}`)
        .then((res) => res.data)
  }
}
