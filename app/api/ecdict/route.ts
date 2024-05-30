export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const word = req.nextUrl.searchParams.get("word")

  if (!word) {
    return new NextResponse(JSON.stringify({message: 'no words provided'}))
  }

  try {
    const ecDict = await prisma.ecdict.findFirst({
      where: { word }
    })
    return new NextResponse(JSON.stringify(ecDict))
  } catch (e) {
    return new NextResponse(JSON.stringify({ message: JSON.stringify(e) }))
  }
}
