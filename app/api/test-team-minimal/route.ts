import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('=== MINIMAL TEAM REGISTRATION TEST ===');
    
    const body = await request.json();
    console.log('Received data:', body);
    
    // Test with absolute minimum data
    const minimalData = {
      name: 'Test Team Minimal',
      leader_name: 'Test Leader',
      email: 'test@example.com',
      phone: '1234567890',
      region: 'Test Region',
      city: 'Test City',
      nationalId: '1234567890',
      job: 'Test Job',
      organization: 'Test Organization'
    };
    
    console.log('Creating team with minimal data:', minimalData);
    
    const team = await prisma.team.create({
      data: minimalData
    });
    
    console.log('Team created successfully:', team.id);
    console.log('=== MINIMAL TEST SUCCESS ===');
    
    return NextResponse.json({
      success: true,
      message: 'Minimal team registration successful',
      teamId: team.id
    });

  } catch (error) {
    console.error('=== MINIMAL TEAM REGISTRATION ERROR ===');
    console.error('Full error:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : 'No message');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Error name:', error instanceof Error ? error.name : 'No name');
    console.error('Error code:', error instanceof Error ? (error as any).code : 'No code');
    console.error('=== END MINIMAL ERROR DETAILS ===');
    
    return NextResponse.json(
      { 
        error: 'Minimal team registration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        fullError: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
