const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function syncTeamMembers() {
  try {
    console.log('Starting team member synchronization...');

    // Team members data - focus on Talat and Mai (Ahmed already exists)
    const teamMembers = [
      {
        name: 'Talat',
        email: 'Talat.alsobhi@hotmail.com',
        username: 'talat',
        password: 'P@55w0rd'
      },
      {
        name: 'Mai',
        email: 'maiooi558@yopmail.com',
        username: 'mai',
        password: 'P@55w0rd'
      }
    ];

    const results = [];

    for (const member of teamMembers) {
      console.log(`Processing user: ${member.username}`);
      
      // Check if user already exists
      const existingUser = await prisma.admins.findFirst({
        where: {
          OR: [
            { username: member.username },
            { email: member.email }
          ]
        }
      });

      if (existingUser) {
        console.log(`User ${member.username} already exists, skipping...`);
        results.push({ username: member.username, status: 'exists' });
        continue;
      }

      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(member.password, 10);
      console.log(`Password hashed for ${member.username}`);

      // Create user
      const newUser = await prisma.admins.create({
        data: {
          name: member.name,
          username: member.username,
          email: member.email,
          password: hashedPassword,
          role: 'editor',
          email_verified: 1
        }
      });

      console.log(`Created user: ${newUser.username} (ID: ${newUser.id})`);
      results.push({ username: member.username, status: 'created', id: newUser.id });
    }

    // Verify total count after sync
    const totalUsers = await prisma.admins.count();
    console.log(`Total users after sync: ${totalUsers}`);

    console.log('Team members synchronized successfully!');
    console.log('Results:', results);

  } catch (error) {
    console.error('Database sync error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncTeamMembers();
