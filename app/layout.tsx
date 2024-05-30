export const dynamic = 'force-dynamic'

// import Navigations from '@/components/Navigations'
import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
const openSans = Open_Sans({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-open-sans'
})

export const metadata: Metadata = {
  title: 'VMEMO',
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
          {/* <Navigations /> */}
          {children}
        </div>
      </body>
    </html>
  )
}
