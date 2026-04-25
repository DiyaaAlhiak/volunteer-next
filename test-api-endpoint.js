console.log('Testing API endpoint...');

const http = require('http');

const testData = {
  teamName: 'Test Team',
  leaderName: 'Test Leader',
  email: 'test@example.com',
  phone: '1234567890',
  region: 'Test Region',
  city: 'Test City',
  nationalId: '123456789',
  job: 'Test Job',
  organization: 'Test Organization'
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/register/team',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(postData);
req.end();
