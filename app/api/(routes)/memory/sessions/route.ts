import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '@/lib/next-auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const user = await checkAuth()

  try {
    const sessions = await prisma.reviewSession.findMany({
      where: { userId: user?.id as string },
      orderBy: { startedAt: 'desc' },
      include: {
        items: {
          include: { vocabulary: true }
        }
      }
    })

    return ApiResponse.success(sessions)
  } catch {
    return ApiResponse.apiError('Internal server error')
  }
}
