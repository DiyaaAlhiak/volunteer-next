import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // يفضل دائماً تشفير كلمة المرور

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('جهة استقبال طلب تسجيل الفريق:', body);

    // 1. التحقق من الحقول الإجبارية
    const { name, email, password, leaderName, leader_name } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'الاسم، البريد، وكلمة المرور حقول مطلوبة' }, { status: 400 });
    }

    const finalLeaderName = leaderName || leader_name;
    if (!finalLeaderName) {
      return NextResponse.json({ error: 'اسم قائد الفريق مطلوب' }, { status: 400 });
    }

    // 2. التحقق من عدم تكرار اسم الفريق أو البريد الإلكتروني
    const existingEntry = await prisma.team.findFirst({
      where: {
        OR: [
          { name: name },
          { email: email }
        ]
      }
    });

    if (existingEntry) {
      const field = existingEntry.email === email ? 'البريد الإلكتروني' : 'اسم الفريق';
      return NextResponse.json({ error: `${field} مسجل مسبقاً` }, { status: 409 });
    }

    // 3. تشفير كلمة المرور (خطوة أمان هامة)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. إنشاء الفريق في قاعدة البيانات
    const newTeam = await prisma.team.create({
      data: {
        name: name,
        leader_name: finalLeaderName,
        email: email,
        password: hashedPassword, // تخزين كلمة المرور مشفرة
        phone: body.phone || "",
        region: body.region || "",
        city: body.city || "",
        nationalId: body.nationalId || "",
        job: body.job || "",
        organization: body.organization || "",
        attachments: body.attachments || "",
        status: "pending",
        // إذا كان موديل Team يحتوي على volunteerHours، أضفه هنا كـ 0 لتجنب أخطاء Prisma
        // volunteerHours: 0, 
      },
    });

    console.log('تم إنشاء الفريق بنجاح، الرقم المعرف:', newTeam.id);

    return NextResponse.json({
      success: true,
      message: 'تم تقديم طلب تسجيل الفريق بنجاح.',
      teamId: newTeam.id
    });

  } catch (error: any) {
    console.error('=== TEAM REGISTRATION ERROR ===', error);
    
    // معالجة خطأ Prisma المشهور في حال وجود حقل ناقص في الـ Schema
    return NextResponse.json(
      { 
        error: 'حدث خطأ في قاعدة البيانات أثناء تسجيل الفريق.',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}