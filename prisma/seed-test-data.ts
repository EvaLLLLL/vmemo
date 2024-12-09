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

const quotes = [
  "Life is what happens while you're busy making other plans. - John Lennon",
  'The only way to do great work is to love what you do. - Steve Jobs',
  'Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill',
  'Be yourself; everyone else is already taken. - Oscar Wilde',
  "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe. - Albert Einstein",
  'Why did the scarecrow win an award? Because he was outstanding in his field!',
  'What do you call a bear with no teeth? A gummy bear!',
  "Why don't scientists trust atoms? Because they make up everything!",
  'What did the grape say when it got stepped on? Nothing, it just let out a little wine!'
]

async function seedTestData() {
  // Clean up existing data
  await prisma.message.deleteMany({})
  await prisma.room.deleteMany({})
  await prisma.post.deleteMany({})
  await prisma.memory.deleteMany({})
  await prisma.vocabulary.deleteMany({})
  await prisma.user.deleteMany({})

  // Create test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'test@vmemo.com',
        name: 'test@vmemo.com'
      }
    }),
    prisma.user.create({
      data: {
        email: 'test2@vmemo.com',
        name: 'Test User 2'
      }
    }),
    prisma.user.create({
      data: {
        email: 'test3@vmemo.com',
        name: 'Test User 3'
      }
    })
  ])

  // Create chat rooms
  const chatRooms = await Promise.all([
    prisma.room.create({
      data: {
        name: 'GRE',
        description: 'GRE vocabulary discussion group'
      }
    }),
    prisma.room.create({
      data: {
        name: 'TOFEL',
        description: 'TOFEL preparation group'
      }
    }),
    prisma.room.create({
      data: {
        name: 'GENERAL',
        description: 'General English learning'
      }
    }),
    prisma.room.create({
      data: {
        name: 'JUST FOR FUN',
        description: 'Casual English chat'
      }
    })
  ])

  // Create conversations in GRE chat room
  const conversations = [
    "Hey, how's your GRE prep going?",
    'Pretty good! Working on vocabulary now.',
    'The verbal section is quite challenging.',
    'Yeah, especially those reading comprehension passages!',
    'Anyone want to share some study tips?',
    'I found making flashcards really helpful!'
  ]

  for (let i = 0; i < conversations.length; i++) {
    console.log(
      `Creating message for user: ${users[i % 2].id}, room: ${chatRooms[0].id}`
    )
    await prisma.message.create({
      data: {
        content: conversations[i],
        userId: users[i % 2].id,
        roomId: chatRooms[0].id,
        createdAt: dayjs()
          .subtract(i * 2, 'hour')
          .toDate(),
        userName: users[i % 2].name ?? ''
      }
    })
  }

  // Create posts for each user
  for (const user of users) {
    for (let i = 0; i < 3; i++) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      await prisma.post.create({
        data: {
          content: randomQuote,
          userId: user.id,
          userName: user.name ?? '',
          createdAt: dayjs()
            .subtract(Math.floor(Math.random() * 30), 'day')
            .toDate()
        }
      })
    }
  }

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
            connect: { id: users[0].id }
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
          userId: users[0].id,
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
  console.log(`- Created ${users.length} test users`)
  console.log(`- Created ${chatRooms.length} chat rooms`)
  console.log(`- Created ${conversations.length} messages in GRE chat room`)
  console.log(`- Created ${users.length * 3} posts`)
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
