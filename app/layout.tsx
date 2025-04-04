import '@/styles/globals.scss'
import { Metadata } from 'next'
import { SidebarProvider } from '@/components/sidebar-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import ReactQueryProvider from '@/components/react-query-provider'
import { fontClasses } from '@/config/fonts'
import NextAuthProvider from '@/components/next-auth-provider'
import { auth } from '@/lib/next-auth'

export const metadata: Metadata = {
  title: 'Vmemo',
  description: 'Learn English efficiently.'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <NextAuthProvider session={session}>
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
    </NextAuthProvider>
  )
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}
