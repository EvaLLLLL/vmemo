import { NextRequest } from 'next/server'
import { ApiResponse } from '@/app/api/responses/api-response'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/next-auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id as string

    const url = new URL(req.url)
    const q = url.searchParams.get('q')
    const words = q?.split(',')

    if (!words?.length) {
      return ApiResponse.badRequest('Word parameter is required')
    }

    const vocabularies = await prisma.vocabulary.findMany({
      where: {
        word: { in: words },
        users: { some: { id: userId } }
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
