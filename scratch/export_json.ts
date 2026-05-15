import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:../prisma/dev.db',
    },
  },
})

async function main() {
  const data = {
    products: await prisma.product.findMany(),
    banners: await prisma.banner.findMany(),
    categories: await prisma.category.findMany()
  };
  console.log(JSON.stringify(data));
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
