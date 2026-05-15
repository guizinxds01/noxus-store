import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

export async function applyShield(prisma: PrismaClient) {
  try {
    const productCount = await prisma.product.count();
    
    if (productCount === 0) {
      console.log('🛡️ NOXUS SHIELD: Database is empty. Initiating auto-restore...');
      
      const backupPath = path.join(process.cwd(), 'prisma', 'master_backup.json');
      
      if (fs.existsSync(backupPath)) {
        const data = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
        
        console.log('🛡️ NOXUS SHIELD: Restoring categories...');
        for (const cat of data.categories || []) {
          await prisma.category.upsert({
            where: { id: cat.id },
            update: cat,
            create: cat,
          });
        }
        
        console.log('🛡️ NOXUS SHIELD: Restoring products...');
        for (const prod of data.products || []) {
          await prisma.product.upsert({
            where: { id: prod.id },
            update: prod,
            create: prod,
          });
        }
        
        console.log('🛡️ NOXUS SHIELD: Restoring banners...');
        for (const banner of data.banners || []) {
          await prisma.banner.upsert({
            where: { id: banner.id },
            update: banner,
            create: banner,
          });
        }
        
        console.log('🛡️ NOXUS SHIELD: Auto-restore completed successfully!');
      } else {
        console.log('🛡️ NOXUS SHIELD: No backup file found. Skipping restore.');
      }
    }
  } catch (error) {
    console.error('🛡️ NOXUS SHIELD: Error during shield check:', error);
  }
}
