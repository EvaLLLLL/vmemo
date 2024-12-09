import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '@/lib/next-auth'
import prisma from '@/lib/prisma'

export async function POST(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await checkAuth()

    const { postId } = params

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    })

    if (!post) {
      return ApiResponse.notFound()
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId: user?.id as string
      }
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      })
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId: user?.id as string
        }
      })
    }

    return ApiResponse.success()
  } catch (error) {
    console.error('[POST_LIKE]', error)
    return ApiResponse.apiError('Internal Error')
  }
}
