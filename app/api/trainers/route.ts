import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. جلب قائمة المدربين
export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({
      success: true,
      trainers
    });

  } catch (error: any) {
    console.error('Error fetching trainers:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في جلب المدربين' },
      { status: 500 }
    );
  }
}

// 2. إضافة مدرب جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    const trainer = await prisma.trainer.create({
      data: {
        name,
        email: email || null,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إضافة المدرب بنجاح',
      trainer
    });

  } catch (error: any) {
    console.error('Error creating trainer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في إضافة المدرب' },
      { status: 500 }
    );
  }
}

// 3. تحديث بيانات مدرب
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email } = body;

    const trainer = await prisma.trainer.update({
      where: { id: Number(id) }, // استخدام Number بدلاً من BigInt
      data: { 
        name,
        email: email || null,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات المدرب بنجاح',
      trainer
    });

  } catch (error: any) {
    console.error('Error updating trainer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في تحديث المدرب' },
      { status: 500 }
    );
  }
}

// 4. حذف مدرب
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    await prisma.trainer.delete({
      where: { id: Number(id) } // استخدام Number بدلاً من BigInt
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف المدرب بنجاح'
    });

  } catch (error: any) {
    console.error('Error deleting trainer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في حذف المدرب' },
      { status: 500 }
    );
  }
}