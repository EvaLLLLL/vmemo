import { ApiResponse } from '@/app/api/responses/api-response'
import prisma from '@/lib/prisma'
import { checkAuth } from '@/lib/next-auth'

export async function GET(_req: Request) {
  try {
    const user = await checkAuth()

    const likes = await prisma.like.findMany({
      where: {
        userId: user?.id as string
      },
      select: {
        postId: true
      }
    })

    return ApiResponse.success(likes)
  } catch (error) {
    console.error('[GET_LIKES]', error)
    return ApiResponse.apiError('Internal Error')
  }
}
