const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default settings...');

  try {
    // Check if settings already exist
    const existingSettings = await prisma.settings.findFirst();
    
    if (existingSettings) {
      console.log('Settings already exist:', existingSettings);
      return;
    }

    // Create default settings
    const settings = await prisma.settings.create({
      data: {
        allow_team_registration: true,
        allow_member_registration: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    console.log('Default settings created:', settings);
  } catch (error) {
    console.error('Error creating settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
