import { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { MemoryError } from '@/app/api/errors/memory-error'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const userJwt = await verifyAuth(token!)
  const word = req.nextUrl.searchParams.get('q')

  if (!word) {
    return ApiResponse.badRequest('Word parameter is required', 'MISSING_WORD')
  }

  try {
    const memory = await MemoryController.getMemoryByWord(
      userJwt.id as number,
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
