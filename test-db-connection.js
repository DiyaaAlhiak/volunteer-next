const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Count users
    const count = await prisma.admins.count();
    console.log(`Total users in database: ${count}`);
    
    // List all users
    const users = await prisma.admins.findMany({
      select: { username: true, email: true, name: true }
    });
    console.log('Current users:', users);
    
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
