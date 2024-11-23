import { NextResponse, NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'

const clientSideProtectedPath = ['/', '/flashcard', '/vocabulary']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const isProtectedRoute = clientSideProtectedPath.includes(
    request.nextUrl.pathname
  )

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/api')) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'authentication required' }),
        { status: 401 }
      )
    }

    try {
      await verifyAuth(token)
      return NextResponse.next()
    } catch (_) {
      return new NextResponse(JSON.stringify({ message: 'invalid token' }), {
        status: 401
      })
    }
  }

  const response = NextResponse.next()

  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET,DELETE,PATCH,POST,PUT'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
