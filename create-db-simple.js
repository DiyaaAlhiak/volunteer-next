const { PrismaClient } = require('@prisma/client');

async function createDatabase() {
  console.log('Creating database hvc_ambassadors...');
  
  try {
    // First, try to connect without specifying database to create it
    const { exec } = require('child_process');
    
    exec('npx prisma db push --force-reset', (error, stdout, stderr) => {
      if (error) {
        console.error('Error running prisma db push:', error);
        return;
      }
      console.log('Database setup completed!');
      console.log('Prisma db push output:', stdout);
      if (stderr) {
        console.error('Prisma db push stderr:', stderr);
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createDatabase();
