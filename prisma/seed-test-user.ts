import { PrismaClient, MemoryLevel, MemoryStatus } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

const enrichedWords = [
  { word: 'ubiquitous', translation: 'adj. 无处不在的，普遍存在的' },
  { word: 'ephemeral', translation: 'adj. 短暂的，瞬息的' },
  { word: 'pragmatic', translation: 'adj. 务实的，实用的' },
  { word: 'ambiguous', translation: 'adj. 模棱两可的，不明确的' },
  { word: 'meticulous', translation: 'adj. 一丝不苟的，细致的' },
  { word: 'eloquent', translation: 'adj. 雄辩的，有说服力的' },
  { word: 'tenacious', translation: 'adj. 坚韧的，顽强的' },
  { word: 'profound', translation: 'adj. 深刻的，意义深远的' },
  { word: 'innovative', translation: 'adj. 创新的，革新的' },
  { word: 'resilient', translation: 'adj. 有弹性的，能快速恢复的' },
  { word: 'authentic', translation: 'adj. 真实的，可信的' },
  { word: 'diligent', translation: 'adj. 勤奋的，用功的' },
  { word: 'versatile', translation: 'adj. 多才多艺的，用途广泛的' },
  { word: 'empathy', translation: 'n. 同理心，能力' },
  { word: 'integrity', translation: 'n. 正直，诚实' },
  { word: 'perseverance', translation: 'n. 毅力，坚持' },
  { word: 'collaborate', translation: 'v. 合作，协作' },
  { word: 'innovate', translation: 'v. 创新，改革' },
  { word: 'optimize', translation: 'v. 优化，完善' },
  { word: 'synthesize', translation: 'v. 合成，综合' },
  { word: 'articulate', translation: 'v. 清楚地表达' },
  { word: 'facilitate', translation: 'v. 促进，使容易' },
  { word: 'leverage', translation: 'v. 充分利用' },
  { word: 'cultivate', translation: 'v. 培养，栽培' },
  { word: 'advocate', translation: 'v. 提倡，主张' },
  { word: 'resilience', translation: 'n. 恢复力，弹性' },
  { word: 'perspective', translation: 'n. 观点，视角' },
  { word: 'initiative', translation: 'n. 主动性，倡议' },
  { word: 'diversity', translation: 'n. 多样性，差异性' },
  { word: 'sustainability', translation: 'n. 可持续性' }
]

async function seedTestData() {
  const testUser = await prisma.user.findFirstOrThrow({
    where: {
      email: 'test@vmemo.com'
    }
  })

  await prisma.vocabulary.deleteMany({
    where: {
      users: {
        some: {
          id: testUser.id
        }
      }
    }
  })
  await prisma.memory.deleteMany({
    where: {
      userId: testUser.id
    }
  })

  // Create vocabularies and memories for first user with intense activity
  const vocabularies = await Promise.all(
    enrichedWords.map(async (word, index) => {
      const vocabulary = await prisma.vocabulary.upsert({
        where: { word: word.word },
        update: {},
        create: {
          word: word.word,
          translation: word.translation,
          users: {
            connect: { id: testUser.id }
          }
        }
      })

      // Create memory with intense activity pattern
      const daysAgo = Math.floor(Math.random() * 30)

      // More varied review counts based on word position
      // Earlier words have more reviews
      const baseReviewCount = Math.max(20 - index, 5)
      const reviewCount = baseReviewCount + Math.floor(Math.random() * 10)

      // Create multiple review records for each memory
      const reviewDates: Date[] = []
      let currentDate = dayjs().subtract(daysAgo, 'day')

      // Generate review dates
      for (let i = 0; i < reviewCount; i++) {
        reviewDates.push(currentDate.toDate())
        // Reviews become more frequent in recent days
        const hourGap = Math.max(4, 24 - (reviewCount - i))
        currentDate = currentDate.add(
          Math.floor(Math.random() * hourGap),
          'hour'
        )
      }

      const lastReviewedAt = reviewDates[reviewDates.length - 1]

      // Determine memory level based on review count
      let memoryLevel
      if (reviewCount > 15) {
        memoryLevel = MemoryLevel.MASTERED
      } else if (reviewCount > 10) {
        memoryLevel = MemoryLevel.LEVEL_4
      } else if (reviewCount > 5) {
        memoryLevel = MemoryLevel.LEVEL_2
      } else {
        memoryLevel = MemoryLevel.LEVEL_1
      }

      // Create the memory record
      await prisma.memory.create({
        data: {
          userId: testUser.id,
          vocabularyId: vocabulary.id,
          level: memoryLevel,
          reviewCount,
          lastReviewedAt,
          nextReviewDate: dayjs(lastReviewedAt)
            .add(Math.floor(Math.random() * 2) + 1, 'day')
            .toDate(),
          status: MemoryStatus.IN_PROGRESS,
          createdAt: dayjs().subtract(daysAgo, 'day').toDate(),
          updatedAt: lastReviewedAt
        }
      })

      return vocabulary
    })
  )

  console.log(`Seeded test data successfully:`)
  console.log(`- Created ${vocabularies.length} vocabularies with memories`)
}

seedTestData()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
