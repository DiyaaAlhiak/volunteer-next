import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
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

    const enrollments = await prisma.enrollments.findMany({
      where: {
        userId: userId
      },
      select: {
        id: true,
        courseId: true,
        enrolled_at: true
      }
    });

    return NextResponse.json({
      success: true,
      enrollments
    });

  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch enrollments' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
