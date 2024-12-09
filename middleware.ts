import { auth } from '@/lib/next-auth'

const protectedRoutes = ['/', '/flashcards', '/vocabulary']

export default auth((req) => {
  if (!req.auth && protectedRoutes.includes(req.nextUrl.pathname)) {
    return Response.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: [
    '/((?!api|api/dict|api/vocabulary|_next/static|_next/image|.*\\.png$).*)'
  ]
}
