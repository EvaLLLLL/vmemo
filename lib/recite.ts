import { getIsSentence } from '@/lib/string'

export function recite(word: string) {
  if (word.length && !getIsSentence(word)) {
    const audioPlayer = new Audio(
      `https://dict.youdao.com/dictvoice?type=0&audio=${word}`
    )
    audioPlayer.play()
  }
}
