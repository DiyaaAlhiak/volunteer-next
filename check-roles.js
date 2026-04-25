const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRoles() {
  try {
    console.log('Checking user roles in database...');
    
    const users = await prisma.admins.findMany({
      where: {
        OR: [
          { email: { contains: 'ahmed' } },
          { email: { contains: 'Talat' } },
          { email: { contains: 'mai' } }
        ]
      },
      select: {
        username: true,
        email: true,
        role: true,
        name: true
      }
    });
    
    console.log('USER ROLES FOUND:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.username}): ${user.email} -> Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error('Error checking roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRoles();
