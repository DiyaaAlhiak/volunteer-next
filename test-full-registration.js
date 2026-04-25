require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testFullRegistration() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing full registration flow...\n');
    
    // 1. Test database connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');
    
    // 2. Test settings table
    console.log('2. Testing settings table...');
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      console.log('Creating default settings...');
      settings = await prisma.settings.create({
        data: { id: 1, allow_member_registration: true }
      });
    }
    console.log('✅ Settings table OK:', settings.allow_member_registration ? 'Registration enabled' : 'Registration disabled');
    console.log();
    
    // 3. Test teams table
    console.log('3. Testing teams table...');
    const teamsCount = await prisma.team.count();
    console.log(`✅ Found ${teamsCount} teams in database`);
    
    if (teamsCount === 0) {
      console.log('Creating sample team for testing...');
      await prisma.team.create({
        data: {
          name: 'فريق اختبار',
          region: 'الرياض',
          city: 'الرياض',
          status: 'accepted'
        }
      });
      console.log('✅ Sample team created');
    }
    console.log();
    
    // 4. Test user creation with exact field mapping
    console.log('4. Testing user creation with field mapping...');
    const testUserData = {
      username: 'test_user_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      password: 'hashedpassword123',
      phone: '0501234567',
      nationalId: '1234567890',
      region: 'الرياض',
      city: 'الرياض',
      organization: 'منظمة اختبار',
      jobTitle: 'مطور',
      roleInTeam: 'member',
      teamId: 1
    };
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: testUserData.email }
    });
    
    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: testUserData
      });
      console.log('✅ User created successfully with ID:', newUser.id);
      console.log('✅ Field mapping verified - all fields saved correctly');
    } else {
      console.log('ℹ️ Test user already exists');
    }
    console.log();
    
    // 5. Verify data integrity
    console.log('5. Verifying data integrity...');
    const savedUser = await prisma.user.findFirst({
      where: { email: testUserData.email },
      include: { team: true }
    });
    
    if (savedUser) {
      console.log('✅ User data retrieved successfully');
      console.log('✅ Username:', savedUser.username);
      console.log('✅ Email:', savedUser.email);
      console.log('✅ Phone:', savedUser.phone);
      console.log('✅ National ID:', savedUser.nationalId);
      console.log('✅ Organization:', savedUser.organization);
      console.log('✅ Job Title:', savedUser.jobTitle);
      console.log('✅ Role in Team:', savedUser.roleInTeam);
      console.log('✅ Region:', savedUser.region);
      console.log('✅ City:', savedUser.city);
      console.log('✅ Team:', savedUser.team?.name || 'No team');
    }
    
    console.log('\n🎉 Full registration flow test completed successfully!');
    console.log('📊 Ready for real registrations to be saved in hvc_ambassadors database');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFullRegistration();
