import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId } = body;

    // Get user session from cookie
    const sessionCookie = request.cookies.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie);
    const userId = BigInt(session.id);

    // Check if user is already enrolled in this course
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: parseInt(session.id),
          courseId: parseInt(courseId)
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create new enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: parseInt(session.id),
        courseId: parseInt(courseId)
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment
    });

  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to enroll in course' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: parseInt(userId)
      },
      include: {
        course: {
          include: {
            trainer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      enrollments
    });

  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch enrollments' 
      },
      { status: 500 }
    );
  }
}
