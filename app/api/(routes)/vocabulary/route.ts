import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { VocabularyError } from '@/app/api/errors/vocabulary-error'
import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '@/lib/next-auth'

// Create vocabularies
export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth()
    const words = (await req.json()) as { word: string; translation: string }[]

    const vocabularies = await Promise.all(
      words.map(async ({ word, translation }) => {
        // Upsert vocabulary — insert if not exists, skip if already exists
        const vocabulary = await prisma.vocabulary.upsert({
          where: { word },
          update: {},
          create: { word, translation }
        })

        // Create memory record for this user if not already exists
        if (user?.id) {
          await prisma.memory.upsert({
            where: {
              userId_vocabularyId: {
                userId: user.id,
                vocabularyId: vocabulary.id
              }
            },
            update: {},
            create: {
              userId: user.id,
              vocabularyId: vocabulary.id
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
    const user = await checkAuth()
    const url = new URL(req.url)
    const offset = parseInt(url.searchParams.get('offset') || '0', 10)
    const size = parseInt(url.searchParams.get('size') || '10', 10)
    const page = Math.floor(offset / size) + 1

    const where = {
      memories: { some: { userId: user?.id as string } }
    }

    const vocabularies = await prisma.vocabulary.findMany({
      where,
      include: { memories: true },
      take: size,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.vocabulary.count({ where })

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
    const user = await checkAuth()
    const { id, translation } = await req.json()

    // Verify the user actually has this vocabulary in their memory
    const memory = await prisma.memory.findUnique({
      where: {
        userId_vocabularyId: {
          userId: user?.id as string,
          vocabularyId: id
        }
      }
    })

    if (!memory) {
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
    const user = await checkAuth()
    const url = new URL(req.url)
    const ids = url.searchParams.get('id')?.split(',').map(Number)

    if (!ids?.length) {
      return ApiResponse.badRequest('Vocabulary IDs are required')
    }

    // Delete the user's memory records for these vocabularies
    // (does not delete the vocabulary itself, other users may still have it)
    await prisma.memory.deleteMany({
      where: {
        userId: user?.id as string,
        vocabularyId: { in: ids }
      }
    })

    return ApiResponse.success()
  } catch (error) {
    console.error('Delete vocabulary error:', error)
    return ApiResponse.apiError('Internal server error')
  }
}
