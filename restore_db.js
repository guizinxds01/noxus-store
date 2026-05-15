const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'prisma', 'dev.db');
const destPath = '/app/data/dev.db';

try {
  let shouldCopy = false;
  if (!fs.existsSync(destPath)) {
    shouldCopy = true;
  } else {
    const stats = fs.statSync(destPath);
    if (stats.size < 20000) { // Empty SQLite DB is around 16KB
      shouldCopy = true;
    }
  }

  if (shouldCopy && fs.existsSync(srcPath)) {
    fs.mkdirSync('/app/data', { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log('Successfully restored dev.db from repository to volume.');
  } else {
    console.log('Database already exists in volume and has data, skipping restore.');
  }
} catch (e) {
  console.error('Error during db restore:', e);
}
