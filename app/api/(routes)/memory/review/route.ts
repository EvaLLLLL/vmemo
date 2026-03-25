import { MemoryError } from '@/app/api/errors/memory-error'
import { NextRequest } from 'next/server'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data?.sessionId || !data?.userId || !data?.vocabularyId) {
      return ApiResponse.badRequest(
        'sessionId, userId, and vocabularyId are required'
      )
    }

    if (typeof data.isCorrect !== 'boolean') {
      return ApiResponse.badRequest('isCorrect must be a boolean')
    }

    const result = await MemoryController.review({
      sessionId: data.sessionId,
      userId: data.userId,
      vocabularyId: data.vocabularyId,
      isCorrect: data.isCorrect
    })

    return ApiResponse.success(result)
  } catch (error) {
    if (error instanceof MemoryError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }

    console.error('Review error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
