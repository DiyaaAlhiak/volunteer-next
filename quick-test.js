const { PrismaClient } = require('@prisma/client');

async function quickTest() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing connection...');
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Test settings
    const settingsCount = await prisma.settings.count();
    console.log(`✅ Settings table: ${settingsCount} records`);
    
    // Test teams
    const teamsCount = await prisma.team.count();
    console.log(`✅ Teams table: ${teamsCount} records`);
    
    // Create default settings if needed
    if (settingsCount === 0) {
      await prisma.settings.create({
        data: { id: 1, allow_member_registration: true }
      });
      console.log('✅ Created default settings');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickTest();
