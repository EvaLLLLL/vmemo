export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createJWTToken, hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data?.name || !data?.email || !data?.password) {
      return new NextResponse(JSON.stringify({ message: 'invalid fields' }))
    }

    const user = await prisma.user.findFirst({
      where: { name: data?.name }
    })

    if (user?.id) {
      return new NextResponse(
        JSON.stringify({ message: 'user already exists' }),
        { status: 500 }
      )
    }

    const hashedPassword = await hashPassword(data.password)

    await prisma.user.create({
      data: {
        name: data.name,
        password: hashedPassword,
        email: data.email
      }
    })

    const jwt = await createJWTToken(data)

    return new NextResponse(
      JSON.stringify({ message: 'successfully register' }),
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=${jwt}; Path=/; HttpOnly; Secure; SameSite=Strict`
        }
      }
    )
  } catch (e) {
    return new NextResponse(JSON.stringify({ message: JSON.stringify(e) }))
  }
}
