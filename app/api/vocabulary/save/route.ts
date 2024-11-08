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
    const filterVocabularies = newVocabularies
      .filter((v) => !v.isSentence)
      .map((v) => ({
        audio: v.audio,
        origin: v.origin,
        translation: v.translation
      }))
    const records = await Promise.all(
      filterVocabularies.map(async (item) => {
        let word = await prisma.vocabulary.findUnique({
          where: { origin: item.origin }
        })

        if (!word) {
          word = await prisma.vocabulary.create({
            data: item
          })
        }

        return word
      })
    )
    const ids = records.map((r) => ({ id: r.id }))

    if (filterVocabularies.length) {
      await prisma.user.update({
        where: { id: userJwt.id as number },
        data: {
          vocabularies: {
            connect: ids
          }
        }
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
