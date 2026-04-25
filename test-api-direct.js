const http = require('http');

async function testAPIEndpoint() {
  const testData = {
    username: 'test_user_' + Date.now(),
    email: `test_${Date.now()}@example.com`,
    password: 'testpassword123',
    phone: '0501234567',
    nationalId: '1234567890',
    region: 'الرياض',
    city: 'الرياض',
    organization: 'منظمة اختبار',
    jobTitle: 'مطور',
    roleInTeam: 'member',
    teamId: '1'
  };

  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/register/member',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🔍 Testing API endpoint directly...');
  console.log('Request data:', JSON.stringify(testData, null, 2));

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:', res.headers);

    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      console.log('Response body:', body);
      try {
        const jsonResponse = JSON.parse(body);
        console.log('Parsed response:', JSON.stringify(jsonResponse, null, 2));
      } catch (e) {
        console.log('Response is not valid JSON');
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e.message);
    if (e.message.includes('ECONNREFUSED')) {
      console.error('❌ Development server is not running on port 3000');
    }
  });

  req.write(postData);
  req.end();
}

testAPIEndpoint();
