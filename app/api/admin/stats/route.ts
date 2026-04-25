import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Security: Check if user is admin
    const session = await getAdminSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Data Fetching: Get statistics from database
    const [
      totalUsers,
      pendingUsers,
      activeCourses,
      enrolledTotal
    ] = await Promise.all([
      // Count of all users
      prisma.user.count(),
      
      // Count of users with status: 'pending'
      prisma.user.count({
        where: { status: 'pending' }
      }),
      
      // Total count of courses
      prisma.course.count({
        where: { status: 'active' }
      }),
      
      // Static number for enrolled users (can be updated later)
      // This would ideally come from an enrollment table
      prisma.user.count({
        where: { 
          status: 'approved',
          role: 'participant'
        }
      })
    ]);

    // Return statistics
    return NextResponse.json({
      totalUsers,
      pendingUsers,
      activeCourses,
      enrolledTotal
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    // Error Handling: Return 500 status if database query fails
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
