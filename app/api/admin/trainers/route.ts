import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// جلب قائمة المدربين
export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json({ success: true, trainers })
  } catch (error) {
    return NextResponse.json({ success: false, trainers: [] })
  }
}

// إضافة مدرب جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const trainer = await prisma.trainer.create({
      data: {
        name: body.name,
        specialty: body.specialty || "",
        email: body.email || null,
        bio: body.bio || ""
      }
    })
    return NextResponse.json({ success: true, trainer })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "فشل إضافة المدرب" }, { status: 500 })
  }
}