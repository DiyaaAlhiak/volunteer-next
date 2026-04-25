// التصحيح: استبدال next/cookie بـ next/server
import { NextResponse } from 'next/server'; 
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // تحديد مسار الحفظ في مجلد public/uploads
    const path = join(process.cwd(), 'public', 'uploads');
    
    // إنشاء المجلد إذا لم يكن موجوداً
    try {
      await mkdir(path, { recursive: true });
    } catch (e) {
      // المجلد موجود بالفعل أو هناك خطأ في الصلاحيات
    }

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = join(path, uniqueName);

    await writeFile(filePath, buffer);
    
    // إرجاع الرابط الصحيح
    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${uniqueName}` 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'فشل رفع الصورة' }, { status: 500 });
  }
}