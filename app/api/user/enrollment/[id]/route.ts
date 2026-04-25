import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const courseId = parseInt(resolvedParams.id);
    
    if (isNaN(courseId)) {
      return NextResponse.json({ success: false, error: 'Invalid course ID' }, { status: 400 });
    }

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

    // Find enrollment for this course
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Not enrolled in this course' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      enrollment
    });

  } catch (error) {
    console.error('Error fetching enrollment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
