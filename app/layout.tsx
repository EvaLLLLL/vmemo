import '@/styles/globals.scss'
import { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import { SidebarProvider } from '@/components/SidebarProvider'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(openSans.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ReactQueryProvider>
            <Toaster />
            <SidebarProvider>{children}</SidebarProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
