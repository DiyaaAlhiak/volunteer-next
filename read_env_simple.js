const fs = require('fs');

try {
  const content = fs.readFileSync('.env', 'utf8');
  console.log('=== .env file content ===');
  console.log(content);
  console.log('=== end of file ===');
} catch (error) {
  console.error('Error reading .env:', error);
}
