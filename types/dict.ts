export interface IBaiduDict {
  dict: IDict
  dst: string
  dst_tts: string
  src: string
  src_tts: string
}

export interface IDict {
  lang: string
  word_result: WordResult
}

interface WordResult {
  edict: Edict
  zdict: string
  simple_means: SimpleMeans
  common: Common
  high_core: number
}

interface Common {
  text: string
  from: string
}

interface Edict {
  item: Item[]
  word: string
}

interface Item {
  tr_group: TrGroup[]
  pos: string
}

interface TrGroup {
  tr: string[]
  example: string[]
  similar_word: string[]
}

interface SimpleMeans {
  word_name: string
  from: string
  word_means: string[]
  exchange: Exchange
  tags: Tags
  memory_skill: string
  symbols: Symbol[]
  derivative: Derivative[]
}

interface Derivative {
  tag: string
  data: DerivativeDatum[]
}

interface DerivativeDatum {
  tag: string
  data?: DatumDatum[]
  p?: string
  p_text?: string
}

interface DatumDatum {
  text: string
  canTrans: string
}

interface Exchange {
  word_third: string[]
  word_ing: string[]
  word_done: string[]
  word_past: string[]
}

interface Symbol {
  ph_en: string
  ph_am: string
  parts: Part[]
  ph_other: string
}

interface Part {
  part: string
  means: string[]
}

interface Tags {
  core: string[]
  other: string[]
}
