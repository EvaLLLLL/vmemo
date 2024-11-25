import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: 'authentication required' }),
      { status: 401 }
    )
  }

  const payload = await verifyAuth(token)

  if (!payload) {
    return new NextResponse(
      JSON.stringify({ message: 'authentication required' }),
      { status: 401 }
    )
  }

  const user = {
    name: payload.name,
    email: payload.email
  }

  return new NextResponse(JSON.stringify(user), { status: 200 })
}
