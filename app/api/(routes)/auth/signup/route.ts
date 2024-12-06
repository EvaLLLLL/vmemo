export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { createJWTToken, hashPassword } from '@/lib/auth'
import { ApiResponse } from '@/app/api/responses/api-response'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data?.name || !data?.email || !data?.password) {
      return ApiResponse.badRequest('name, email, and password are required')
    }

    let user = await prisma.user.findFirst({
      where: { name: data?.name }
    })

    if (user?.id) {
      return ApiResponse.badRequest('name already exists')
    }

    const hashedPassword = await hashPassword(data.password)

    user = await prisma.user.create({
      data: {
        name: data.name,
        password: hashedPassword,
        email: data.email
      }
    })

    const jwt = await createJWTToken(user)

    return ApiResponse.success({}, 'successfully register', {
      headers: {
        'Set-Cookie': `token=${jwt}; Path=/; HttpOnly; Secure; SameSite=Strict`
      }
    })
  } catch (e) {
    return ApiResponse.apiError(JSON.stringify(e))
  }
}
