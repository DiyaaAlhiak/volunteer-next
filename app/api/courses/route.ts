import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// 1. جلب الدورات (GET) مع التحقق من حالة التسجيل للمستخدم الحالي
export async function GET() {
  try {
    // جلب إيميل المستخدم من الكوكيز للتعرف على هويته
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user_email')?.value;

    // جلب المستخدم من القاعدة إذا وجد الإيميل
    const user = userEmail 
      ? await prisma.user.findUnique({ where: { email: userEmail } }) 
      : null;

    const courses = await prisma.course.findMany({
      include: {
        trainer: {
          select: { id: true, name: true }
        },
        // تضمين التسجيلات الخاصة بهذا المستخدم فقط للتأكد
        enrollments: user ? {
          where: { userId: user.id }
        } : false
      },
      orderBy: { id: 'desc' }
    });

    // تحويل البيانات لإضافة حقل isEnrolled بشكل ديناميكي
    const processedCourses = courses.map(course => {
      // إذا كان للمستخدم سجل في مصفوفة enrollments لهذا الكورس، فهو مسجل
      const isEnrolled = user && course.enrollments && course.enrollments.length > 0;
      
      return {
        ...course,
        isEnrolled: !!isEnrolled
      };
    });

    return NextResponse.json({ success: true, courses: processedCourses });
  } catch (error: any) {
    console.error("Fetch Courses Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. إنشاء دورة (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, duration, trainerId, status, description } = body;

    const cleanTrainerId = trainerId ? parseInt(trainerId.toString()) : null;

    const course = await prisma.course.create({
      data: {
        title,
        category,
        duration,
        description,
        status: status || 'active',
        trainerId: cleanTrainerId, 
      },
      include: {
        trainer: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error("Create Course Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. تحديث دورة (PUT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, category, duration, trainerId, status, description } = body;

    const course = await prisma.course.update({
      where: { id: parseInt(id.toString()) },
      data: {
        title,
        category,
        duration,
        description,
        status: status || 'active',
        trainerId: trainerId ? parseInt(trainerId.toString()) : null,
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 4. حذف دورة (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    // ملاحظة: الحذف سيحذف التسجيلات المرتبطة بسبب onDelete: Cascade في السكيما
    await prisma.course.delete({
      where: { id: parseInt(id.toString()) }
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}