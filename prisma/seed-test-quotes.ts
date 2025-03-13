import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const quotes = [
  'What did one wall say to the other wall? Meet you at the corner!',
  'Why did the golfer bring two pairs of pants? In case he got a hole in one!',
  'What do you call a fish wearing a bowtie? So-fish-ticated!',
  'What do you call a bear with no ears? B!',
  'What do you call a pig that does karate? A pork chop!',
  'Why did the cookie go to the hospital? Because it felt crumbly!',
  'What kind of tree fits in your hand? A palm tree!',
  "Why did the gym close down? It just didn't work out!",
  'What do you call a sleeping bull? A bulldozer!'
]

const prisma = new PrismaClient()

async function seedTestData() {
  await prisma.post.deleteMany({})

  // test users
  const users = await Promise.all([
    prisma.user.findFirstOrThrow({
      where: {
        email: 'test@vmemo.com'
      }
    }),
    prisma.user.findFirstOrThrow({
      where: {
        email: 'test2@vmemo.com'
      }
    }),
    prisma.user.findFirstOrThrow({
      where: {
        email: 'test3@vmemo.com'
      }
    })
  ])

  // Create posts for each user
  // Keep track of used quotes for each user
  const usedQuotes = new Set<string>()

  for (const user of users) {
    for (let i = 0; i < 3; i++) {
      // Find an unused quote
      let randomQuote
      do {
        randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      } while (usedQuotes.has(randomQuote))

      // Mark this quote as used
      usedQuotes.add(randomQuote)

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

  console.log(`- Created ${users.length * 3} posts`)
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
