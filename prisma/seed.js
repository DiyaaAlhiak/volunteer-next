const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Health Volunteering Platform database seeding...');

  try {
    // 1. Create default settings
    console.log('📋 Creating default settings...');
    const existingSettings = await prisma.settings.findFirst();
    
    if (!existingSettings) {
      const settings = await prisma.settings.create({
        data: {
          allow_team_registration: true,
          allow_member_registration: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('✅ Default settings created:', settings);
    } else {
      console.log('✅ Settings already exist:', existingSettings);
    }

    // 2. Create sample accepted team for testing
    console.log('👥 Creating sample teams...');
    const existingTeam = await prisma.team.findFirst({
      where: { email: 'test-team@volunteer.com' }
    });

    let sampleTeam;
    if (!existingTeam) {
      sampleTeam = await prisma.team.create({
        data: {
          name: 'فريق التطوع الصحي الأول',
          leader_name: 'أحمد محمد',
          email: 'test-team@volunteer.com',
          phone: '0501234567',
          region: 'الرياض',
          city: 'الرياض',
          nationalId: '1234567890',
          job: 'مدير صحة',
          organization: 'وزارة الصحة',
          status: 'accepted', // Set as accepted for member registration testing
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('✅ Sample team created:', sampleTeam);
    } else {
      sampleTeam = existingTeam;
      console.log('✅ Sample team already exists');
    }

    // 3. Create sample team leader user
    console.log('👤 Creating sample team leader...');
    const existingLeader = await prisma.user.findFirst({
      where: { email: 'leader@volunteer.com' }
    });

    if (!existingLeader) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const teamLeader = await prisma.user.create({
        data: {
          username: 'teamleader',
          email: 'leader@volunteer.com',
          password: hashedPassword,
          phone: '0501234568',
          nationalId: '1234567891',
          region: 'الرياض',
          city: 'الرياض',
          job: 'مدير صحة',
          organization: 'وزارة الصحة',
          role: 'team_leader',
          teamId: sampleTeam.id,
          status: 'approved', // Auto-approve for testing
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('✅ Sample team leader created:', teamLeader);
    } else {
      console.log('✅ Team leader already exists');
    }

    // 4. Create sample trainer
    console.log('👨‍🏫 Creating sample trainer...');
    const existingTrainer = await prisma.trainers.findFirst({
      where: { name: 'د. محمد أحمد' }
    });

    let sampleTrainer;
    if (!existingTrainer) {
      sampleTrainer = await prisma.trainers.create({
        data: {
          name: 'د. محمد أحمد',
          description: 'خبير في التطوع الصحي والتوعية الصحية مع أكثر من 10 سنوات خبرة في إدارة المبادرات المجتمعية',
          image: '/images/trainer-placeholder.jpg',
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('✅ Sample trainer created:', sampleTrainer);
    } else {
      sampleTrainer = existingTrainer;
      console.log('✅ Sample trainer already exists');
    }

    // 5. Create sample course
    console.log('📚 Creating sample course...');
    const existingCourse = await prisma.course.findFirst({
      where: { title: 'مبادئل التطوع الصحي' }
    });

    if (!existingCourse) {
      const sampleCourse = await prisma.course.create({
        data: {
          title: 'مبادئل التطوع الصحي',
          category: 'التطوع المجتمعي',
          duration: '4 أسابيع',
          trainerId: sampleTrainer.id,
          is_required: false,
          is_featured: true,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('✅ Sample course created:', sampleCourse);
    } else {
      console.log('✅ Sample course already exists');
    }

    // 6. Create admin user for dashboard access
    console.log('🔐 Creating admin user...');
    const existingAdmin = await prisma.admins.findFirst({
      where: { email: 'admin@volunteer.com' }
    });

    if (!existingAdmin) {
      const adminHashedPassword = await bcrypt.hash('admin123', 12);
      const admin = await prisma.admins.create({
        data: {
          name: 'مدير النظام',
          username: 'admin',
          email: 'admin@volunteer.com',
          password: adminHashedPassword,
          role: '1', // Admin role
          email_verified: 1,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('✅ Admin user created:', admin);
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@volunteer.com / admin123');
    console.log('Team Leader: leader@volunteer.com / password123');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
