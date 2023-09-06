import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const fetchCache = 'force-no-store'
export async function GET() {
  try {
    const vocabularyList = await prisma.vocabulary.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return new NextResponse(JSON.stringify(vocabularyList))
  } catch (e) {
    return new NextResponse(JSON.stringify({ message: 'something went wrong' }))
  }
}
