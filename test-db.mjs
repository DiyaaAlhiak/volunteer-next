// Temporary test script to check database connection and admins table
import { prisma } from './lib/prisma.js';

async function testDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Test query to get first 5 admins
    const allAdmins = await prisma.admins.findMany({ take: 5 });
    console.log('Found admins:', allAdmins);
    
    // Also test count
    const count = await prisma.admins.count();
    console.log('Total admins count:', count);
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
