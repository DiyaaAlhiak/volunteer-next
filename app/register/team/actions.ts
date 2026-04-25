'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function registerTeamAction(formData: FormData) {
  let isSuccess = false;

  try {
    // 1. استخراج البيانات الأساسية وضمان وجود قيم افتراضية لمنع أخطاء Prisma
    const leaderName = (formData.get('leader_name') || formData.get('leaderName') || "") as string;
    const teamName = (formData.get('name') || "") as string;
    const email = (formData.get('email') || "") as string;
    const password = (formData.get('password') || "") as string;
    const phone = (formData.get('phone') || "") as string;
    const nationalId = (formData.get('nationalId') || "") as string;
    const region = (formData.get('region') || "") as string;
    const city = (formData.get('city') || "") as string;

    const file = formData.get('attachments') as File;
    let filePath = '';

    // 2. معالجة رفع الملف (المرفقات)
    if (file && file.size > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      filePath = `/uploads/${fileName}`;
      await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
    }

    // 3. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. تنفيذ العملية داخل Transaction لضمان الترابط
    await prisma.$transaction(async (tx) => {
      
      // أ- إنشاء حساب القائد في جدول User أولاً
      const leader = await tx.user.create({
        data: {
          username: email.split('@')[0] + Math.floor(Math.random() * 1000),
          email: email,
          password: hashedPassword,
          name: leaderName,
          phone: phone,
          nationalId: nationalId,
          region: region,
          city: city,
          jobTitle: (formData.get('job') as string) || null,
          organization: (formData.get('organization') as string) || null,
          role: 'TEAM_LEADER',
          status: 'pending',
        },
      });

      // ب- إنشاء الفريق في جدول team وربطه بـ leaderId
      const createdTeam = await tx.team.create({
        data: {
          name: teamName,
          leader_name: leaderName,
          email: email,
          password: hashedPassword,
          phone: phone,
          region: region,
          city: city,
          nationalId: nationalId,
          job: (formData.get('job') as string) || "",
          organization: (formData.get('organization') as string) || "",
          attachments: filePath,
          status: 'pending',
          // الربط باستخدام معرف المستخدم الذي أُنشئ للتو
          leaderId: leader.id, 
        },
      });

      // ج- تحديث جدول User ليرتبط بالفريق (العلاقة العكسية)
      await tx.user.update({
        where: { id: leader.id },
        data: { teamId: createdTeam.id },
      });
    });

    isSuccess = true;

  } catch (error: any) {
    console.error("=== خطأ في تسجيل الفريق ===", error);
    
    // معالجة الأخطاء الشائعة (تكرار البيانات)
    if (error.code === 'P2002') {
      return { error: "اسم الفريق، البريد الإلكتروني، أو رقم الهوية مسجل مسبقاً" };
    }
    
    return { error: "فشل في تسجيل البيانات: " + error.message };
  }

  // 5. التوجيه بعد النجاح (خارج نطاق الـ try/catch)
  if (isSuccess) {
    revalidatePath('/');
    redirect('/participant-dashboard'); 
  }
}