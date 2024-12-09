import { NextRequest } from 'next/server'
import { MemoryError } from '@/app/api/errors/memory-error'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'
import { auth } from '@/lib/next-auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id as string

  const url = new URL(req.url)
  const offset = parseInt(url.searchParams.get('offset') || '0', 10)
  const size = parseInt(url.searchParams.get('size') || '10', 10)

  try {
    const dueReviews = await MemoryController.getDueReviews(
      userId,
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
