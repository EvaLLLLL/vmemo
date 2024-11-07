const fs = require('fs')
const path = require('path')
const Papa = require('papaparse')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const parseCSV = async (filePath) => {
  const csvFile = fs.readFileSync(path.resolve(filePath), 'utf-8')

  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        resolve(results.data)
      }
    })
  })
}

async function seed() {
  const data = await parseCSV('prisma/ecdict.csv')
  await prisma.ecdict.deleteMany()
  await prisma.ecdict.createMany({
    data: data,
    skipDuplicates: true
  })
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
