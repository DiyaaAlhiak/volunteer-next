const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
  if (fs.existsSync(envPath)) {
    const stats = fs.statSync(envPath);
    console.log(`.env file exists, size: ${stats.size} bytes`);
    
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('Content:');
    console.log(repr(content));
  } else {
    console.log('.env file does not exist');
  }
} catch (error) {
  console.error('Error:', error.message);
}

function repr(str) {
  return JSON.stringify(str);
}
