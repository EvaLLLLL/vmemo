import { NextRequest } from 'next/server'
import { MemoryController } from '@/app/api/controllers/memory.controller'
import { ApiResponse } from '@/app/api/responses/api-response'
import { MemoryError } from '@/app/api/errors/memory-error'

export const runtime = 'edge'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  try {
    if (!process.env.CRON_SECRET) {
      console.error('CRON_SECRET environment variable is not set')
      return ApiResponse.apiError(
        'Server configuration error',
        'CONFIG_ERROR',
        500
      )
    }

    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return ApiResponse.apiError(
        'Missing authorization header',
        'UNAUTHORIZED',
        401
      )
    }

    const token = authHeader.replace('Bearer ', '')
    if (token !== process.env.CRON_SECRET) {
      return ApiResponse.apiError(
        'Invalid authorization token',
        'UNAUTHORIZED',
        401
      )
    }

    const result = await MemoryController.postponeUncompletedReviews()

    return ApiResponse.success({
      message: 'Successfully postponed reviews',
      count: result.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[Cron Error]', error)
    if (error instanceof MemoryError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }
    return ApiResponse.apiError('Internal server error')
  }
}
