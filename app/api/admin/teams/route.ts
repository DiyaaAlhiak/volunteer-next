import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to convert BigInt to string in JSON responses
function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToString(item));
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = convertBigIntToString(obj[key]);
      }
    }
    return result;
  }
  
  return obj;
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all teams from the Team model
    const teams = await prisma.team.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Convert BigInt fields to String for JSON response
    const convertedTeams = convertBigIntToString(teams);

    return NextResponse.json({
      success: true,
      teams: convertedTeams
    });

  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch teams'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
