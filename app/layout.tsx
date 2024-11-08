import './globals.scss'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import Navigations from '@/components/Navigation'
import ReactQueryProvider from '@/components/ReactQueryProvider'

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
        <ReactQueryProvider>
          <main className="flex h-screen flex-col">
            <Navigations />
            {children}
          </main>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
