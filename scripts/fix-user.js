const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createFixUser() {
  try {
    console.log('Creating/updating test user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('123456', 10);
    console.log('Password hashed successfully');
    
    // Upsert user - create if not exists, update if exists
    const user = await prisma.admins.upsert({
      where: {
        email: 'ahmed@gmail.com'
      },
      update: {
        username: 'ahmed',
        password: hashedPassword,
        role: '0',
        name: 'Ahmed Test User'
      },
      create: {
        email: 'ahmed@gmail.com',
        username: 'ahmed',
        password: hashedPassword,
        role: '0',
        name: 'Ahmed Test User'
      }
    });
    
    console.log('User upserted successfully:', {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      name: user.name
    });
    
    console.log('\n=== TEST USER CREDENTIALS ===');
    console.log('Email: ahmed@gmail.com');
    console.log('Username: ahmed');
    console.log('Password: 123456');
    console.log('Role: 0 (Participant)');
    console.log('==========================');
    
    // Verify user was created
    const verifyUser = await prisma.admins.findFirst({
      where: {
        OR: [
          { email: 'ahmed@gmail.com' },
          { username: 'ahmed' }
        ]
      }
    });
    
    if (verifyUser) {
      console.log('\nVERIFICATION: User found in database:', {
        id: verifyUser.id,
        email: verifyUser.email,
        username: verifyUser.username,
        role: verifyUser.role
      });
    } else {
      console.log('\nVERIFICATION FAILED: User not found after creation!');
    }
    
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createFixUser();
