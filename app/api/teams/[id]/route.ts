import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamId = parseInt(id);

    if (isNaN(teamId)) {
      return NextResponse.json({ success: false, error: 'ID الفريق غير صالح' }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        users: { 
          select: {
            id: true,
            name: true, // تأكد من جلب الاسم
            username: true,
            email: true,
            phone: true,
            nationalId: true,
            organization: true,
            jobTitle: true,
            role: true, 
            region: true,
            city: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ success: false, error: 'الفريق غير موجود' }, { status: 404 });
    }

    // --- التعديل السحري هنا ---
    // البحث عن القائد داخل مصفوفة المستخدمين
    // نبحث عن الشخص اللي رتبته TEAM_LEADER أو إيميله مطابق لإيميل الفريق
    const leaderData = team.users.find(u => 
      u.role?.toUpperCase() === 'TEAM_LEADER' || u.email === team.email
    );

    // تجهيز كائن البيانات النهائي ليتوافق مع ما يتوقعه الفرونت إند
    const responseData = {
      ...team,
      leader_name: leaderData?.name || team.leader_name || "غير محدد",
      email: leaderData?.email || team.email,
      phone: leaderData?.phone || team.phone,
    };

    return NextResponse.json({ success: true, team: responseData });

  } catch (error) {
    console.error('Error fetching team details:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب البيانات' },
      { status: 500 }
    );
  }
}