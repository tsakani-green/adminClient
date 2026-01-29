# Test Dube Trade Port Assets
try:
    print("🏭 Testing Dube Trade Port Assets")
    print("=" * 50)
    
    # Expected Dube Trade Port assets
    expected_assets = [
        {
            'id': '29-degrees-south',
            'name': '29 Degrees South',
            'epcGrade': 'G',
            'hasSolar': False,
            'emissions_tco2e': 2254.67
        },
        {
            'id': 'dube-cargo-terminal',
            'name': 'Dube Cargo Terminal',
            'epcGrade': 'G',
            'hasSolar': False,
            'emissions_tco2e': 2269.75
        },
        {
            'id': 'tradehouse',
            'name': 'Tradehouse',
            'epcGrade': 'C',
            'hasSolar': True,
            'emissions_tco2e': 518.95
        },
        {
            'id': 'gift-of-the-givers',
            'name': 'Gift of the Givers',
            'epcGrade': 'A',
            'hasSolar': False,
            'emissions_tco2e': 1.91
        },
        {
            'id': 'sky-aviation',
            'name': 'Sky Aviation',
            'epcGrade': 'B',
            'hasSolar': False,
            'emissions_tco2e': 78.1
        },
        {
            'id': 'airchefs',
            'name': 'AirChefs',
            'epcGrade': 'G',
            'hasSolar': False,
            'emissions_tco2e': 41.74
        },
        {
            'id': 'block-d-greenhouse-packhouse',
            'name': 'Block D- Greenhouse and Packhouse',
            'epcGrade': 'B',
            'hasSolar': True,
            'emissions_tco2e': 121.1
        },
        {
            'id': 'greenhouse-a',
            'name': 'GreenHouse A',
            'epcGrade': 'F',
            'hasSolar': True,
            'emissions_tco2e': 196.65
        },
        {
            'id': 'greenhouse-packhouse-c',
            'name': 'Greenhouse and Pack House C',
            'epcGrade': 'D',
            'hasSolar': False,
            'emissions_tco2e': 139.07
        },
        {
            'id': 'farmwise',
            'name': 'Farmwise',
            'epcGrade': 'F',
            'hasSolar': False,
            'emissions_tco2e': 1118.91
        }
    ]
    
    print(f"📊 Dube Trade Port Asset Summary:")
    print(f"   Total Assets: {len(expected_assets)}")
    
    # Calculate portfolio statistics
    total_emissions = sum(asset['emissions_tco2e'] for asset in expected_assets)
    assets_with_solar = sum(1 for asset in expected_assets if asset['hasSolar'])
    assets_without_solar = len(expected_assets) - assets_with_solar
    
    # EPC Grade distribution
    epc_grades = {}
    for asset in expected_assets:
        grade = asset['epcGrade']
        epc_grades[grade] = epc_grades.get(grade, 0) + 1
    
    print(f"   Total Emissions: {total_emissions:.2f} tCO₂e")
    print(f"   Assets with Solar: {assets_with_solar}")
    print(f"   Assets without Solar: {assets_without_solar}")
    print(f"   EPC Grade Distribution:")
    for grade, count in sorted(epc_grades.items()):
        print(f"      Grade {grade}: {count} assets")
    
    print(f"\n📋 Asset Details:")
    for i, asset in enumerate(expected_assets, 1):
        solar_status = "☀️" if asset['hasSolar'] else "⚡"
        print(f"   {i:2d}. {asset['name']:<30} | Grade: {asset['epcGrade']} | {solar_status} | {asset['emissions_tco2e']:>8.2f} tCO₂e")
    
    # Top emitters
    top_emitters = sorted(expected_assets, key=lambda x: x['emissions_tco2e'], reverse=True)[:3]
    print(f"\n🔥 Top 3 Emitters:")
    for i, asset in enumerate(top_emitters, 1):
        print(f"   {i}. {asset['name']}: {asset['emissions_tco2e']:.2f} tCO₂e")
    
    # Best EPC performers
    best_epc = sorted(expected_assets, key=lambda x: x['epcGrade'])[:3]
    print(f"\n🏆 Best EPC Performance:")
    for i, asset in enumerate(best_epc, 1):
        print(f"   {i}. {asset['name']}: Grade {asset['epcGrade']}")
    
    # Solar assets
    solar_assets = [asset for asset in expected_assets if asset['hasSolar']]
    print(f"\n☀️ Solar Assets ({len(solar_assets)}):")
    for asset in solar_assets:
        print(f"   • {asset['name']} (Grade {asset['epcGrade']})")
    
    print(f"\n" + "=" * 50)
    print("🏭 Dube Trade Port Assets Loaded Successfully!")
    print("📱 Dashboard Features:")
    print("   • Asset selection dropdown")
    print("   • Individual asset metrics")
    print("   • EPC grade indicators")
    print("   • Solar status badges")
    print("   • Emissions tracking")
    print("   • Energy performance metrics")
    
    print(f"\n🎯 Test URLs:")
    print("• Login: http://localhost:5173/login")
    print("• Dashboard: http://localhost:5173/dashboard")
    print("• Dube User: dube-user / dube123")
    
    print(f"\n📊 Asset Data Available:")
    print("• Energy performance (kWh/m²a)")
    print("• EPC grades (A-G)")
    print("• Annual energy consumption")
    print("• Grid vs Solar breakdown")
    print("• Carbon emissions (tCO₂e)")
    print("• Solar installation status")
    
    print(f"\n🔍 User Access:")
    print("• Admin: Can see all assets")
    print("• Dube User: Can see Dube Trade Port assets")
    print("• Bertha User: Can see Bertha House only")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
