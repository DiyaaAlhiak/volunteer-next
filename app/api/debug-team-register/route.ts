import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Received team registration data:', body);
    
    // Test database connection
    const settings = await prisma.settings.findFirst();
    console.log('Database connection test - settings:', settings);
    
    // Test teams table structure
    const teamsCount = await prisma.team.count();
    console.log('Teams count:', teamsCount);
    
    return NextResponse.json({
      success: true,
      message: 'Debug endpoint working',
      receivedData: body,
      settingsExists: !!settings,
      teamsCount: teamsCount
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
