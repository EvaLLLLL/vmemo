export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { DictController } from '@/app/api/controllers/dict.controller'
import { ApiResponse } from '@/app/api/responses/api-response'
import { DictError } from '@/app/api/errors/dict-error'

export async function GET(req: NextRequest) {
  const word = req.nextUrl.searchParams.get('q')

  if (!word) {
    return ApiResponse.badRequest('word is required')
  }

  try {
    const result = await DictController.getDict(word)
    return ApiResponse.success(result)
  } catch (error) {
    if (error instanceof DictError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }
    return ApiResponse.apiError('Internal server error')
  }
}
