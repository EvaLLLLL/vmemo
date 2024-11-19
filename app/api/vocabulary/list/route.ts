import omit from 'lodash/omit'
import prisma from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { Memory, Vocabulary } from '@prisma/client'

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
  const level = parseInt(url.searchParams.get('level') || '-1', 10)

  const offset = (page - 1) * size

  try {
    let vocabularies: (Vocabulary & { memories: Memory[] })[] = []

    // get all memories
    if (level === -2) {
      vocabularies = await prisma.vocabulary.findMany({
        where: {
          users: { some: { id: userJwt.id } },
          memories: { some: { userId: userJwt.id } }
        },
        include: { memories: true },
        take: size,
        skip: offset
      })
    }

    // get memories less than 3
    if (level === -1) {
      vocabularies = await prisma.vocabulary.findMany({
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
    }

    if (level === 0) {
      vocabularies = await prisma.vocabulary.findMany({
        where: {
          users: { some: { id: userJwt.id } },
          OR: [{ memories: { none: {} } }, { memories: { some: { level: 0 } } }]
        },
        include: { memories: true },
        take: size,
        skip: offset
      })
    }

    if ([1, 2, 3].includes(level)) {
      vocabularies = await prisma.vocabulary.findMany({
        where: {
          users: { some: { id: userJwt.id } },
          memories: { some: { userId: userJwt.id, level: level } }
        },
        include: { memories: true },
        take: size,
        skip: offset
      })
    }

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

    const getCount = () => {
      switch (level) {
        case -2:
          return totalCount
        case -1:
          return vocabulariesCount
        case 0:
          return level0Count
        case 1:
          return level1Count
        case 2:
          return level2Count
        case 3:
          return level3Count
        default:
          return totalCount
      }
    }
    const isLastPage = offset + vocabularies.length >= getCount()
    const getPageCount = () => {
      switch (level) {
        case -2:
          return Math.ceil(totalCount / size)
        case -1:
          return Math.ceil(vocabulariesCount / size)
        case 0:
          return Math.ceil(level0Count / size)
        case 1:
          return Math.ceil(level1Count / size)
        case 2:
          return Math.ceil(level2Count / size)
        case 3:
          return Math.ceil(level3Count / size)
        default:
          return Math.ceil(totalCount / size)
      }
    }

    const result = {
      counts: {
        totalCount,
        level0Count,
        level1Count,
        level2Count,
        level3Count,
        levelLCount
      },
      level,
      pageCount: getPageCount(),
      isLastPage: isLastPage,
      vocabularies: modifiedVocabularies
    }

    return new NextResponse(JSON.stringify(result))
  } catch (_) {
    return new NextResponse(
      JSON.stringify({ message: 'something went wrong' }),
      {
        status: 500
      }
    )
  }
}
