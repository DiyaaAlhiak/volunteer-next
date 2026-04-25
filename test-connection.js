require('dotenv').config({path: '.env.local'});
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log('Testing database connection...');
    
    await prisma.$connect();
    console.log('Connected successfully!');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`Total users in database: ${userCount}`);
    
    // Get some sample users
    const users = await prisma.user.findMany({
      select: { name: true, username: true, email: true, role_name: true },
      take: 5
    });
    
    console.log('Sample users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.username}) - ${user.email} - Role: ${user.role_name}`);
    });
    
  } catch (error) {
    console.error('Connection error:', error.message);
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.log('\nConnection timeout detected. This usually means:');
      console.log('1. The database server is not running');
      console.log('2. Port 3306 is blocked by firewall');
      console.log('3. Your IP address is not whitelisted');
      console.log('4. The hostname pioneerseg.ddns.net is not reachable');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
