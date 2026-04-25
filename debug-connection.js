require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  
  if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL length:', process.env.DATABASE_URL.length);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 20) + '...');
  }
  
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test if we can query the settings table
    console.log('Testing settings table...');
    const settingsCount = await prisma.settings.count();
    console.log(`✅ Settings table accessible, ${settingsCount} records found`);
    
    // Test if we can query the team table
    console.log('Testing team table...');
    const teamCount = await prisma.team.count();
    console.log(`✅ Team table accessible, ${teamCount} records found`);
    
    // Test if we can query the user table
    console.log('Testing user table...');
    const userCount = await prisma.user.count();
    console.log(`✅ User table accessible, ${userCount} records found`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
