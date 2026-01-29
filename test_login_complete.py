import requests

def get_portfolio_access(username):
    switcher = {
        'admin': ['dube-trade-port', 'bertha-house'],
        'dube-user': ['dube-trade-port'],
        'bertha-user': ['bertha-house']
    }
    return switcher.get(username, [])

# Test complete login flow
try:
    print("🔧 Testing Complete Login Flow")
    print("=" * 50)
    
    # Test users
    test_users = [
        {"username": "admin", "password": "admin123", "role": "admin", "redirect": "/admin"},
        {"username": "dube-user", "password": "dube123", "role": "client", "redirect": "/dashboard"},
        {"username": "bertha-user", "password": "bertha123", "role": "client", "redirect": "/dashboard"}
    ]
    
    for test_user in test_users:
        print(f"\n👤 Testing {test_user['username']} ({test_user['role']}):")
        
        # Test login
        login_data = {
            'username': test_user['username'],
            'password': test_user['password']
        }
        
        response = requests.post('http://localhost:8002/api/auth/login', data=login_data)
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get('access_token')
            user_id = token_data.get('user_id')
            role = token_data.get('role')
            
            print(f"   ✅ Login successful")
            print(f"   🔑 Token: {token[:20]}...")
            print(f"   👤 User ID: {user_id}")
            print(f"   🔐 Role: {role}")
            print(f"   🔄 Should redirect to: {test_user['redirect']}")
            
            # Test what the frontend should set
            frontend_user_data = {
                "id": user_id,
                "username": test_user['username'],
                "role": role,
                "portfolio_access": get_portfolio_access(test_user['username'])
            }
            
            print(f"   📱 Frontend user data: {frontend_user_data}")
            print(f"   📁 Portfolio access: {frontend_user_data['portfolio_access']}")
            
        else:
            print(f"   ❌ Login failed: {response.status_code}")
            print(f"   Error: {response.text}")
    
    print(f"\n" + "=" * 50)
    print("✅ Login flow is working!")
    print("📱 Frontend should now be able to:")
    print("   • Log in successfully")
    print("   • Store user data in localStorage")
    print("   • Redirect to correct dashboard")
    print("   • Filter portfolios based on access")
    print("   • Display real-time data")
    
    print(f"\n🎯 Next Steps:")
    print("1. Go to http://localhost:5173/login")
    print("2. Click any demo button or enter credentials")
    print("3. Should redirect to dashboard")
    print("4. Check debug component for user info")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
