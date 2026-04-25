import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// يفضل تعريف الـ Prisma خارج الدالة لمنع كثرة الاتصالات في التطوير
const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, videoUrl, duration, category, instructorName, volunteerHours, imageUrl } = body

    if (!title) {
      return NextResponse.json({ success: false, error: 'العنوان مطلوب' }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        duration: duration?.trim() || null,
        category: category?.trim() || null,
        instructorName: instructorName?.trim() || null,
        volunteerHours: volunteerHours ? parseInt(volunteerHours.toString()) : 0,
        image: imageUrl?.trim() || null,
        status: 'active'
      }
    })

    return NextResponse.json({ success: true, course }, { status: 201 })

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, videoUrl, duration, category, instructorName, volunteerHours, imageUrl } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'المعرف ID مطلوب' }, { status: 400 })
    }

    // ملاحظة هامة: إذا كان الـ ID في الـ Schema عندك رقم استخدم parseInt(id)
    // إذا كان String (وهو الأرجح في Next.js) استخدم id مباشرة
    const course = await prisma.course.update({
      where: { id: id.toString() }, 
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        duration: duration?.trim() || null,
        category: category?.trim() || null,
        instructorName: instructorName?.trim() || null,
        volunteerHours: volunteerHours ? parseInt(volunteerHours.toString()) : 0,
        image: imageUrl?.trim() || null,
      }
    })

    return NextResponse.json({ success: true, course })

  } catch (error: any) {
    console.error('Update Error:', error)
    return NextResponse.json({ success: false, error: 'فشل في تحديث البيانات' }, { status: 500 })
  }
}

// تأكد من وجود GET لجلب البيانات أيضاً
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, courses })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'فشل جلب البيانات' }, { status: 500 })
  }
}