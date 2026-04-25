import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json();
    const cookieStore = await cookies();
    
    // 1. التعرف على المستخدم
    const userEmail = cookieStore.get('user_email')?.value;
    let user;

    if (userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } });
    }

    if (!user) {
      // احتياطي للتجربة فقط إذا لم نجد كوكي
      user = await prisma.user.findFirst({ orderBy: { id: 'desc' } });
    }

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
    }

    // 2. التحقق من وجود الكورس وتحويل النوع لـ Int
    const courseIdInt = parseInt(courseId);
    if (isNaN(courseIdInt)) {
      return NextResponse.json({ error: 'رقم كورس غير صالح' }, { status: 400 });
    }

    // 3. التحقق من التسجيل المسبق (لتجنب انفجار السيرفر بسبب الـ Unique Constraint)
    const existing = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseIdInt
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'أنت مسجل بالفعل في هذه الدورة' }, { status: 400 });
    }

    // 4. الحفظ في قاعدة البيانات (حسب حقول السكيما تبعتك بالظبط)
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId: user.id,
        courseId: courseIdInt,
        status: "in_progress", // القيمة الافتراضية في السكيما عندك
        // ملاحظة: حذفنا حقل progress لأنه غير موجود في السكيما تبعتك
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم التسجيل بنجاح',
      enrollment
    });

  } catch (error: any) {
    console.error('PRISMA ERROR:', error.message);
    return NextResponse.json(
      { error: 'خطأ في قاعدة البيانات: ' + error.message }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}