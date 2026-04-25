require('dotenv').config({path: '.env.local'});
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifySeed() {
  try {
    console.log('Verifying seeded data...\n');
    
    // Check users
    const userCount = await prisma.user.count();
    console.log(`Total users: ${userCount}`);
    
    const users = await prisma.user.findMany({
      select: { name: true, username: true, email: true, role_name: true, status: true },
      take: 10
    });
    
    console.log('\nUsers:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.username}) - ${user.email} - Role: ${user.role_name} - Status: ${user.status}`);
    });
    
    // Check admins
    const adminCount = await prisma.admins.count();
    console.log(`\nTotal admins: ${adminCount}`);
    
    const admins = await prisma.admins.findMany({
      select: { name: true, username: true, email: true, role: true }
    });
    
    console.log('\nAdmins:');
    admins.forEach(admin => {
      console.log(`- ${admin.name} (${admin.username}) - ${admin.email} - Role: ${admin.role}`);
    });
    
    // Check teams
    const teamCount = await prisma.team.count();
    console.log(`\nTotal teams: ${teamCount}`);
    
    const teams = await prisma.team.findMany({
      select: { name: true, status: true }
    });
    
    console.log('\nTeams:');
    teams.forEach(team => {
      console.log(`- ${team.name} - Status: ${team.status}`);
    });
    
  } catch (error) {
    console.error('Error verifying seed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifySeed();
