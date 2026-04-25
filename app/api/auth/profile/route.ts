import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // جلب أحدث مستخدم مسجل لنعرف حالته (Approved أو Pending)
    // ملاحظة: لاحقاً سنربط هذا بالـ ID الخاص بالجلسة الحقيقية
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        status: true,
        email: true,
      },
      orderBy: {
        id: 'desc'
      }
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}