require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  console.log('🔍 Checking database connection and tables...\n');
  
  const prisma = new PrismaClient();
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check Settings table
    console.log('\n📋 Checking Settings table...');
    const settingsCount = await prisma.settings.count();
    console.log(`Settings count: ${settingsCount}`);
    
    if (settingsCount === 0) {
      console.log('❌ Settings table is empty - this could cause API failure');
      console.log('Creating default settings...');
      await prisma.settings.create({
        data: { id: 1, allow_member_registration: true }
      });
      console.log('✅ Default settings created');
    } else {
      const settings = await prisma.settings.findFirst();
      console.log('✅ Settings found:', settings.allow_member_registration);
    }
    
    // Check Teams table
    console.log('\n👥 Checking Teams table...');
    const teamsCount = await prisma.team.count();
    console.log(`Teams count: ${teamsCount}`);
    
    if (teamsCount === 0) {
      console.log('❌ Teams table is empty - this could cause API failure');
      console.log('Creating sample team...');
      await prisma.team.create({
        data: {
          name: 'فريق اختبار',
          region: 'الرياض',
          city: 'الرياض',
          status: 'accepted'
        }
      });
      console.log('✅ Sample team created');
    } else {
      const teams = await prisma.team.findMany({
        where: { status: 'accepted' }
      });
      console.log(`✅ Found ${teams.length} accepted teams`);
    }
    
    // Check User table
    console.log('\n👤 Checking User table...');
    const usersCount = await prisma.user.count();
    console.log(`Users count: ${usersCount}`);
    
    console.log('\n🎉 Database check completed - all tables exist and have data');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
