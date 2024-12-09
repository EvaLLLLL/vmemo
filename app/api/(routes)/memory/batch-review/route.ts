import { MemoryError } from '@/app/api/errors/memory-error'
import { NextRequest } from 'next/server'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data?.length) {
      return ApiResponse.badRequest('Memory list is required')
    }

    const result = await MemoryController.batchReview(data)

    return ApiResponse.success(result)
  } catch (error) {
    if (error instanceof MemoryError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }

    console.error('Review error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
