import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const fetchCache = 'force-no-store'
export async function GET(req: NextRequest) {
  try {
    const ecDict = await prisma.ecdict.findFirst({
      where: { word:req.nextUrl.searchParams.get('word')?.toString() }
    })
    return new NextResponse(JSON.stringify(ecDict))
  } catch (e) {
    return new NextResponse(JSON.stringify({ message: 'something went wrong' }))
  }
}
