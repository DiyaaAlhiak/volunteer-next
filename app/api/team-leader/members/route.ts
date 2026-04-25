import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma'; // التأكد من استخدام الأقواس {}

// GET - جلب جميع أعضاء الفريق للقائد المسجل دخوله
export async function GET(request: NextRequest) {
  try {
    // 1. جلب إيميل المستخدم من الكوكيز
    const cookieStore = await cookies();
    const user_email = cookieStore.get('user_email')?.value;

    if (!user_email) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    // 2. البحث عن المستخدم (القائد) لجلب الـ teamId الخاص به
    const leader = await prisma.user.findUnique({
      where: { email: user_email },
      select: { teamId: true }
    });

    if (!leader || !leader.teamId) {
      return NextResponse.json({ error: 'لم يتم العثور على فريق لهذا القائد' }, { status: 404 });
    }

    // 3. جلب جميع المستخدمين المنتمين لنفس الفريق
    const teamMembers = await prisma.user.findMany({
      where: { 
        teamId: leader.teamId,
        role: 'volunteer' // جلب المتطوعين فقط (تجنب جلب القائد نفسه في الجدول إذا أردت)
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        region: true,
        city: true,
        nationalId: true,
        jobTitle: true,
        organization: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // 4. تنسيق البيانات المرسلة للواجهة الأمامية
    const formattedMembers = teamMembers.map(member => ({
      id: member.id,
      name: member.name || 'غير محدد',
      email: member.email,
      phone: member.phone || 'غير محدد',
      status: member.status || 'pending',
      joinDate: member.createdAt,
      region: member.region,
      city: member.city,
      nationalId: member.nationalId,
      jobTitle: member.jobTitle,
      organization: member.organization
    }));

    return NextResponse.json(formattedMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم الداخلي' }, { status: 500 });
  }
}