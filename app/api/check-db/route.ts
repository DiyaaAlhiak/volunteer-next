import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic server functionality without database
    return NextResponse.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Server test failed' 
      },
      { status: 500 }
    );
  }
}
