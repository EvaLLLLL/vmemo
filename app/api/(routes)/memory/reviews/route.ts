import { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { MemoryError } from '@/app/api/errors/memory-error'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const userJwt = await verifyAuth(token!)

  try {
    const allNotCompletedReviews =
      await MemoryController.getAllNotCompletedReviews(userJwt.id as number)

    return ApiResponse.success(allNotCompletedReviews)
  } catch (error) {
    if (error instanceof MemoryError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }

    console.error('Get all not completed reviews error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
