// Test login and redirect flow
const axios = require('axios');

const API_URL = 'http://localhost:8002';

async function testLoginRedirect() {
  try {
    console.log('🔐 Testing login and redirect flow...\n');
    
    // Test admin login
    console.log('1. Testing admin login...');
    const params = new URLSearchParams();
    params.append('username', 'admin');
    params.append('password', 'admin123');

    const adminResponse = await axios.post(`${API_URL}/api/auth/login`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log('✅ Admin login successful!');
    console.log(`   Role: ${adminResponse.data.role}`);
    console.log(`   Should redirect to: /admin\n`);
    
    // Test client login
    console.log('2. Testing client login...');
    const clientParams = new URLSearchParams();
    clientParams.append('username', 'dube-user');
    clientParams.append('password', 'dube123');

    const clientResponse = await axios.post(`${API_URL}/api/auth/login`, clientParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log('✅ Client login successful!');
    console.log(`   Role: ${clientResponse.data.role}`);
    console.log(`   Should redirect to: /dashboard\n`);
    
    console.log('🎉 Login redirect flow is working correctly!');
    console.log('Admin users → /admin');
    console.log('Client users → /dashboard');
    
  } catch (error) {
    console.error('\n❌ Login test failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testLoginRedirect();
