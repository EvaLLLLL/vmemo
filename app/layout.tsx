import './globals.scss'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import Navigations from '@/components/Navigation'

const openSans = Open_Sans({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-open-sans'
})

export const metadata: Metadata = {
  title: 'Vmemo',
  description: 'Learn English efficiently.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <div className='h-screen flex flex-col'>
          <Navigations />
          {children}
        </div>
      </body>
    </html>
  )
}
