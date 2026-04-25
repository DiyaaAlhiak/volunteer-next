import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Count enrolled courses from course_users table
    const coursesCount = await prisma.course_users.count({
      where: {
        user_id: BigInt(userId)
      }
    });

    // Count support tickets from tickets table
    const ticketsCount = await prisma.tickets.count({
      where: {
        user_id: BigInt(userId)
      }
    });

    const stats = {
      coursesCount,
      ticketsCount
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
