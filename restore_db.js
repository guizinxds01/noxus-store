const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'prisma', 'dev.db');
const destPath = '/app/data/dev.db';

try {
  const lockFile = '/app/data/restored.txt';
  if (!fs.existsSync(lockFile)) {
    console.log('Lock file not found. Restoring dev.db from repository...');
    fs.mkdirSync('/app/data', { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    fs.writeFileSync(lockFile, 'restored');
    console.log('Successfully restored dev.db from repository to volume.');
  } else {
    console.log('Database already restored (lock file exists), skipping restore.');
  }
} catch (e) {
  console.error('Error during db restore:', e);
}
