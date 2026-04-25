import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// أفضل ممارسة: استخدام instance واحدة من بريزما لمنع استهلاك التوصيلات
const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 1. فك تشفير params باستخدام await ليتوافق مع Next.js الحديث
    const { id } = await params;
    const userId = parseInt(id);
    
    // 2. استخراج البيانات من الـ Request
    const { status } = await request.json();

    // 3. التحقق من صحة ID المستخدم
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم غير صحيح' },
        { status: 400 }
      );
    }

    // 4. التحقق من صحة قيمة الحالة
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'الحالة المرسلة غير صالحة' },
        { status: 400 }
      );
    }

    // 5. تحديث حالة المستخدم في قاعدة البيانات
    // ملاحظة: تأكد أن الحقول (status, role) موجودة في الـ User model
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        status: status,
        // نقوم بتحديث الـ role إلى participant أو volunteer حسب منطق مشروعك
        role: status === 'approved' ? 'volunteer' : 'participant'
      },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        role: true,
        teamId: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `تم تحديث حالة المستخدم إلى ${status === 'approved' ? 'مقبول' : status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'} بنجاح`,
      user: updatedUser
    });

  } catch (error: any) {
    console.error('Error updating user status:', error);
    
    // معالجة خطأ Prisma في حال عدم وجود المستخدم
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود في قاعدة البيانات' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'حدث خطأ داخلي أثناء تحديث الحالة' },
      { status: 500 }
    );
  } finally {
    // اختياري: في Next.js API Routes يفضل عدم عمل disconnect يدوي في كل مرة
    // إلا إذا كنت تواجه مشاكل في عدد الاتصالات
    await prisma.$disconnect();
  }
}