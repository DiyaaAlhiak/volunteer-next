require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function debugRegistrationAPI() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Debugging Registration API...\n');
    
    // 1. Test database connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected\n');
    
    // 2. Check Settings table
    console.log('2. Checking Settings table...');
    const settingsCount = await prisma.settings.count();
    console.log(`Settings count: ${settingsCount}`);
    
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      console.log('❌ No settings found, creating default...');
      settings = await prisma.settings.create({
        data: { id: 1, allow_member_registration: true }
      });
      console.log('✅ Default settings created');
    } else {
      console.log('✅ Settings found:', JSON.stringify(settings, null, 2));
    }
    console.log();
    
    // 3. Check Teams table
    console.log('3. Checking Teams table...');
    const teamsCount = await prisma.team.count();
    console.log(`Teams count: ${teamsCount}`);
    
    const teams = await prisma.team.findMany({
      where: { status: 'accepted' }
    });
    console.log('Accepted teams:', teams.map(t => ({ id: t.id, name: t.name, status: t.status })));
    console.log();
    
    // 4. Test user creation with sample data
    console.log('4. Testing user creation...');
    const testUserData = {
      username: 'debug_user_' + Date.now(),
      email: `debug_${Date.now()}@test.com`,
      password: 'testpassword123',
      phone: '0501234567',
      nationalId: '9876543210',
      region: 'الرياض',
      city: 'الرياض',
      organization: 'منظمة اختبار',
      jobTitle: 'مطور',
      roleInTeam: 'member',
      teamId: teams.length > 0 ? teams[0].id : 1
    };
    
    console.log('Test data:', JSON.stringify(testUserData, null, 2));
    
    // Check for existing user/email
    const existingUser = await prisma.user.findFirst({
      where: { email: testUserData.email }
    });
    
    if (existingUser) {
      console.log('ℹ️ Test user already exists, skipping creation');
    } else {
      console.log('Creating test user...');
      const newUser = await prisma.user.create({
        data: testUserData
      });
      console.log('✅ User created successfully:', newUser.id);
    }
    
    console.log('\n🎉 API debug completed successfully!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Full error details:', error);
    
    // Check for specific error types
    if (error.message.includes('Unique constraint')) {
      console.error('🔍 This is a unique constraint violation');
    }
    if (error.message.includes('foreign key')) {
      console.error('🔍 This is a foreign key constraint violation');
    }
    if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
      console.error('🔍 This is a database connection issue');
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

debugRegistrationAPI();
