import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const fetchCache = 'force-no-store'
export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: 'authentication required' }),
      { status: 401 }
    )
  }

  const userJwt = await verifyAuth(token)

  if (!userJwt) {
    return new NextResponse(
      JSON.stringify({ message: 'authentication required' }),
      { status: 401 }
    )
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userJwt.id as number },
      include: { vocabularies: true }
    })

    const vocabularyList = user?.vocabularies

    return new NextResponse(JSON.stringify(vocabularyList))
  } catch (_) {
    return new NextResponse(
      JSON.stringify({ message: 'something went wrong' }),
      {
        status: 500
      }
    )
  }
}
