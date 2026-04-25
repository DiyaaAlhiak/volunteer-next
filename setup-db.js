const { execSync } = require('child_process');

console.log('Setting up database...');

try {
  // Set environment variable and run prisma db push
  process.env.DATABASE_URL = 'mysql://root:@localhost:3306/hvc_ambassadors';
  
  console.log('DATABASE_URL set to:', process.env.DATABASE_URL);
  
  // Run prisma db push
  console.log('Running prisma db push...');
  const output = execSync('npx prisma db push', { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log('Database setup completed successfully!');
  
} catch (error) {
  console.error('Error setting up database:', error.message);
}
