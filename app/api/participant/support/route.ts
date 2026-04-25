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

    // Fetch user's support tickets
    const tickets = await prisma.supportTicket.findMany({
      where: {
        senderEmail: userEmail
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      tickets
    });

  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { subject, category, message } = await request.json();

    if (!subject || !category || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
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

    // Create support ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        senderName: user.name || user.username || 'المستخدم',
        senderEmail: userEmail,
        subject: subject.trim(),
        message: message.trim(),
        status: 'new'
      }
    });

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Support ticket created successfully'
    });

  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
