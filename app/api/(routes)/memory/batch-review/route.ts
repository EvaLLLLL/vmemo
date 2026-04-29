import { MemoryError } from '@/app/api/errors/memory-error'
import { NextRequest } from 'next/server'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '@/lib/next-auth'

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth()

    if (!user) {
      return ApiResponse.unauthorized()
    }

    const data = await req.json()

    if (!Array.isArray(data) || !data.length) {
      return ApiResponse.badRequest(
        'A non-empty array of { memoryId, remembered } is required'
      )
    }

    for (const item of data) {
      if (
        typeof item?.memoryId !== 'number' ||
        !Number.isInteger(item.memoryId) ||
        typeof item?.remembered !== 'boolean'
      ) {
        return ApiResponse.badRequest(
          'Each item must include memoryId (integer) and remembered (boolean)'
        )
      }
    }

    const result = await MemoryController.batchReviewFromClient(user.id, data)

    return ApiResponse.success(result)
  } catch (error) {
    if (error instanceof MemoryError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }

    console.error('Batch review error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
