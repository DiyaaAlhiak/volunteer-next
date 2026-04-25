const { spawn } = require('child_process');

console.log('Starting database setup...');

// Set DATABASE_URL and run prisma db push
const prismaProcess = spawn('npx', ['prisma', 'db', 'push'], {
  env: { ...process.env, DATABASE_URL: 'mysql://root:@localhost:3306/hvc_ambassadors' },
  stdio: 'inherit'
});

prismaProcess.on('close', (code) => {
  if (code === 0) {
    console.log('Database setup completed successfully!');
  } else {
    console.error(`Prisma db push failed with code ${code}`);
  }
});

prismaProcess.on('error', (error) => {
  console.error('Error running prisma db push:', error);
});
