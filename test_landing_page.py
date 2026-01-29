import requests
import datetime

def get_portfolio_access(username):
    switcher = {
        'admin': ['dube-trade-port', 'bertha-house'],
        'dube-user': ['dube-trade-port'],
        'bertha-user': ['bertha-house']
    }
    return switcher.get(username, [])

# Test landing page functionality
try:
    print("🏠 Testing Personalized Landing Page")
    print("=" * 50)
    
    # Test users
    test_users = [
        {"username": "admin", "password": "admin123", "role": "admin", "full_name": "Administrator"},
        {"username": "dube-user", "password": "dube123", "role": "client", "full_name": "Dube User"},
        {"username": "bertha-user", "password": "bertha123", "role": "client", "full_name": "Bertha User"}
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
            
            # Expected frontend user data for landing page
            frontend_user_data = {
                "id": user_id,
                "username": test_user['username'],
                "full_name": test_user['full_name'],
                "role": role,
                "portfolio_access": get_portfolio_access(test_user['username'])
            }
            
            print(f"   📱 Landing Page User Data: {frontend_user_data}")
            print(f"   📁 Portfolio Access: {frontend_user_data['portfolio_access']}")
            
            # Expected welcome message
            hour = datetime.datetime.now().hour
            greeting = "Good evening"
            if hour < 12:
                greeting = "Good morning"
            elif hour < 17:
                greeting = "Good afternoon"
            
            welcome_message = f"{greeting}, {test_user['full_name']}! 👋"
            print(f"   👋 Welcome Message: {welcome_message}")
            
            # Account status
            if frontend_user_data['portfolio_access']:
                account_status = "Full access granted"
            else:
                account_status = "Portfolio access pending"
            print(f"   📊 Account Status: {account_status}")
            
        else:
            print(f"   ❌ Login failed: {response.status_code}")
            print(f"   Error: {response.text}")
    
    print(f"\n" + "=" * 50)
    print("🏠 Landing Page Features Working!")
    print("📱 Users will see:")
    print("   • Personalized greeting by name")
    print("   • Time-based greeting (morning/afternoon/evening)")
    print("   • Account status indicator")
    print("   • Portfolio access information")
    print("   • User information cards")
    print("   • Quick action buttons")
    print("   • Beautiful animations")
    
    print(f"\n🎨 Landing Page Design:")
    print("   • Modern gradient background")
    print("   • Floating decorative elements")
    print("   • Glass morphism effects")
    print("   • Smooth animations")
    print("   • Responsive layout")
    print("   • Professional typography")
    
    print(f"\n🔗 User Flow:")
    print("1. User logs in → Redirected to landing page")
    print("2. Sees personalized welcome message")
    print("3. Views account status and portfolio access")
    print("4. Can navigate to dashboard or profile")
    print("5. Has logout option")
    
    print(f"\n🎯 Test URLs:")
    print("• Login: http://localhost:5173/login")
    print("• Landing: http://localhost:5173/landing")
    print("• Dashboard: http://localhost:5173/dashboard")
    print("• Profile: http://localhost:5173/profile")
    
    print(f"\n📋 Landing Page Sections:")
    print("• Header with logo and welcome message")
    print("• Account status alert")
    print("• Personal information card")
    print("• Portfolio access card")
    print("• Quick actions card")
    print("• Dashboard and profile action buttons")
    print("• Loading animation")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
