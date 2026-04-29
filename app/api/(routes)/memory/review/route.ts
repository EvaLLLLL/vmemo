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

    const memoryId = data?.memoryId
    const remembered = data?.remembered

    if (
      typeof memoryId !== 'number' ||
      !Number.isInteger(memoryId) ||
      typeof remembered !== 'boolean'
    ) {
      return ApiResponse.badRequest(
        'memoryId (integer) and remembered (boolean) are required'
      )
    }

    const result = await MemoryController.reviewFromClient(user.id, {
      memoryId,
      remembered
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
