import { NextRequest } from 'next/server'
import { MemoryError } from '@/app/api/errors/memory-error'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '@/lib/next-auth'

export async function GET(req: NextRequest) {
  const user = await checkAuth()

  const word = req.nextUrl.searchParams.get('q')

  if (!word) {
    return ApiResponse.badRequest('Word parameter is required', 'MISSING_WORD')
  }

  try {
    const memory = await MemoryController.getMemoryByWord(
      user?.id as string,
      word
    )
    return ApiResponse.success(memory)
  } catch (error) {
    if (error instanceof MemoryError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }

    console.error('Get memory by word error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
