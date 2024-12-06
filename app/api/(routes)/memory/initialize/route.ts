import { HttpStatusCode } from 'axios'
import { verifyAuth } from '@/lib/auth'
import { NextRequest } from 'next/server'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { MemoryError } from '@/app/api/errors/memory-error'
import { ApiResponse } from '@/app/api/responses/api-response'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    const userJwt = await verifyAuth(token!)
    const userId = userJwt.id as number

    const { vocabularyIds } = (await req.json()) as { vocabularyIds: number[] }

    if (!vocabularyIds?.length) {
      return new MemoryError(
        'Vocabulary IDs are required',
        'MISSING_VOCABULARY_IDS',
        HttpStatusCode.BadRequest
      )
    }

    const memories = await Promise.all(
      vocabularyIds.map((vocabularyId) =>
        MemoryController.initializeMemory(userId, vocabularyId)
      )
    )

    return ApiResponse.success(memories)
  } catch (error) {
    if (error instanceof MemoryError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }

    console.error('Initialize memories error:', error)
    return ApiResponse.apiError(JSON.stringify(error))
  }
}
