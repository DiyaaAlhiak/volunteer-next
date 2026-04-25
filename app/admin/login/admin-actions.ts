'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createAdminSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function adminLogin(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  let isSuccess = false; // متغير لتتبع النجاح

  try {
    const user = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return { error: 'الحساب غير موجود' };
    }

    // المقارنة مع الهاش المشفر
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // التحقق من كلمة السر (مع دعم النص العادي مؤقتاً للتجربة)
    if (!isPasswordValid && password !== user.password) {
      return { error: 'كلمة المرور غير صحيحة' };
    }

    // إنشاء الجلسة
    await createAdminSession(user);
    isSuccess = true; // تم تسجيل الدخول بنجاح

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'حدث خطأ تقني في قاعدة البيانات' };
  }

  // التوجيه يجب أن يكون خارج الـ try/catch
  if (isSuccess) {
    redirect('/admin-dashboard');
  }
}