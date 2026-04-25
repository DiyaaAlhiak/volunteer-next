const { PrismaClient } = require('@prisma/client');

async function testRegistration() {
  const prisma = new PrismaClient();
  
  try {
    // Test database connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✓ Database connection successful');
    
    // Test settings table
    console.log('Testing settings table...');
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      console.log('Creating default settings...');
      settings = await prisma.settings.create({
        data: {
          id: 1,
          allow_member_registration: true
        }
      });
    }
    console.log('✓ Settings table OK:', settings);
    
    // Test teams table
    console.log('Testing teams table...');
    const teams = await prisma.team.findMany({
      where: { status: 'accepted' }
    });
    console.log('✓ Found', teams.length, 'accepted teams');
    
    // Test creating a sample user (if no test user exists)
    console.log('Testing user creation...');
    const existingUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });
    
    if (!existingUser) {
      const testUser = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedpassword',
          phone: '0501234567',
          nationalId: '1234567890',
          organization: 'Test Org',
          jobTitle: 'Tester',
          roleInTeam: 'member',
          region: 'الرياض',
          city: 'الرياض'
        }
      });
      console.log('✓ Test user created:', testUser.username);
    } else {
      console.log('✓ Test user already exists');
    }
    
    console.log('\n🎉 All tests passed! Registration flow should work correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRegistration();
