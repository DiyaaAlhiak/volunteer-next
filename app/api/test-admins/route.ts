import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test query to get first 5 admins
    const allAdmins = await prisma.admins.findMany({ take: 5 });
    console.log('Found admins:', allAdmins);
    
    // Also test count
    const count = await prisma.admins.count();
    console.log('Total admins count:', count);
    
    return NextResponse.json({
      success: true,
      admins: allAdmins,
      count: count,
      message: 'Database query successful'
    });
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database query failed'
    }, { status: 500 });
  }
}
