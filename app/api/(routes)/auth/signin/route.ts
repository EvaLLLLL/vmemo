export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { comparePassword, createJWTToken } from '@/lib/auth'
import { ApiResponse } from '@/app/api/responses/api-response'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    if (!data?.password) {
      return ApiResponse.badRequest('password is required')
    }

    if (!data?.name && !data?.email) {
      return ApiResponse.badRequest('name or email is required')
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
      return ApiResponse.notFound('cannot find user')
    }

    const isValid = await comparePassword(data.password, user.password)

    if (!isValid) {
      return ApiResponse.unauthorized()
    }

    const jwt = await createJWTToken(user)

    return ApiResponse.success({}, 'login successfully', {
      headers: {
        'Set-Cookie': `token=${jwt}; Path=/; HttpOnly; Secure; SameSite=Strict`
      }
    })
  } catch (e) {
    return ApiResponse.apiError(JSON.stringify(e))
  }
}
