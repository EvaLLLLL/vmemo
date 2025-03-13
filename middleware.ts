import { auth } from '@/lib/next-auth'
import { protectedRoutes } from '@/config/routes'

export default auth((req) => {
  if (
    !req.auth &&
    (protectedRoutes.includes(req.nextUrl.pathname) ||
      req.nextUrl.pathname.startsWith('/community/'))
  ) {
    return Response.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: [
    '/((?!api|api/dict|_next/static|_next/image|favicon.ico|.*\\.png$).*)'
  ]
}
