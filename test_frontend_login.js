// Test frontend login exactly as the app does
const axios = require('axios');

// Simulate the frontend environment
const API_URL = 'http://localhost:8002';

async function testFrontendLogin() {
  try {
    console.log('Testing frontend login method...');
    
    // This is exactly how the frontend does it now
    const params = new URLSearchParams();
    params.append('username', 'admin');
    params.append('password', 'admin123');

    console.log('Sending request to:', `${API_URL}/api/auth/login`);
    console.log('Headers:', {
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    console.log('Body:', params.toString());

    const response = await axios.post(`${API_URL}/api/auth/login`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log('\n✅ Login successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    // Test storing token (like frontend does)
    const { access_token, user_id, role } = response.data;
    console.log('\n📝 Storing token and user info...');
    console.log('Token length:', access_token.length);
    console.log('User ID:', user_id);
    console.log('Role:', role);
    
    // Test accessing protected route
    console.log('\n🔒 Testing protected route...');
    const profileResponse = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });
    
    console.log('✅ Protected route accessible!');
    console.log('Profile:', profileResponse.data);
    
  } catch (error) {
    console.error('\n❌ Login failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    }
  }
}

testFrontendLogin();
