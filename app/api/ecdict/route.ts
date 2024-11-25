export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { HttpStatusCode } from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const word = req.nextUrl.searchParams.get('word')

  if (!word) {
    return new NextResponse(JSON.stringify({ message: 'no words provided' }), {
      status: HttpStatusCode.BadRequest
    })
  }

  try {
    const ecDict = await prisma.ecdict.findFirst({
      where: { word },
      select: { word: true, translation: true, audio: true }
    })

    return new NextResponse(JSON.stringify(ecDict))
  } catch (e) {
    return new NextResponse(JSON.stringify({ message: JSON.stringify(e) }), {
      status: HttpStatusCode.InternalServerError
    })
  }
}
