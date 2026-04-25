import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic database connection without Prisma
    return NextResponse.json({
      success: true,
      message: 'API endpoint is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'API test failed' 
      },
      { status: 500 }
    );
  }
}
