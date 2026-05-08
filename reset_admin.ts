import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { password },
    create: { username: 'admin', password },
  });
  console.log('Admin user reset: admin / 123456');
}

main().catch(console.error).finally(() => prisma.$disconnect());
