import { MemoryError } from '@/app/api/errors/memory-error'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '../auth/check'

export async function GET() {
  const user = await checkAuth()

  try {
    const allMemories = await MemoryController.getAllMemories(
      user?.id as string
    )

    return ApiResponse.success(allMemories)
  } catch (error) {
    if (error instanceof MemoryError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }

    console.error('Get all memories error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
