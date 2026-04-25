const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  
  try {
    const prisma = new PrismaClient();
    
    // Test basic connection
    console.log('📡 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test if we can access settings table
    console.log('📋 Testing settings table access...');
    const settingsCount = await prisma.settings.count();
    console.log(`✅ Settings table accessible. Current records: ${settingsCount}`);
    
    // Create default settings if doesn't exist
    if (settingsCount === 0) {
      console.log('📝 Creating default settings...');
      const settings = await prisma.settings.create({
        data: {
          allow_team_registration: true,
          allow_member_registration: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('✅ Default settings created:', settings);
    } else {
      const existingSettings = await prisma.settings.findFirst();
      console.log('✅ Existing settings found:', existingSettings);
    }
    
    await prisma.$disconnect();
    console.log('✅ Database test completed successfully');
    
  } catch (error) {
    console.error('❌ Database test error:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

testDatabase();
