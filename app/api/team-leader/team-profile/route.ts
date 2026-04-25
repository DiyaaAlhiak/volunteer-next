import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// GET - جلب بيانات الفريق الذي يقوده المستخدم الحالي
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user_email = cookieStore.get('user_email')?.value;

    if (!user_email) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    // 1. نجد المستخدم أولاً لنعرف أي فريق يتبع له
    const user = await prisma.user.findUnique({
      where: { email: user_email },
      select: { teamId: true }
    });

    if (!user || !user.teamId) {
      return NextResponse.json({ error: 'هذا المستخدم ليس عضواً أو قائداً لفريق' }, { status: 404 });
    }

    // 2. نأتي ببيانات الفريق بناءً على الـ teamId
    const team = await prisma.team.findUnique({
      where: { id: user.teamId }
    });

    if (!team) {
      return NextResponse.json({ error: 'بيانات الفريق غير موجودة' }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team profile:', error);
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 });
  }
}

// PUT - تحديث بيانات الفريق (اسم الفريق، المنطقة، المدينة)
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user_email = cookieStore.get('user_email')?.value;

    if (!user_email) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const body = await request.json();
    const { name, region, city, leader_name, phone } = body;

    // نجد الـ teamId المرتبط بالقائد
    const user = await prisma.user.findUnique({
      where: { email: user_email },
      select: { teamId: true }
    });

    if (!user || !user.teamId) {
      return NextResponse.json({ error: 'لا يمكن تحديث بيانات الفريق' }, { status: 404 });
    }

    // تحديث بيانات جدول الـ Team
    const updatedTeam = await prisma.team.update({
      where: { id: user.teamId },
      data: {
        name: name?.trim(),
        region: region?.trim(),
        city: city?.trim(),
        leader_name: leader_name?.trim(),
        phone: phone?.trim(),
      }
    });

    return NextResponse.json({
      message: 'تم تحديث بيانات الفريق بنجاح',
      team: updatedTeam
    });
  } catch (error) {
    console.error('Error updating team profile:', error);
    return NextResponse.json({ error: 'فشل في تحديث بيانات الفريق' }, { status: 500 });
  }
}