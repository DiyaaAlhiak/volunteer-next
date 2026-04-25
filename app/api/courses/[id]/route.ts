import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. جلب بيانات دورة واحدة
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const courseId = parseInt(resolvedParams.id);

    if (isNaN(courseId)) {
      return NextResponse.json({ success: false, error: "رقم الدورة غير صالح" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { trainer: true }
    });

    if (!course) {
      return NextResponse.json({ success: false, error: "الدورة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json({ success: false, error: "خطأ في جلب البيانات" }, { status: 500 });
  }
}

// 2. دالة التعديل - نسخة واحدة فقط ومنقحة
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const courseId = parseInt(resolvedParams.id);
    const body = await request.json();

    if (isNaN(courseId)) {
      return NextResponse.json({ success: false, error: "رقم الدورة غير صالح" }, { status: 400 });
    }

    // ملاحظة: قمت بحذف is_required و is_featured لأنها غير موجودة في الـ Schema الخاصة بك
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: body.title,
        category: body.category,
        duration: body.duration,
        videoUrl: body.videoUrl,    
        description: body.description,
        status: body.status || 'active',
        trainerId: body.trainerId ? parseInt(body.trainerId) : null,
      },
    });

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error: any) {
    console.error("Prisma Update Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: "فشل التحديث: " + error.message 
    }, { status: 500 });
  }
}

// 3. دالة الحذف
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.course.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "فشل الحذف من قاعدة البيانات" }, { status: 500 });
  }
}