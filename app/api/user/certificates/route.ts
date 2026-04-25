import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get user email from cookies
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user_email')?.value;

    if (!userEmail) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Fetch completed enrollments with course details
    const completedEnrollments = await prisma.courseEnrollment.findMany({
      where: {
        userId: user.id,
        status: 'completed'
      },
      include: {
        course: {
          select: {
            title: true,
            instructorName: true,
            duration: true,
            volunteerHours: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    // Transform data for frontend
    const certificates = completedEnrollments.map(enrollment => ({
      id: enrollment.id,
      courseTitle: enrollment.course.title,
      instructorName: enrollment.course.instructorName || 'المدرب',
      duration: enrollment.course.duration || 'غير محدد',
      volunteerHours: enrollment.course.volunteerHours || 0,
      completedAt: enrollment.completedAt?.toISOString() || new Date().toISOString(),
      userName: user.name || user.username || 'المتسجل'
    }));

    return NextResponse.json({
      success: true,
      certificates
    });

  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
