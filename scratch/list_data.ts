import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany()
  const banners = await prisma.banner.findMany()
  console.log('--- PRODUCTS ---')
  products.forEach(p => console.log(`- ${p.name} (${p.price})`))
  console.log('--- BANNERS ---')
  banners.forEach(b => console.log(`- ${b.title || 'Untitled'}`))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
