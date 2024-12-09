import dayjs from 'dayjs'

import { useDueReviews, useMemory } from './use-memory'
import { MemoryStatus } from '@prisma/client'

export const useStatistic = () => {
  const { allMemories } = useMemory()
  const { dueReviews } = useDueReviews()

  // Calculate today's progress
  const totalDueToday = dueReviews?.length || 0
  const completedToday = totalDueToday - (dueReviews?.length || 0)
  const todayProgress = totalDueToday
    ? (completedToday / totalDueToday) * 100
    : 0

  // Calculate streak
  const reviewDates = allMemories
    ?.filter((memory) => memory.lastReviewedAt)
    .map((memory) => dayjs(memory.lastReviewedAt).format('YYYY-MM-DD'))
    .sort()
    .reverse()

  let streak = 0
  let currentDate = dayjs()

  while (reviewDates?.includes(currentDate.format('YYYY-MM-DD'))) {
    streak++
    currentDate = currentDate.subtract(1, 'day')
  }

  // Calculate total words learned
  const wordsCount = allMemories?.filter(
    (memory) => memory.status !== MemoryStatus.NOT_STARTED
  ).length

  // Estimate study hours
  const studyHours = allMemories?.reduce((total, memory) => {
    return total + ((memory.reviewCount || 0) * 2) / 60
  }, 0)

  return {
    todayProgress: Math.round(todayProgress),
    streak,
    wordsCount,
    studyHours: Number((studyHours || 0).toFixed(1))
  }
}
