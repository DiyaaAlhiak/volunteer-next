import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // 1. جلب إيميل المستخدم من الكوكيز للتعرف على هويته الحقيقية
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user_email')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
    }

    // 2. البحث عن المستخدم في قاعدة البيانات لجلب الـ ID الخاص به
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // 3. جلب تسجيلات هذا المستخدم بالذات
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId: user.id }, // هنا استخدمنا الـ ID الحقيقي
      include: {
        course: {
          include: {
            trainer: true
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    });

    // 4. تحويل البيانات لتناسب الفرونت إند (مع حساب التقدم)
    const transformedEnrollments = enrollments.map(enrollment => ({
      id: enrollment.id,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      // بما أن السكيما لا تحتوي على حقل progress، نستخدم منطقاً يعتمد على الحالة
      progress: enrollment.status === 'completed' ? 100 : 
                enrollment.status === 'in_progress' ? 35 : 0, 
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        thumbnail: enrollment.course.thumbnail,
        duration: enrollment.course.duration,
        category: enrollment.course.category,
        trainer: enrollment.course.trainer ? enrollment.course.trainer.name : 'مدرب عام'
      }
    }));

    return NextResponse.json(transformedEnrollments);

  } catch (error: any) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الكورسات: ' + error.message },
      { status: 500 }
    );
  }
}