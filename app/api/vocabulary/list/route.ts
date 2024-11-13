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

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const size = parseInt(url.searchParams.get('size') || '10', 10)

  const offset = (page - 1) * size

  try {
    const vocabularies = await prisma.vocabulary.findMany({
      where: {
        users: { some: { id: userJwt.id } },
        OR: [
          { memories: { none: {} } },
          { memories: { some: { userId: userJwt.id, level: { lt: 3 } } } }
        ]
      },
      include: { memories: true },
      take: size,
      skip: offset
    })

    const modifiedVocabularies = vocabularies.map((v) => ({
      ...omit(v, 'memories'),
      level: v.memories?.[0]?.level ?? 0
    }))
    const vocabulariesCount = await prisma.vocabulary.count({
      where: {
        users: { some: { id: userJwt.id } },
        OR: [
          { memories: { none: {} } },
          { memories: { some: { userId: userJwt.id, level: { lt: 3 } } } }
        ]
      }
    })

    const totalCount = await prisma.vocabulary.count({
      where: { users: { some: { id: userJwt.id } } }
    })
    const level0Count = await prisma.vocabulary.count({
      where: {
        users: { some: { id: userJwt.id } },
        OR: [{ memories: { none: {} } }, { memories: { some: { level: 0 } } }]
      }
    })
    const level1Count = await prisma.vocabulary.count({
      where: {
        users: { some: { id: userJwt.id } },
        memories: { some: { userId: userJwt.id, level: 1 } }
      }
    })

    const level2Count = await prisma.vocabulary.count({
      where: {
        users: { some: { id: userJwt.id } },
        memories: { some: { userId: userJwt.id, level: 2 } }
      }
    })
    const level3Count = await prisma.vocabulary.count({
      where: {
        users: { some: { id: userJwt.id } },
        memories: { some: { userId: userJwt.id, level: 3 } }
      }
    })
    const levelLCount = await prisma.vocabulary.count({
      where: {
        users: { some: { id: userJwt.id } },
        memories: { some: { userId: userJwt.id, level: { gt: 3 } } }
      }
    })

    const isLastPage = offset + vocabularies.length >= vocabulariesCount
    const totalPages = Math.ceil(totalCount / size)

    const result = {
      counts: {
        totalCount,
        level0Count,
        level1Count,
        level2Count,
        level3Count,
        levelLCount
      },
      totalPages: totalPages,
      isLastPage: isLastPage,
      vocabularies: modifiedVocabularies
    }

    return new NextResponse(JSON.stringify(result))
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
