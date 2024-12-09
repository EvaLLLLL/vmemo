import { checkAuth } from '../check'
import { ApiResponse } from '@/app/api/responses/api-response'

export async function GET() {
  const user = await checkAuth()

  if (!user) {
    return ApiResponse.unauthorized()
  }

  return ApiResponse.success(user)
}
