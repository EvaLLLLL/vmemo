export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { comparePassword, createJWTToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    if (!data?.password) {
      return new NextResponse(JSON.stringify({ message: 'pls enter password' }))
    }

    if (!data?.name && !data?.email) {
      return new NextResponse(
        JSON.stringify({ message: 'pls enter name or email' })
      )
    }

    let user
    if (data?.name) {
      user = await prisma.user.findFirst({
        where: { name: data.name }
      })
    }
    if (data?.email) {
      user = await prisma.user.findFirst({
        where: { email: data.email }
      })
    }

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'cannot find user' }))
    }

    const isValid = await comparePassword(data.password, user.password)

    if (!isValid) {
      return new NextResponse(JSON.stringify({ message: 'wrong password' }))
    }

    const jwt = await createJWTToken(user)

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${jwt}; Path=/; HttpOnly; Secure; SameSite=Strict`
      }
    })
  } catch (e) {
    return new NextResponse(JSON.stringify({ message: JSON.stringify(e) }))
  }
}
