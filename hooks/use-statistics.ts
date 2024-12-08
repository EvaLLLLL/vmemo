import { useMemo } from 'react'
import { useMemory, useDueReviews } from './use-memory'
import dayjs from 'dayjs'
import { MemoryStatus } from '@prisma/client'

export const useStatistics = () => {
  const { allMemories } = useMemory()
  const { dueReviews, pagination } = useDueReviews()

  const stats = useMemo(() => {
    if (!allMemories) {
      return {
        todayProgress: 0,
        streak: 0,
        wordsCount: 0,
        studyHours: 0
      }
    }

    // Calculate today's progress
    const totalDueToday = pagination?.total || 0
    const completedToday = totalDueToday - (dueReviews?.length || 0)
    const todayProgress = totalDueToday
      ? (completedToday / totalDueToday) * 100
      : 0

    // Calculate streak (consecutive days with reviews)
    const reviewDates = allMemories
      .filter((memory) => memory.lastReviewedAt)
      .map((memory) => dayjs(memory.lastReviewedAt).format('YYYY-MM-DD'))
      .sort()
      .reverse()

    let streak = 0
    let currentDate = dayjs()

    while (reviewDates.includes(currentDate.format('YYYY-MM-DD'))) {
      streak++
      currentDate = currentDate.subtract(1, 'day')
    }

    // Calculate total words learned (completed or in progress)
    const wordsCount = allMemories.filter(
      (memory) => memory.status !== MemoryStatus.NOT_STARTED
    ).length

    // Estimate study hours (assume 2 minutes per review)
    const studyHours = allMemories.reduce((total, memory) => {
      return total + ((memory.reviewCount || 0) * 2) / 60
    }, 0)

    return {
      todayProgress: Math.round(todayProgress),
      streak,
      wordsCount,
      studyHours: Number(studyHours.toFixed(1))
    }
  }, [allMemories, dueReviews, pagination])

  return stats
}
