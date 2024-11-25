import { TVocabulary } from '@/types/vocabulary'

export const defaultTranslatedWords = [
  { origin: 'allegory', translation: 'n. 寓言' },
  { origin: 'aver', translation: 'vt. 断言, 坚称\\n[法] 立证, 证明, 确证' },
  {
    origin: 'baffle',
    translation: 'vt. 困惑, 为难, 使挫折\\nvi. 徒作挣扎\\nn. 迷惑, 挡板'
  },
  { origin: 'contrive', translation: 'v. 发明, 设计, 图谋' },
  { origin: 'enhance', translation: 'vt. 提高, 加强, 增加' },
  { origin: 'exceptional', translation: 'a. 例外的, 异常的, 特别的' },
  {
    origin: 'forthright',
    translation:
      'adv. 直率地, 直接地, 马上, 立即\\na. 直接的, 直率的, 坦白的\\nn. 直路'
  },
  {
    origin: 'heresy',
    translation: 'n. 异端, 异教\\n[法] 异端邪说, 异教, 信奉异教'
  },
  {
    origin: 'impersonal',
    translation:
      'a. 客观的, 和个人无关的, 没有人情味的, 非人称的\\nn. 非人称动词( 或代词)'
  },
  { origin: 'nefarious', translation: 'a. 恶毒的, 极坏的' },
  {
    origin: 'proselytize',
    translation: 'vt. 使改变宗教信仰\\nvi. 劝诱改变宗教信仰'
  },
  { origin: 'querulous', translation: 'a. 抱怨的, 爱发牢骚的, 易怒的' },
  { origin: 'resent', translation: 'vt. 愤恨, 憎恶, 怨恨' },
  { origin: 'rote', translation: 'n. 机械性的背诵, 死记硬背' },
  {
    origin: 'spontaneous',
    translation: 'a. 自然的, 自发的, 未经琢磨的\\n[医] 自发的, 特发的, 自生的'
  },
  { origin: 'tempestuous', translation: 'a. 有暴风雨的, 暴乱的' },
  { origin: 'wide-ranging', translation: 'a. 范围或内容广泛的' }
] as TVocabulary[]

export const defaultSelectedWord = {
  origin: 'allegory',
  translation: 'n. 寓言'
} as TVocabulary
