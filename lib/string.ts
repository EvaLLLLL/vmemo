export function getIsSentence(s: string) {
  return (s?.split(' ').length || 0) >= 10
}
