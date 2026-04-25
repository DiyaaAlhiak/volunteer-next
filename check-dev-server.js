console.log('Checking if dev server is running...');

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/register/team',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Dev server is responding to API requests');
});

req.on('error', (error) => {
  console.error('Error connecting to dev server:', error.message);
  console.log('Dev server might not be running or not accessible');
});

req.end();
