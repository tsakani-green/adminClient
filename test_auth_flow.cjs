// Test complete auth flow like the frontend
const axios = require('axios');

const API_URL = 'http://localhost:8002';

async function testAuthFlow() {
  try {
    console.log('🔐 Testing complete authentication flow...\n');
    
    // Step 1: Login
    console.log('1. Logging in...');
    const params = new URLSearchParams();
    params.append('username', 'admin');
    params.append('password', 'admin123');

    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const { access_token, user_id, role } = loginResponse.data;
    console.log('✅ Login successful!');
    console.log(`   Token: ${access_token.substring(0, 20)}...`);
    console.log(`   Role: ${role}`);
    console.log(`   User ID: ${user_id}\n`);
    
    // Step 2: Test protected endpoint
    console.log('2. Testing protected endpoint...');
    const profileResponse = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });
    
    console.log('✅ Profile endpoint accessible!');
    console.log(`   Username: ${profileResponse.data.username}`);
    console.log(`   Role: ${profileResponse.data.role}\n`);
    
    // Step 3: Test admin endpoint
    console.log('3. Testing admin endpoint...');
    const adminResponse = await axios.get(`${API_URL}/api/auth/admin/users`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });
    
    console.log('✅ Admin endpoint accessible!');
    console.log(`   Users count: ${adminResponse.data.users.length}\n`);
    
    // Step 4: Test meter endpoint
    console.log('4. Testing meter endpoint...');
    const meterResponse = await axios.get(`${API_URL}/api/meters/29-degrees-south/latest`);
    
    console.log('✅ Meter endpoint accessible!');
    console.log(`   Power: ${meterResponse.data.power_kw} kW\n`);
    
    console.log('🎉 All tests passed! Authentication is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Authentication flow failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('URL:', error.config.url);
      console.error('Data:', error.response.data);
    }
  }
}

testAuthFlow();
