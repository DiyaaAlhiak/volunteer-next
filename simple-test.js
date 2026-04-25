const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Available models:');
console.log('- user:', !!prisma.user);
console.log('- team:', !!prisma.team);
console.log('- settings:', !!prisma.settings);

prisma.$disconnect();
