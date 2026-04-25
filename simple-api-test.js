// Simple test to check API endpoint
const testData = {
  username: 'test_user_' + Date.now(),
  email: 'test' + Date.now() + '@example.com',
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

console.log('Test data:', JSON.stringify(testData, null, 2));

// Test with fetch (same as frontend)
fetch('http://localhost:3000/api/register/member', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Status:', response.status);
  return response.text();
})
.then(text => {
  console.log('Response:', text);
  try {
    const json = JSON.parse(text);
    console.log('Parsed:', JSON.stringify(json, null, 2));
  } catch (e) {
    console.log('Not JSON:', text);
  }
})
.catch(error => {
  console.error('Fetch error:', error.message);
  if (error.message.includes('ECONNREFUSED')) {
    console.log('❌ Server not running on port 3000');
  }
});
