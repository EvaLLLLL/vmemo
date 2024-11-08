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

  if (!userJwt) {
    return new NextResponse(
      JSON.stringify({ message: 'authentication required' }),
      { status: 401 }
    )
  }

  try {
    const word: string = await req.json()
    let record = await prisma.vocabulary.findUnique({
      where: { origin: word }
    })

    if (record) {
      await prisma.user.update({
        where: { id: userJwt.id as number },
        data: {
          vocabularies: {
            disconnect: [{ id: record.id }]
          }
        }
      })
    }

    return new NextResponse(
      JSON.stringify({ message: 'delete successfully' }),
      {
        status: 200
      }
    )
  } catch (_) {
    return new NextResponse(
      JSON.stringify({ message: 'something went wrong' }),
      {
        status: 500
      }
    )
  }
}
