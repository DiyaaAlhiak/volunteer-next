console.log('=== Database Setup Verification ===');

const { execSync } = require('child_process');

try {
  console.log('1. Setting DATABASE_URL...');
  process.env.DATABASE_URL = 'mysql://root:@localhost:3306/hvc_ambassadors';
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  console.log('\n2. Running prisma db push...');
  const result = execSync('npx prisma db push', { 
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  console.log('Prisma output:');
  console.log(result);
  
  console.log('\n3. Testing database connection...');
  const testResult = execSync('npx prisma db pull', { 
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  console.log('Database test completed successfully!');
  console.log(testResult);
  
} catch (error) {
  console.error('Error during setup:', error.message);
  if (error.stdout) console.log('Stdout:', error.stdout);
  if (error.stderr) console.log('Stderr:', error.stderr);
}
