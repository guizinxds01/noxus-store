import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const productsCount = await prisma.product.count()
  const bannersCount = await prisma.banner.count()
  console.log(`Products: ${productsCount}`)
  console.log(`Banners: ${bannersCount}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
