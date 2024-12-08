import { cn } from '@/lib/utils'
import { Inter, Open_Sans, Sriracha, Noto_Sans_SC } from 'next/font/google'

const sriracha = Sriracha({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sriracha'
})

const inter = Inter({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter'
})

const notoSansSC = Noto_Sans_SC({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-noto-sans-sc'
})

const openSans = Open_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-open-sans'
})

export const fontClasses = {
  default: sriracha.className,
  reading: cn(
    inter.className,
    openSans.className,
    notoSansSC.className,
    'font-sans'
  )
}
