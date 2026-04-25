import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // 1. الحصول على إيميل المستخدم من الكوكيز (الشخص اللي عامل Login حالياً)
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user_email')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'غير مسجل دخول' }, { status: 401 });
    }

    // 2. البحث عن المستخدم الحقيقي بواسطة الإيميل
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        teamId: true
      }
    });

    // 3. إذا لم يوجد في جدول User، نبحث في جدول Admin (اختياري حسب نظامك)
    if (!user) {
      const admin = await prisma.admin.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true
        }
      });

      if (admin) {
        return NextResponse.json({
          id: admin.id,
          name: admin.name || admin.username,
          email: admin.email,
          role: 'admin',
          status: 'active'
        });
      }

      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // 4. إرجاع بيانات المستخدم الحالية (قائد أو مشارك)
    // ملاحظة: الرتبة ستكون إما 'participant' أو 'team_leader' حسب ما هو مخزن في DB
    return NextResponse.json({
      id: user.id,
      name: user.name || 'مستخدم',
      email: user.email,
      role: user.role, // ستكون ديناميكية 100%
      status: user.status,
      teamId: user.teamId
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'فشل في جلب بيانات المستخدم' },
      { status: 500 }
    );
  }
}