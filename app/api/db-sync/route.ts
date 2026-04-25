import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
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
      
      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(member.password, 10);
      console.log(`Password hashed for ${member.username}`);

      // Use upsert to avoid unique constraint errors
      const newUser = await prisma.admins.upsert({
        where: {
          email: member.email // Use email as unique identifier
        },
        update: {
          name: member.name,
          username: member.username,
          password: hashedPassword,
          role: 'editor',
          email_verified: 1
        },
        create: {
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

    return NextResponse.json({
      success: true,
      message: 'Team members synchronized successfully!',
      results: results,
      totalUsers: totalUsers
    });

  } catch (error) {
    console.error('Database sync error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to synchronize team members',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
