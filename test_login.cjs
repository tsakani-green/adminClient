// Test login functionality
const axios = require('axios');

const API_URL = 'http://localhost:8002';

async function testLogin() {
  try {
    console.log('Testing login with admin/admin123...');
    
    const params = new URLSearchParams();
    params.append('username', 'admin');
    params.append('password', 'admin123');

    const response = await axios.post(`${API_URL}/api/auth/login`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    
    // Test protected route
    console.log('\nTesting protected route...');
    const profileResponse = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`,
      },
    });
    
    console.log('Profile data:', profileResponse.data);
    
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
}

testLogin();
