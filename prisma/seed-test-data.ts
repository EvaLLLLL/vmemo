import { PrismaClient, MemoryLevel, MemoryStatus } from '@prisma/client'
import dayjs from 'dayjs'
import { hashPassword } from '@/lib/auth'

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
  { word: 'empathy', translation: 'n. 同理心，共情能力' },
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
  await prisma.user.delete({
    where: { email: 'test@vmemo.com' }
  })

  const hashedPassword = await hashPassword('test@vmemo.com')

  // 1. Create test user if not exists
  const user = await prisma.user.upsert({
    where: { email: 'test@vmemo.com' },
    update: {},
    create: {
      email: 'test@vmemo.com',
      name: 'test@vmemo.com',
      password: hashedPassword
    }
  })

  // 2. Create vocabularies from default list
  const vocabularies = await Promise.all(
    enrichedWords.map(async (word) => {
      const vocabulary = await prisma.vocabulary.upsert({
        where: { word: word.word },
        update: {
          users: {
            connect: { id: user.id }
          }
        },
        create: {
          word: word.word,
          translation: word.translation,
          users: {
            connect: { id: user.id }
          }
        }
      })
      return vocabulary
    })
  )

  const memories = await Promise.all(
    vocabularies.map(async (vocab) => {
      const daysAgo = Math.floor(Math.random() * 30)
      const createdAt = dayjs().subtract(daysAgo, 'day').toDate()

      const levels = Object.values(MemoryLevel)
      const randomLevel =
        levels[Math.floor(Math.random() * (levels.length - 1))]

      const reviewCount = Math.floor(Math.random() * 6)

      const lastReviewedAt =
        reviewCount > 0
          ? dayjs()
              .subtract(Math.floor(Math.random() * daysAgo), 'day')
              .toDate()
          : dayjs().toDate()

      return await prisma.memory.create({
        data: {
          userId: user.id,
          vocabularyId: vocab.id,
          level: randomLevel,
          reviewCount,
          lastReviewedAt,
          nextReviewDate: lastReviewedAt
            ? dayjs(lastReviewedAt)
                .add(Math.floor(Math.random() * 7), 'day')
                .toDate()
            : dayjs().toDate(),
          status:
            reviewCount > 0
              ? MemoryStatus.IN_PROGRESS
              : MemoryStatus.NOT_STARTED,
          createdAt,
          updatedAt: lastReviewedAt || createdAt
        }
      })
    })
  )

  console.log(`Created ${memories.length} test memories`)
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
