import { ApiResponse } from '@/app/api/responses/api-response'

import { checkAuth } from '@/lib/next-auth'

export async function GET() {
  const user = await checkAuth()

  if (!user) {
    return ApiResponse.unauthorized()
  }

  return ApiResponse.success(user)
}
