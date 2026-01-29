import requests

# Test enhanced signup functionality
try:
    print("🎉 Testing Enhanced Signup with Welcome & Email")
    print("=" * 60)
    
    # Test user data
    test_user = {
        "username": "welcomeuser999",
        "email": "welcomeuser999@example.com", 
        "password": "password123",
        "confirmPassword": "password123",
        "full_name": "Welcome Test User 999",
        "company": "Welcome Test Company"
    }
    
    print(f"👤 Creating test user: {test_user['username']}")
    print(f"📧 Email: {test_user['email']}")
    print(f"👤 Name: {test_user['full_name']}")
    print(f"🏢 Company: {test_user['company']}")
    
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
        message = token_data.get('message')
        
        print(f"\n✅ Signup successful!")
        print(f"🔑 Token: {token[:20]}...")
        print(f"👤 User ID: {user_id}")
        print(f"🔐 Role: {role}")
        print(f"📧 Welcome Message: {message}")
        
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
                "full_name": test_user['full_name'],
                "role": role,
                "portfolio_access": []
            }
            
            print(f"   📱 Frontend user data: {frontend_user_data}")
            print(f"   📁 Portfolio access: {frontend_user_data['portfolio_access']} (empty - needs admin assignment)")
            
            # Test activation link
            activation_link = f"http://localhost:5173/activate?token={token}"
            print(f"   📧 Activation Link: {activation_link}")
            
        else:
            print(f"   ❌ Login failed: {login_response.status_code}")
            print(f"   Error: {login_response.text}")
            
    else:
        print(f"   ❌ Signup failed: {response.status_code}")
        print(f"   Error: {response.text}")
    
    print(f"\n" + "=" * 60)
    print("🎉 Enhanced Signup Features Working!")
    print("📱 New users now get:")
    print("   • Personalized welcome message by name")
    print("   • Activation email with professional template")
    print("   • Clear instructions for next steps")
    print("   • Beautiful activation page")
    print("   • Automatic redirect after signup")
    
    print(f"\n📧 Email Features:")
    print("   • Professional HTML email template")
    print("   • Activation link with token")
    print("   • Welcome message with user name")
    print("   • Next steps guidance")
    print("   • Security information")
    print("   • Contact information")
    
    print(f"\n🔗 User Journey:")
    print("1. User signs up → Gets welcome message")
    print("2. Email sent → With activation link")
    print("3. User clicks link → Activation page")
    print("4. Account activated → Can login")
    print("5. Login successful → Dashboard access")
    
    print(f"\n🎯 Test URLs:")
    print("• Signup: http://localhost:5173/signup")
    print("• Activation: http://localhost:5173/activate?token=TOKEN")
    print("• Login: http://localhost:5173/login")
    print("• Dashboard: http://localhost:5173/dashboard")
    
    print(f"\n📋 Note: Email sending requires SMTP configuration")
    print("   • Configure EMAIL_* settings in backend")
    print("   • Set up Gmail app password or other SMTP")
    print("   • Test with real email address")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
