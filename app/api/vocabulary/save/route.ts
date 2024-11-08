import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { ITranslationItem } from '@/types/vocabulary'

export async function POST(req: NextRequest) {
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
    const newVocabularies: ITranslationItem[] = await req.json()
    const filterVocabularies = newVocabularies.filter((v) => !v.isSentence)

    if (newVocabularies.length) {
      await prisma.vocabulary.createMany({
        data: filterVocabularies.map((v) => ({
          userId: userJwt.id as number,
          audio: v.audio,
          origin: v.origin,
          translation: v.translation
        })),
        skipDuplicates: true
      })
    }

    return new NextResponse(JSON.stringify({ message: 'save successfully' }), {
      status: 200
    })
  } catch (_) {
    return new NextResponse(
      JSON.stringify({ message: 'something went wrong' }),
      {
        status: 500
      }
    )
  }
}
