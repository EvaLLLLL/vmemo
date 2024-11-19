import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
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
    const data: { vocabularyIds: number[]; action: 'add' | 'reduce' } =
      await req.json()
    const vocabularyIds = data.vocabularyIds

    if (!vocabularyIds.length) return

    const existVocabularies = await prisma.memory.findMany({
      where: {
        userId: userJwt.id,
        vocabularyId: { in: vocabularyIds }
      }
    })

    const newVocabularies = vocabularyIds.filter(
      (i) => !existVocabularies.map((e) => e.vocabularyId).includes(i)
    )

    if (data.action === 'add' || data.action === 'reduce') {
      await prisma.memory.updateMany({
        where: {
          userId: userJwt.id,
          id: { in: existVocabularies.map((e) => e.id) },
          level: data.action === 'add' ? { lt: 3 } : { gt: 0 }
        },
        data: {
          level: data.action === 'add' ? { increment: 1 } : { decrement: 1 }
        }
      })
    }

    await prisma.memory.createMany({
      data: newVocabularies.map((id) => ({
        vocabularyId: id,
        userId: userJwt.id as number,
        level: 1
      }))
    })

    return new NextResponse(JSON.stringify({ message: 'add successfully' }), {
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
