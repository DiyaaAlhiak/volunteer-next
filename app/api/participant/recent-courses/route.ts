import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the current user ID from session or authentication
    // For now, we'll use a placeholder - you should implement proper auth
    const userId = 1; // This should come from your auth system

    // Get user's recent enrollments with course details
    const recentEnrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            trainer: true
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      },
      take: 6 // Limit to 6 recent courses
    });

    // Transform data for frontend
    const recentCourses = recentEnrollments.map(enrollment => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      duration: enrollment.course.duration,
      trainer: enrollment.course.trainer,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      progress: enrollment.status === 'completed' ? 100 : enrollment.status === 'in_progress' ? 50 : 0
    }));

    return NextResponse.json(recentCourses);
  } catch (error) {
    console.error('Error fetching recent courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent courses' },
      { status: 500 }
    );
  }
}
