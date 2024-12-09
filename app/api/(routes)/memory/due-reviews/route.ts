import { NextRequest } from 'next/server'
import { MemoryError } from '@/app/api/errors/memory-error'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '../../auth/check'

export async function GET(req: NextRequest) {
  const userId = await checkAuth()

  const url = new URL(req.url)
  const offset = parseInt(url.searchParams.get('offset') || '0', 10)
  const size = parseInt(url.searchParams.get('size') || '10', 10)

  try {
    const dueReviews = await MemoryController.getDueReviews(
      userId as string,
      size,
      offset
    )

    return ApiResponse.success(dueReviews)
  } catch (error) {
    if (error instanceof MemoryError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }

    console.error('Get due reviews error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
