import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendStatusEmail } from '@/lib/mail'; // تأكد أن المسار صحيح لملف الميل الجديد

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { createdAt: 'desc' } 
    });

    return NextResponse.json({ success: true, teams });
  } catch (error: any) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, status } = body;

    // 1. تحديث حالة الفريق وحالة القائد معاً في عملية واحدة (Transaction)
    const [updatedTeam, updatedLeader] = await prisma.$transaction(async (tx) => {
      // تحديث الفريق
      const team = await tx.team.update({
        where: { id: Number(teamId) },
        data: { status }
      });

      // تحديث حالة المستخدم (القائد) المرتبط بهذا الفريق
      // ملاحظة: نحدث كل من يحمل رتبة TEAM_LEADER في هذا الفريق
      const leader = await tx.user.updateMany({
        where: { 
          teamId: Number(teamId),
          role: 'TEAM_LEADER' 
        },
        data: { status: status } // بياخد نفس حالة الفريق (approved/rejected)
      });

      return [team, leader];
    });

    // 2. إرسال الإيميل عبر Gmail SMTP (بناءً على حالة الفريق المحدثة)
    if (updatedTeam && updatedTeam.email) {
      try {
        const mailResult = await sendStatusEmail(updatedTeam.email, updatedTeam.name, status);
        
        if (mailResult.success) {
          console.log(`✅ إيميل Gmail أُرسل بنجاح إلى: ${updatedTeam.email}`);
        } else {
          console.error('❌ فشل إرسال الإيميل:', mailResult.error);
        }
      } catch (mailError) {
        console.error('❌ خطأ غير متوقع في نظام الإرسال:', mailError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'تم تحديث حالة الفريق والقائد بنجاح وإرسال التنبيه',
      team: updatedTeam 
    });

  } catch (error: any) {
    console.error('Error updating team status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}