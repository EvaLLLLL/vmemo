import { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { MemoryError } from '@/app/api/errors/memory-error'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const userJwt = await verifyAuth(token!)

  const url = new URL(req.url)
  const offset = parseInt(url.searchParams.get('offset') || '0', 10)
  const size = parseInt(url.searchParams.get('size') || '10', 10)

  try {
    const dueReviews = await MemoryController.getDueReviews(
      userJwt.id as number,
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
