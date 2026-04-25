import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Fetch user profile from users table
    const user = await prisma.user.findFirst({
      where: {
        id: BigInt(userId)
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert BigInt to string for JSON serialization
    const userResponse = {
      ...user,
      id: user.id.toString()
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
