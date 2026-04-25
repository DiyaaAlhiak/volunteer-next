import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // يفضل استخدام النسخة الموحدة من بريزما
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // جلب الإيميل من الكوكيز (التأكد من هوية المستخدم المتصل)
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user_email')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    // جلب بيانات المستخدم بناءً على الإيميل
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        nationalId: true,
        region: true,
        city: true,
        jobTitle: true,
        organization: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // تنظيف البيانات لضمان عدم إرسال null للحقول الأساسية في الـ Frontend
    const safeUser = {
      ...user,
      name: user.name || '',
      phone: user.phone || '',
      region: user.region || '',
      city: user.city || '',
      jobTitle: user.jobTitle || '',
      organization: user.organization || '',
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل بيانات الملف الشخصي' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user_email')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, region, city, jobTitle, organization } = body;

    // التحقق من الحقول المطلوبة
    if (!name || !phone || !region || !city) {
      return NextResponse.json(
        { error: 'الاسم، الهاتف، المنطقة، والمدينة حقول مطلوبة' },
        { status: 400 }
      );
    }

    // تحديث ملف المستخدم بناءً على الإيميل
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        name: name.trim(),
        phone: phone.trim(),
        region: region.trim(),
        city: city.trim(),
        jobTitle: jobTitle || null,
        organization: organization || null
      }
    });

    return NextResponse.json({
      message: 'تم تحديث الملف الشخصي بنجاح',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الملف الشخصي' },
      { status: 500 }
    );
  }
}