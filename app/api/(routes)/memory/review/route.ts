import { MemoryError } from '@/app/api/errors/memory-error'
import { NextRequest } from 'next/server'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data?.memoryId) {
      return ApiResponse.badRequest('Memory ID is required')
    }

    if (typeof data.remembered !== 'boolean') {
      return ApiResponse.badRequest('Remembered status must be a boolean')
    }

    const result = await MemoryController.review({
      memoryId: data.memoryId,
      remembered: data.remembered
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
