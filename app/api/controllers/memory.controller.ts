import dayjs from 'dayjs'
import prisma from '@/lib/prisma'
import { MemoryStatus, MemoryLevel, Memory, Vocabulary } from '@prisma/client'
import { HttpStatusCode } from 'axios'
import { MemoryError } from '@/app/api/errors/memory-error'

interface ReviewResult {
  memoryId: number
  remembered: boolean
}

export class MemoryController {
  private static readonly REVIEW_INTERVALS: Record<MemoryLevel, number> = {
    LEVEL_1: 0,
    LEVEL_2: 1,
    LEVEL_3: 3,
    LEVEL_4: 6,
    LEVEL_5: 13,
    MASTERED: 29
  }

  private static getNextLevel(
    currentLevel: MemoryLevel,
    remembered: boolean
  ): MemoryLevel {
    try {
      const levels = Object.values(MemoryLevel)
      const currentIndex = levels.indexOf(currentLevel)

      if (currentIndex === -1) {
        throw new MemoryError(
          'Invalid memory level',
          'INVALID_LEVEL',
          HttpStatusCode.BadRequest
        )
      }

      if (remembered) {
        return currentIndex < levels.length - 1
          ? levels[currentIndex + 1]
          : MemoryLevel.MASTERED
      } else {
        return currentIndex > 0 ? levels[currentIndex - 1] : MemoryLevel.LEVEL_1
      }
    } catch (error) {
      if (error instanceof MemoryError) throw error
      throw new MemoryError(
        'Failed to calculate next level',
        'LEVEL_CALCULATION_ERROR',
        HttpStatusCode.InternalServerError
      )
    }
  }

  private static calculateNextReviewDate(level: MemoryLevel): Date {
    try {
      const days = this.REVIEW_INTERVALS[level]
      if (typeof days !== 'number') {
        throw new MemoryError(
          'Invalid review interval',
          'INVALID_INTERVAL',
          HttpStatusCode.BadRequest
        )
      }
      return dayjs().add(days, 'day').toDate()
    } catch (error) {
      if (error instanceof MemoryError) throw error
      throw new MemoryError(
        'Failed to calculate next review date',
        'DATE_CALCULATION_ERROR',
        HttpStatusCode.InternalServerError
      )
    }
  }

  static async batchReview(data: ReviewResult[]) {
    return Promise.all(data.map((item) => this.review(item)))
  }

  static async review({ memoryId, remembered }: ReviewResult) {
    try {
      if (!memoryId) {
        throw new MemoryError('Memory ID is required', 'MISSING_MEMORY_ID', 400)
      }

      const memory = await prisma.memory.findUnique({
        where: { id: memoryId }
      })

      if (!memory) {
        throw new MemoryError('Memory not found', 'MEMORY_NOT_FOUND', 404)
      }

      const newLevel = this.getNextLevel(memory.level, remembered)
      const newStatus =
        newLevel === MemoryLevel.MASTERED
          ? MemoryStatus.COMPLETED
          : MemoryStatus.IN_PROGRESS

      return await prisma.memory.update({
        where: { id: memoryId },
        data: {
          level: newLevel,
          status: newStatus,
          reviewCount: { increment: 1 },
          lastReviewedAt: dayjs().toDate(),
          nextReviewDate: this.calculateNextReviewDate(newLevel),
          updatedAt: dayjs().toDate()
        }
      })
    } catch (error) {
      if (error instanceof MemoryError) throw error
      if (error instanceof Error) {
        throw new MemoryError(error.message, 'REVIEW_ERROR', 500)
      }
      throw new MemoryError(
        'An unexpected error occurred during review',
        'UNKNOWN_ERROR',
        HttpStatusCode.InternalServerError
      )
    }
  }

  static async getAllMemories(userId: string) {
    try {
      return await prisma.memory.findMany({
        where: { userId },
        include: { vocabulary: true }
      })
    } catch (error) {
      if (error instanceof MemoryError) throw error
      throw new MemoryError(
        'Failed to fetch all memories',
        'FETCH_MEMORIES_ERROR',
        HttpStatusCode.InternalServerError
      )
    }
  }

