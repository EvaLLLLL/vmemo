const copyToClipboard = (text: string, callback: (result: string) => void) => {
  navigator.clipboard.writeText(text).then(
    () => {
      callback('Copied!')
    },
    () => {
      callback('Copy failed!')
    }
  )
}

export { copyToClipboard }
