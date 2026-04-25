import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // 1. جلب إيميل المستخدم من الكوكيز
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('user_email')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    // 2. جلب بيانات قائد الفريق وفريقه مع الأعضاء (users)
    const teamLeader = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        team: {
          include: {
            users: { // تم التغيير من members إلى users لتطابق الـ Schema
              include: {
                enrollments: {
                  include: {
                    course: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!teamLeader) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    if (!teamLeader.team) {
      return NextResponse.json({ error: 'لم يتم العثور على فريق مرتبك بهذا القائد' }, { status: 404 });
    }

    // 3. حساب الإحصائيات
    const team = teamLeader.team;
    const teamMembers = team.users || []; // الأعضاء هم الـ users المرتبطين بنفس الـ teamId
    
    const stats = {
      totalMembers: teamMembers.length,
      approvedMembers: teamMembers.filter(member => member.status === 'approved').length,
      teamCompletions: teamMembers.reduce((total, member) => {
        return total + (member.enrollments?.filter(enrollment => enrollment.status === 'completed').length || 0);
      }, 0)
    };

    // 4. تحضير بيانات الأعضاء للجدول
    const membersData = teamMembers.map(member => {
      const completedCourses = member.enrollments?.filter(e => e.status === 'completed').length || 0;
      const totalCourses = member.enrollments?.length || 0;
      const progress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

      return {
        id: member.id,
        name: member.name || member.username, // استخدام الاسم أو اسم المستخدم كبديل
        joinDate: member.createdAt,
        progress,
        status: member.status || 'pending'
      };
    });

    // 5. إرسال البيانات
    return NextResponse.json({
      stats,
      teamStatus: team.status || 'pending',
      teamName: team.name || 'فريقي',
      members: membersData
    });

  } catch (error: any) {
    console.error('Team Leader Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات لوحة تحكم قائد الفريق' },
      { status: 500 }
    );
  }
}