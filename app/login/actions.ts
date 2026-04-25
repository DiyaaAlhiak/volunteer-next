'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { createParticipantSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  try {
    // 1. البحث عن المستخدم بواسطة اسم المستخدم أو البريد الإلكتروني
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return { error: 'المستخدم غير موجود' };
    }

    // 2. التحقق من كلمة المرور
    let isPasswordValid = false;
    try {
      if (user.password.startsWith('$2')) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        isPasswordValid = user.password === password;
      }
    } catch (bcryptError) {
      isPasswordValid = user.password === password;
    }

    if (!isPasswordValid) {
      return { error: 'كلمة المرور غير صحيحة' };
    }

    // 3. التحقق من الدور (Role) والحالة (Status)
    const userRole = user.role?.toUpperCase();
    
    // التعديل هنا: أضفنا VOLUNTEER للقائمة المسموح لها بالدخول
    const allowedRoles = ['PARTICIPANT', 'TEAM_LEADER', 'VOLUNTEER'];

    console.log(`[LOGIN ATTEMPT] User: ${user.email}, Role: ${user.role}, Status: ${user.status}`);

    if (userRole === 'ADMIN') {
      return { error: 'هذا الحساب مخصص للإدارة، يرجى تسجيل الدخول من صفحة الإدارة' };
    }

    // فحص الرتبة بناءً على القائمة الجديدة
    if (!userRole || !allowedRoles.includes(userRole)) {
      return { error: 'ليس لديك صلاحية الدخول لهذه اللوحة' };
    }

    // فحص الحالة (يجب أن يكون الأدمن قد وافق عليه)
    if (user.status !== 'approved' && user.status !== 'APPROVED') {
       return { error: 'حسابك لا يزال قيد المراجعة من قبل الإدارة' };
    }

    // 4. إنشاء الجلسة وتحديث الكوكيز
    await createParticipantSession(user);

    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    
    // تخزين الإيميل والرتبة في الكوكيز
    cookieStore.set('user_email', user.email, { 
      path: '/', 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 
    });

    // نخزن الرتبة كما هي (volunteer أو TEAM_LEADER)
    cookieStore.set('user_role', user.role || '', { path: '/' });

    revalidatePath('/', 'layout');

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return { error: 'حدث خطأ في الاتصال بقاعدة البيانات' };
  }

  // التوجيه إلى لوحة التحكم
  redirect('/participant-dashboard'); 
}