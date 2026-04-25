'use server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export async function registerMemberAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  
  try {
    // 1. التحقق إذا كان البريد موجود مسبقاً قبل محاولة الإنشاء
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email as string }
    });

    if (existingUser) {
      return { error: "هذا البريد الإلكتروني مسجل مسبقاً، يرجى استخدام بريد آخر." };
    }

    const hashedPassword = await bcrypt.hash(data.password as string, 10);

    await prisma.user.create({
      data: {
        name: data.name as string,
        username: data.username as string,
        email: data.email as string,
        password: hashedPassword,
        phone: data.phone as string,
        nationalId: data.nationalId as string,
        region: data.region as string,
        city: data.city as string,
        jobTitle: data.jobTitle as string,
        organization: data.organization as string,
        teamId: Number(data.teamId), 
        role: 'volunteer',
        status: 'pending',
      },
    });

  } catch (error: any) {
    console.error("فشل تسجيل العضو:", error);
    // معالجة خطأ Prisma الخاص بالحقول الفريدة (Unique)
    if (error.code === 'P2002') {
      return { error: "البريد الإلكتروني أو اسم المستخدم موجود بالفعل." };
    }
    return { error: "حدث خطأ غير متوقع في الخادم." };
  }

  // التوجيه لصفحة النجاح
  redirect('/');
}