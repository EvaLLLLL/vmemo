export { auth as middleware } from '@/lib/next-auth'

export const config = {
  matcher: [
    '/((?!api|api/dict|api/vocabulary|_next/static|_next/image|.*\\.png$).*)'
  ]
}
