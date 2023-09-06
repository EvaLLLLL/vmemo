import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const vocabulary = await prisma.vocabulary.createMany({ data })
    return new NextResponse(JSON.stringify(vocabulary))
  } catch (e) {
    return new NextResponse(JSON.stringify({ message: "invalid word" }))
  }
}
