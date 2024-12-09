import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { VocabularyError } from '@/app/api/errors/vocabulary-error'
import { ApiResponse } from '@/app/api/responses/api-response'
import { auth } from '@/lib/next-auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id as string | undefined

    const words = (await req.json()) as { word: string; translation: string }[]
    const vocabularies = await Promise.all(
      words.map(async ({ word, translation }) => {
        let vocabulary = await prisma.vocabulary.findUnique({
          where: { word }
        })

        if (!vocabulary) {
          vocabulary = await prisma.vocabulary.create({
            data: {
              word,
              translation,
              users: userId ? { connect: { id: userId } } : undefined
            }
          })
        } else if (userId) {
          // Connect existing vocabulary to user if not already connected
          await prisma.user.update({
            where: { id: userId },
            data: {
              vocabularies: {
                connect: { id: vocabulary.id }
              }
            }
          })
        }

        return vocabulary
      })
    )

    return ApiResponse.created(vocabularies)
  } catch (error) {
    if (error instanceof VocabularyError) {
      return ApiResponse.apiError(error.message, error.code, error.status)
    }

    console.error('Create vocabularies error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}

// Read vocabularies
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id as string

    const url = new URL(req.url)
    const offset = parseInt(url.searchParams.get('offset') || '0', 10)
    const size = parseInt(url.searchParams.get('size') || '10', 10)
    const page = Math.floor(offset / size) + 1

    const vocabularies = await prisma.vocabulary.findMany({
      where: {
        users: { some: { id: userId } }
      },
      include: {
        memories: true
      },
      take: size,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.vocabulary.count({
      where: {
        users: { some: { id: userId } }
      }
    })

    return ApiResponse.success({
      data: vocabularies,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size)
      }
    })
  } catch (error) {
    console.error('Get vocabularies error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}

// Update vocabulary
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id as string

    const data = await req.json()
    const { id, translation } = data

    const vocabulary = await prisma.vocabulary.findFirst({
      where: {
        id,
        users: { some: { id: userId } }
      }
    })

    if (!vocabulary) {
      return ApiResponse.notFound()
    }

    const updated = await prisma.vocabulary.update({
      where: { id },
      data: { translation }
    })

    return ApiResponse.success(updated)
  } catch (error) {
    console.error('Update vocabulary error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}

// Delete vocabulary
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id as string

    const url = new URL(req.url)
    const ids = url.searchParams.get('id')?.split(',').map(Number)

    if (!ids?.length) {
      return ApiResponse.badRequest('Vocabulary IDs are required')
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        vocabularies: {
          disconnect: { id: { in: ids } }
        }
      }
    })

    return ApiResponse.success()
  } catch (error) {
    console.error('Delete vocabulary error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
