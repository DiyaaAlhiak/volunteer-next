import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // تأكد من صحة مسار prisma لديك
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // 1. جلب إيميل المستخدم من الكوكيز
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user_email')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    // 2. جلب بيانات المستخدم وتسجيلاته من قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        enrollments: {
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
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const enrollments = user.enrollments;

    // 3. حساب الإحصائيات بشكل ديناميكي وحقيقي
    const stats = {
      enrolledCourses: enrollments.length,
      completedCourses: enrollments.filter(e => e.status === 'completed').length,
      totalHours: enrollments.reduce((total, enrollment) => {
        // استخراج الأرقام من نص المدة (مثلاً "5 ساعات" تصبح 5)
        const duration = enrollment.course.duration || '';
        const hours = parseInt(duration.match(/\d+/)?.[0] || '0');
        return total + hours;
      }, 0),
      // الجوائز: نفترض جائزة لكل كورس مكتمل
      awards: enrollments.filter(e => e.status === 'completed').length 
    };

    // 4. تحويل بيانات الكورسات الأخيرة (أول 6 فقط للوحة التحكم)
    const recentCourses = enrollments.slice(0, 6).map(enrollment => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      duration: enrollment.course.duration,
      trainer: enrollment.course.trainer?.name || 'مدرب عام',
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      // التقدم: حالياً نستخدم 35% للقيد الدراسة و100% للمكتمل
      progress: enrollment.status === 'completed' ? 100 : 
                enrollment.status === 'in_progress' ? 35 : 0
    }));

    // 5. إرسال البيانات مع اسم المستخدم للترحيب به
    return NextResponse.json({
      user: { name: user.name },
      stats,
      recentCourses
    });

  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات لوحة التحكم' },
      { status: 500 }
    );
  }
}