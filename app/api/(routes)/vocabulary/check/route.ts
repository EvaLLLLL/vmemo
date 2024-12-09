import { NextRequest } from 'next/server'
import { ApiResponse } from '@/app/api/responses/api-response'
import prisma from '@/lib/prisma'
import { checkAuth } from '../../auth/check'

export async function GET(req: NextRequest) {
  try {
    const userId = await checkAuth()

    const url = new URL(req.url)
    const q = url.searchParams.get('q')
    const words = q?.split(',')

    if (!words?.length) {
      return ApiResponse.badRequest('Word parameter is required')
    }

    const vocabularies = await prisma.vocabulary.findMany({
      where: {
        word: { in: words },
        users: { some: { id: userId as string } }
      }
    })

    if (!vocabularies?.length) {
      return ApiResponse.notFound()
    }

    return ApiResponse.success(vocabularies)
  } catch (error) {
    console.error('Check vocabulary error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
