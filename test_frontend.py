import requests

# Test if frontend can reach backend
try:
    print("🔍 Testing Frontend-Backend Connection")
    print("=" * 50)
    
    # Test backend health
    print("1. Testing backend health...")
    response = requests.get('http://localhost:8002/api/auth/login', 
                           data={'username': 'test', 'password': 'test'})
    print(f"   Backend Status: {response.status_code}")
    
    # Test meter endpoint
    print("2. Testing meter endpoint...")
    response = requests.get('http://localhost:8002/api/meters/bertha-house/latest')
    print(f"   Meter Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Bertha House Data: {data.get('power_kw', 0):.3f} kW")
    
    print("\n✅ Backend is running and accessible")
    print("📱 Frontend should be able to connect")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    print("🚫 Backend may not be running")
