import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '@/lib/next-auth'
import prisma from '@/lib/prisma'

export async function GET(_req: Request) {
  try {
    const user = await checkAuth()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!user) {
      return []
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: user?.id,
        createdAt: {
          gte: today
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return ApiResponse.success(posts)
  } catch (error) {
    console.error('[GET_MY_POSTS]', error)
    return ApiResponse.apiError('Internal Error')
  }
}
