const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Check if user already exists
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
      // Update existing user
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
      // Create new user
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
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
