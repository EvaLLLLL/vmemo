import { ApiResponse } from '../../responses/api-response'
import prisma from '@/lib/prisma'
import { checkAuth } from '@/lib/next-auth'

export async function POST(req: Request) {
  try {
    const user = await checkAuth()

    const { content } = await req.json()

    if (!content) {
      return ApiResponse.badRequest('Content is required')
    }

    // Check daily post limit
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const postCount = await prisma.post.count({
      where: {
        userId: user?.id,
        createdAt: {
          gte: today
        }
      }
    })

    if (postCount >= 3) {
      return ApiResponse.badRequest('Daily post limit reached')
    }

    const post = await prisma.post.create({
      data: {
        content,
        userId: user?.id!,
        userName: user?.name!
      }
    })

    return ApiResponse.success(post)
  } catch (error) {
    console.error('[POST_POST]', error)
    return ApiResponse.apiError('Internal Error')
  }
}

export async function GET(_req: Request) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        likes: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return ApiResponse.success(posts)
  } catch (error) {
    console.error('[GET_POSTS]', error)
    return ApiResponse.apiError('Internal Error')
  }
}
