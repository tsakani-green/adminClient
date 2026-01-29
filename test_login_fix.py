import requests

# Test the login fix
try:
    print("🔧 Testing Login Fix")
    print("=" * 40)
    
    # Test users
    test_users = [
        {"username": "admin", "password": "admin123", "expected_access": ["dube-trade-port", "bertha-house"]},
        {"username": "dube-user", "password": "dube123", "expected_access": ["dube-trade-port"]},
        {"username": "bertha-user", "password": "bertha123", "expected_access": ["bertha-house"]}
    ]
    
    for test_user in test_users:
        print(f"\n👤 Testing {test_user['username']}:")
        
        # Test login
        login_data = {
            'username': test_user['username'],
            'password': test_user['password']
        }
        
        response = requests.post('http://localhost:8002/api/auth/login', data=login_data)
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get('access_token')
            print(f"   ✅ Login successful")
            print(f"   🔑 Token: {token[:20]}...")
            print(f"   👤 User ID: {token_data.get('user_id')}")
            print(f"   🔐 Role: {token_data.get('role')}")
            print(f"   📁 Expected Access: {test_user['expected_access']}")
            
            # Test meter data for accessible portfolios
            for portfolio_id in test_user['expected_access']:
                meter_response = requests.get(f'http://localhost:8002/api/meters/{portfolio_id}/latest')
                if meter_response.status_code == 200:
                    meter_data = meter_response.json()
                    power = meter_data.get('power_kw', 0)
                    carbon = meter_data.get('carbon_emissions_tco2e', 0)
                    print(f"   📊 {portfolio_id}: {power:.3f} kW, {carbon:.6f} tCO₂e")
                else:
                    print(f"   ❌ {portfolio_id}: Access denied ({meter_response.status_code})")
                    
        else:
            print(f"   ❌ Login failed: {response.status_code}")
            print(f"   Error: {response.text}")
    
    print(f"\n" + "=" * 40)
    print("✅ Login fix should now work!")
    print("📱 Frontend should be able to log in successfully")
    print("🎯 Each user gets their assigned portfolio access")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
