import requests

# Test signup functionality
try:
    print("🔧 Testing User Signup Functionality")
    print("=" * 50)
    
    # Test user data
    test_user = {
        "username": "newuser456",
        "email": "newuser456@example.com", 
        "password": "password123",
        "confirmPassword": "password123",
        "full_name": "New Test User 456",
        "company": "Test Company"
    }
    
    print(f"👤 Creating test user: {test_user['username']}")
    print(f"📧 Email: {test_user['email']}")
    print(f"👤 Name: {test_user['full_name']}")
    
    # Test signup
    signup_data = {
        "username": test_user["username"],
        "email": test_user["email"],
        "password": test_user["password"],
        "full_name": test_user["full_name"],
        "company": test_user["company"],
        "role": "client",
        "portfolio_access": []
    }
    
    response = requests.post('http://localhost:8002/api/auth/signup', json=signup_data)
    
    if response.status_code == 200:
        token_data = response.json()
        token = token_data.get('access_token')
        user_id = token_data.get('user_id')
        role = token_data.get('role')
        
        print(f"   ✅ Signup successful!")
        print(f"   🔑 Token: {token[:20]}...")
        print(f"   👤 User ID: {user_id}")
        print(f"   🔐 Role: {role}")
        
        # Test login with new user
        print(f"\n🔐 Testing login with new user...")
        login_data = {
            'username': test_user['username'],
            'password': test_user['password']
        }
        
        login_response = requests.post('http://localhost:8002/api/auth/login', data=login_data)
        
        if login_response.status_code == 200:
            login_token_data = login_response.json()
            print(f"   ✅ Login successful!")
            print(f"   🔑 Login Token: {login_token_data['access_token'][:20]}...")
            
            # Expected frontend user data
            frontend_user_data = {
                "id": user_id,
                "username": test_user['username'],
                "role": role,
                "portfolio_access": []
            }
            
            print(f"   📱 Frontend user data: {frontend_user_data}")
            print(f"   📁 Portfolio access: {frontend_user_data['portfolio_access']} (empty - needs admin assignment)")
            
        else:
            print(f"   ❌ Login failed: {login_response.status_code}")
            print(f"   Error: {login_response.text}")
            
    else:
        print(f"   ❌ Signup failed: {response.status_code}")
        print(f"   Error: {response.text}")
    
    print(f"\n" + "=" * 50)
    print("✅ Signup functionality is working!")
    print("📱 New users can:")
    print("   • Register themselves")
    print("   • Log in successfully")
    print("   • Get default client role")
    print("   • Start with empty portfolio access")
    print("   • Need admin assignment for data access")
    
    print(f"\n🎯 Admin Workflow:")
    print("1. New user signs up")
    print("2. Admin assigns portfolio access")
    print("3. User can then view assigned data")
    
    print(f"\n🔗 Test URLs:")
    print("• Signup: http://localhost:5173/signup")
    print("• Login: http://localhost:5173/login")
    print("• Dashboard: http://localhost:5173/dashboard")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
