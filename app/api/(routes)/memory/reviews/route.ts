import { MemoryError } from '@/app/api/errors/memory-error'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '../../auth/check'

export async function GET() {
  const user = await checkAuth()

  try {
    const allNotCompletedReviews =
      await MemoryController.getAllNotCompletedReviews(user?.id as string)

    return ApiResponse.success(allNotCompletedReviews)
  } catch (error) {
    if (error instanceof MemoryError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }

    console.error('Get all not completed reviews error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
