import { PrismaClient as PrismaClientSqlite } from '@prisma/client'
// Note: This script assumes you have both sqlite and postgresql available or you use two different prisma clients.
// A simpler way is to just use a script that connects to the production DB and creates the items.

const sqlitePrisma = new PrismaClientSqlite({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db',
    },
  },
})

// For the production prisma, we will use the one generated after the provider change.
// But we need to pass the production DATABASE_URL.

async function main() {
  const prodUrl = process.env.PROD_DATABASE_URL
  if (!prodUrl) {
    console.error('Por favor, defina a variável de ambiente PROD_DATABASE_URL com a URL do seu banco PostgreSQL no Railway.')
    process.exit(1)
  }

  const pgPrisma = new PrismaClientSqlite({
    datasources: {
      db: {
        url: prodUrl,
      },
    },
  })

  console.log('--- Iniciando migração de dados ---')

  // 1. Migrar Categorias
  const categories = await sqlitePrisma.category.findMany()
  console.log(`Migrando ${categories.length} categorias...`)
  for (const cat of categories) {
    await pgPrisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    })
  }

  // 2. Migrar Produtos
  const products = await sqlitePrisma.product.findMany()
  console.log(`Migrando ${products.length} produtos...`)
  for (const prod of products) {
    await pgPrisma.product.upsert({
      where: { id: prod.id },
      update: prod,
      create: prod,
    })
  }

  // 3. Migrar Banners
  const banners = await sqlitePrisma.banner.findMany()
  console.log(`Migrando ${banners.length} banners...`)
  for (const ban of banners) {
    await pgPrisma.banner.upsert({
      where: { id: ban.id },
      update: ban,
      create: ban,
    })
  }

  // 4. Migrar Configurações
  const settings = await sqlitePrisma.settings.findFirst()
  if (settings) {
    console.log('Migrando configurações...')
    await pgPrisma.settings.upsert({
      where: { id: settings.id },
      update: settings,
      create: settings,
    })
  }

  console.log('--- Migração concluída com sucesso! ---')
}

main()
  .catch(e => {
    console.error('Erro na migração:', e)
    process.exit(1)
  })
  .finally(async () => {
    await sqlitePrisma.$disconnect()
  })
