import { ApiResponse } from '@/app/api/responses/api-response'
import { verifyAuth } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return ApiResponse.unauthorized()
  }

  const payload = await verifyAuth(token)

  if (!payload) {
    return ApiResponse.unauthorized()
  }

  const user = {
    name: payload.name,
    email: payload.email
  }

  return ApiResponse.success(user)
}
