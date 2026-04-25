const fs = require('fs');

try {
  const envContent = fs.readFileSync('.env', 'utf8');
  console.log('Current .env content:');
  console.log(envContent);
} catch (error) {
  console.error('Error reading .env file:', error.message);
}
