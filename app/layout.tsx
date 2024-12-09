import '@/styles/globals.scss'
import { Metadata } from 'next'
import { SidebarProvider } from '@/components/sidebar-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import ReactQueryProvider from '@/components/react-query-provider'
import { fontClasses } from '@/config/fonts'

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
      <body className={fontClasses.default}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <ReactQueryProvider>
            <Toaster />
            <SidebarProvider>{children}</SidebarProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}
