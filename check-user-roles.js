const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserRoles() {
  try {
    console.log('=== CHECKING USER ROLES ===');
    
    // Check specific users
    const users = await prisma.admins.findMany({
      where: {
        OR: [
          { username: { contains: 'talat', mode: 'insensitive' } },
          { username: { contains: 'ahmed', mode: 'insensitive' } },
          { username: { contains: 'mai', mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        name: true
      }
    });
    
    console.log('\nFOUND USERS:');
    users.forEach(user => {
      console.log(`✓ ${user.name} (${user.username}): ${user.email} -> Role: "${user.role}"`);
    });
    
    // Check if roles need fixing
    const updates = [];
    
    users.forEach(user => {
      if (user.username.toLowerCase().includes('talat') && user.role !== '1') {
        updates.push({ id: user.id, role: '1', name: user.name });
      }
      if ((user.username.toLowerCase().includes('ahmed') || user.username.toLowerCase().includes('mai')) && user.role !== '0') {
        updates.push({ id: user.id, role: '0', name: user.name });
      }
    });
    
    if (updates.length > 0) {
      console.log('\n=== FIXING ROLES ===');
      for (const update of updates) {
        await prisma.admins.update({
          where: { id: update.id },
          data: { role: update.role }
        });
        console.log(`✓ Fixed ${update.name}: Role set to "${update.role}"`);
      }
    } else {
      console.log('\n✓ All roles are correct!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRoles();
