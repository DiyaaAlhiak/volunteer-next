'use server';

import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

// 1. دالة رفع القالب
export async function uploadTemplateAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: "لا يوجد ملف" };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'templates');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = `/templates/${fileName}`;
    const fullPath = path.join(uploadDir, fileName);

    await writeFile(fullPath, buffer);

    const template = await prisma.certificateTemplate.create({
      data: {
        name: file.name.split('.')[0],
        filePath: filePath,
        isActive: false,
      },
    });

    revalidatePath('/admin-dashboard/certificates');
    return { success: true, template };
  } catch (error: any) {
    console.error("Upload Error:", error);
    return { success: false, error: error.message };
  }
}

// 2. دالة حفظ الإعدادات (التي كانت تسبب الخطأ)
export async function updateTemplateSettings(id: string, settings: any) {
  try {
    await prisma.certificateTemplate.update({
      where: { id },
      data: { settings: settings },
    });
    revalidatePath('/admin-dashboard/certificates');
    return { success: true };
  } catch (error) {
    console.error("Update Settings Error:", error);
    return { success: false };
  }
}

// 3. دالة التنشيط
export async function activateTemplateAction(id: string) {
  try {
    await prisma.$transaction([
      prisma.certificateTemplate.updateMany({ data: { isActive: false } }),
      prisma.certificateTemplate.update({ where: { id }, data: { isActive: true } }),
    ]);
    revalidatePath('/admin-dashboard/certificates');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 4. دالة الحذف
export async function deleteTemplateAction(id: string, filePath: string) {
  try {
    await prisma.certificateTemplate.delete({ where: { id } });
    revalidatePath('/admin-dashboard/certificates');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}