  static async getAllNotCompletedReviews(userId: string) {
    try {
      const reviews = await prisma.memory.findMany({
        where: { userId, status: { not: MemoryStatus.COMPLETED } },
        orderBy: {
          nextReviewDate: 'asc'
        },
        include: { vocabulary: true }
      })

      const groupedReviews = reviews.reduce(
        (
          acc: { [date: string]: (Memory & { vocabulary: Vocabulary })[] },
          review
        ) => {
          const date = dayjs(review.nextReviewDate).format('YYYY-MM-DD')
          if (!acc[date]) {
            acc[date] = []
          }
          acc[date].push(review)
          return acc
        },
        {}
      )

      return groupedReviews
    } catch (error) {
      if (error instanceof MemoryError) throw error
      throw new MemoryError(
        'Failed to fetch all not completed reviews',
        'FETCH_NOT_COMPLETED_REVIEWS_ERROR',
        HttpStatusCode.InternalServerError
      )
    }
  }

  static async getDueReviews(
    userId: string,
    size: number = 10,
    offset: number = 0
  ) {
    try {
      const now = dayjs().toDate()
      const dueReviews = await prisma.memory.findMany({
        where: {
          userId,
          status: { not: MemoryStatus.COMPLETED },
          nextReviewDate: { lte: now }
        },
        take: size,
        skip: offset,
        orderBy: {
          nextReviewDate: 'asc'
        },
        include: {
          vocabulary: true
        }
      })

      const total = await prisma.memory.count({
        where: {
          userId,
          status: { not: MemoryStatus.COMPLETED },
          nextReviewDate: { lte: now }
        }
      })

      const page = Math.floor(offset / size) + 1

      return {
        data: dueReviews,
        pagination: {
          page,
          size,
          total,
          totalPages: Math.ceil(total / size)
        }
      }
    } catch (error) {
      if (error instanceof MemoryError) throw error
      throw new MemoryError(
        'Failed to fetch due reviews',
        'FETCH_REVIEWS_ERROR',
        HttpStatusCode.InternalServerError
      )
    }
  }

  static async initializeMemory(userId: string, vocabularyId: number) {
    try {
      if (!userId || !vocabularyId) {
        throw new MemoryError(
          'User ID and Vocabulary ID are required',
          'MISSING_REQUIRED_FIELDS',
          HttpStatusCode.BadRequest
        )
      }

      const existingMemory = await prisma.memory.findFirst({
        where: {
          userId,
          vocabularyId
        }
      })

      if (existingMemory) return existingMemory

      return await prisma.memory.create({
        data: {
          userId,
          vocabularyId,
          level: MemoryLevel.LEVEL_1,
          status: MemoryStatus.NOT_STARTED,
          nextReviewDate: this.calculateNextReviewDate(MemoryLevel.LEVEL_1),
          updatedAt: dayjs().toDate()
        }
      })
    } catch (error) {
      if (error instanceof MemoryError) throw error
      throw new MemoryError(
        'Failed to initialize memory',
        'INITIALIZATION_ERROR',
        HttpStatusCode.InternalServerError
      )
    }
  }

  static async getMemoryByWord(userId: string, word: string) {
    try {
      const memory = await prisma.memory.findFirst({
        where: {
          userId,
          vocabulary: {
            word
          }
        },
        include: {
          vocabulary: true
        }
      })

      if (!memory) {
        return null
      }

      return memory
    } catch (error) {
      if (error instanceof MemoryError) throw error
      throw new MemoryError(
        'Failed to fetch memory by word',
        'FETCH_MEMORY_ERROR',
        HttpStatusCode.InternalServerError
      )
    }
  }

  static async postponeUncompletedReviews() {
    try {
      const today = dayjs().startOf('day')

      const uncompletedReviews = await prisma.memory.findMany({
        where: {
          nextReviewDate: {
            lt: today.endOf('day').toDate()
          },
          status: {
            not: MemoryStatus.COMPLETED
          }
        }
      })

      const tomorrow = today.add(1, 'day').toDate()

      if (uncompletedReviews.length > 0) {
        await prisma.memory.updateMany({
          where: {
            id: {
              in: uncompletedReviews.map((review) => review.id)
            }
          },
          data: {
            nextReviewDate: tomorrow
          }
        })
      }

      return uncompletedReviews
    } catch (error) {
      if (error instanceof MemoryError) throw error
      throw new MemoryError(
        'Failed to postpone uncompleted reviews',
        'POSTPONE_REVIEWS_ERROR',
        HttpStatusCode.InternalServerError
      )
    }
  }
}
