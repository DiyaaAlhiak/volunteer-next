// Temporary test script to check database connection and admins table
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Connecting to database...');
    
    // Test query to get first 5 admins
    const allAdmins = await prisma.admins.findMany({ take: 5 });
    console.log('Found admins:', allAdmins);
    
    // Also test count
    const count = await prisma.admins.count();
    console.log('Total admins count:', count);
    
    // Create test user
    console.log('Creating test user...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const existingUser = await prisma.admins.findFirst({
      where: {
        OR: [
          { email: 'ahmed@gmail.com' },
          { username: 'ahmed' }
        ]
      }
    });

    if (existingUser) {
      console.log('User already exists, updating...');
      const updatedUser = await prisma.admins.update({
        where: { id: existingUser.id },
        data: {
          email: 'ahmed@gmail.com',
          username: 'ahmed',
          password: hashedPassword,
          role: '0',
          name: 'Ahmed Test User'
        }
      });
      console.log('User updated:', updatedUser);
    } else {
      console.log('Creating new user...');
      const newUser = await prisma.admins.create({
        data: {
          email: 'ahmed@gmail.com',
          username: 'ahmed',
          password: hashedPassword,
          role: '0',
          name: 'Ahmed Test User'
        }
      });
      console.log('User created:', newUser);
    }
    
    console.log('\nTest user credentials:');
    console.log('Email/Username: ahmed@gmail.com or ahmed');
    console.log('Password: 123456');
    console.log('Role: 0 (Participant)');
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
