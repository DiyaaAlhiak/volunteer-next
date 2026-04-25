// Test Prisma client
try {
  const { PrismaClient } = require('@prisma/client');
  console.log('PrismaClient imported successfully');
  
  const prisma = new PrismaClient();
  console.log('PrismaClient instantiated successfully');
  
  // Test if models exist
  if (prisma.user) {
    console.log('✓ User model available');
  } else {
    console.log('❌ User model not available');
  }
  
  if (prisma.team) {
    console.log('✓ Team model available');
  } else {
    console.log('❌ Team model not available');
  }
  
  if (prisma.settings) {
    console.log('✓ Settings model available');
  } else {
    console.log('❌ Settings model not available');
  }
  
  console.log('Available models:', Object.keys(prisma).filter(key => !key.startsWith('_') && typeof prisma[key] === 'object'));
  
} catch (error) {
  console.error('Error:', error.message);
}
