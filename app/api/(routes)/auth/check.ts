import { ApiResponse } from '@/app/api/responses/api-response'
import { auth } from '@/lib/next-auth'
import prisma from '@/lib/prisma'

export async function checkAuth() {
  const session = await auth()

  const user = await prisma.user.findFirst({
    where: {
      name: session?.user?.name as string
    }
  })

  if (!user) {
    return ApiResponse.unauthorized()
  }

  return user.id
}
