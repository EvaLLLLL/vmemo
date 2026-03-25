/**
 * Benchmark: query performance with 10,000+ vocabulary entries
 * Run with: npx tsx prisma/benchmark.ts
 */
import prisma from '@/lib/prisma'

const VOCAB_COUNT = 10_000
const TEST_USER_ID = 'benchmark-user'

async function seed() {
  console.log(`\nSeeding ${VOCAB_COUNT} vocabularies…`)

  // Clean up previous benchmark data
  await prisma.reviewSessionItem.deleteMany({ where: { session: { userId: TEST_USER_ID } } })
  await prisma.reviewSession.deleteMany({ where: { userId: TEST_USER_ID } })
  await prisma.memory.deleteMany({ where: { userId: TEST_USER_ID } })
  await prisma.user.deleteMany({ where: { id: TEST_USER_ID } })

  await prisma.user.create({
    data: { id: TEST_USER_ID, name: 'Benchmark User', email: 'benchmark@test.local' }
  })

  // Insert vocabularies in batches
  const BATCH = 500
  const vocabIds: number[] = []
  for (let i = 0; i < VOCAB_COUNT; i += BATCH) {
    const batch = Array.from({ length: Math.min(BATCH, VOCAB_COUNT - i) }, (_, j) => ({
      word: `bench_word_${i + j}`,
      translation: `translation_${i + j}`
    }))
    await prisma.vocabulary.createMany({ data: batch, skipDuplicates: true })
    const ids = await prisma.vocabulary.findMany({
      where: { word: { in: batch.map((v) => v.word) } },
      select: { id: true }
    })
    vocabIds.push(...ids.map((v) => v.id))
  }

  // Create memories for all vocab entries
  const now = new Date()
  const memoryBatch = vocabIds.map((vocabularyId, i) => ({
    userId: TEST_USER_ID,
    vocabularyId,
    level: (['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5', 'MASTERED'] as const)[i % 6],
    reviewCount: Math.floor(Math.random() * 10),
    nextReviewDate: new Date(now.getTime() + (i % 3 === 0 ? -1 : 1) * 86_400_000 * (i % 7))
  }))
  for (let i = 0; i < memoryBatch.length; i += BATCH) {
    await prisma.memory.createMany({ data: memoryBatch.slice(i, i + BATCH) })
  }

  console.log(`Seeded ${vocabIds.length} vocabularies and memories.`)
  return vocabIds
}

async function time<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const ms = (performance.now() - start).toFixed(2)
  const count = Array.isArray(result) ? ` (${result.length} rows)` : ''
  console.log(`  ${label.padEnd(52)} ${ms.padStart(8)} ms${count}`)
  return result
}

async function run() {
  await seed()

  const now = new Date()
  const where = {
    userId: TEST_USER_ID,
    status: { not: 'COMPLETED' as const },
    nextReviewDate: { lte: now }
  }
  const firstMemory = await prisma.memory.findFirst({ where: { userId: TEST_USER_ID } })

  console.log('\n── Before optimizations ─────────────────────────────────────\n')

  await time('vocabulary.findUnique by word', () =>
    prisma.vocabulary.findUnique({ where: { word: 'bench_word_5000' } })
  )

  await time('memory.findMany by userId (include all)', () =>
    prisma.memory.findMany({ where: { userId: TEST_USER_ID }, include: { vocabulary: true } })
  )

  const t0 = performance.now()
  await prisma.memory.findMany({ where, include: { vocabulary: true } })
  await prisma.memory.count({ where })
  console.log(`  ${'due reviews: findMany + count (sequential)'.padEnd(52)} ${(performance.now() - t0).toFixed(2).padStart(8)} ms`)

  await time('memory.findUnique by userId_vocabularyId', () =>
    prisma.memory.findUnique({
      where: { userId_vocabularyId: { userId: TEST_USER_ID, vocabularyId: firstMemory!.vocabularyId } }
    })
  )

  console.log('\n── After optimizations ──────────────────────────────────────\n')

  await time('vocabulary.findUnique by word', () =>
    prisma.vocabulary.findUnique({ where: { word: 'bench_word_5000' } })
  )

  await time('memory.findMany by userId (select only)', () =>
    prisma.memory.findMany({
      where: { userId: TEST_USER_ID },
      select: { id: true, vocabularyId: true, level: true, status: true, nextReviewDate: true,
        vocabulary: { select: { id: true, word: true, translation: true } } }
    })
  )

  const t1 = performance.now()
  await Promise.all([
    prisma.memory.findMany({
      where,
      select: { id: true, vocabularyId: true, level: true, status: true, nextReviewDate: true,
        vocabulary: { select: { id: true, word: true, translation: true } } }
    }),
    prisma.memory.count({ where })
  ])
  console.log(`  ${'due reviews: findMany + count (parallel + select)'.padEnd(52)} ${(performance.now() - t1).toFixed(2).padStart(8)} ms`)

  await time('memory.findUnique by userId_vocabularyId', () =>
    prisma.memory.findUnique({
      where: { userId_vocabularyId: { userId: TEST_USER_ID, vocabularyId: firstMemory!.vocabularyId } }
    })
  )

  console.log('\nCleaning up benchmark data…')
  await prisma.memory.deleteMany({ where: { userId: TEST_USER_ID } })
  await prisma.user.deleteMany({ where: { id: TEST_USER_ID } })
  console.log('Done.\n')
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
