import omit from 'lodash/omit'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
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

  if (!userJwt?.id) {
    return new NextResponse(
      JSON.stringify({ message: 'authentication required' }),
      { status: 401 }
    )
  }

  try {
    const vocabularies = await prisma.vocabulary.findMany({
      where: { users: { some: { id: userJwt.id } } },
      include: {
        memories: {
          where: { userId: userJwt.id },
          select: { level: true, vocabularyId: true }
        }
      }
    })

    const modifiedVocabularies = vocabularies.map((vocabulary) => ({
      ...omit(vocabulary, 'memories'),
      level: vocabulary.memories[0]?.level ?? 0
    }))

    return new NextResponse(JSON.stringify(modifiedVocabularies))
  } catch (e) {
    console.log(e)
    return new NextResponse(
      JSON.stringify({ message: 'something went wrong' }),
      {
        status: 500
      }
    )
  }
}
