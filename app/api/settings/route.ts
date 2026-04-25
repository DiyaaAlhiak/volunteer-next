import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // جلب الإعدادات أو إنشاؤها إذا لم تكن موجودة
    let settings = await prisma.settings.findFirst({
      where: { id: 1 }
    });
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 1,
          allow_team_registration: true,
          allow_member_registration: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch settings' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // تحديث البيانات فقط للحقول الموجودة في الـ Schema
    const updatedSettings = await prisma.settings.update({
      where: { id: 1 },
      data: {
        allow_team_registration: body.allow_team_registration,
        allow_member_registration: body.allow_member_registration,
        // تم حذف updated_at لأنه غير موجود في الموديل تبعك
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح',
      settings: updatedSettings
    });

  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to update settings' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}