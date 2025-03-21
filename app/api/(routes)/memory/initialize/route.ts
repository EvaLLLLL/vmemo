import { HttpStatusCode } from 'axios'
import { NextRequest } from 'next/server'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { MemoryError } from '@/app/api/errors/memory-error'
import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '@/lib/next-auth'

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth()

    const { vocabularyIds } = (await req.json()) as { vocabularyIds: number[] }

    if (!vocabularyIds?.length) {
      throw new MemoryError(
        'Vocabulary IDs are required',
        'MISSING_VOCABULARY_IDS',
        HttpStatusCode.BadRequest
      )
    }

    const memories = await Promise.all(
      vocabularyIds.map((vocabularyId) =>
        MemoryController.initializeMemory(user?.id as string, vocabularyId)
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
