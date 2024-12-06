import { ApiResponse } from '@/app/api/responses/api-response'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    cookieStore.delete('token')

    return ApiResponse.success('logout successfully')
  } catch (_) {
    return ApiResponse.apiError('Failed to logout', 'LOGOUT_FAILED')
  }
}
