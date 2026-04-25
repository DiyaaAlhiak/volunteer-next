import { NextResponse } from 'next/server';

export async function GET() {
  const debugInfo = {
    environment: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    databaseUrlPreview: process.env.DATABASE_URL ? 
      (process.env.DATABASE_URL.substring(0, 20) + '...') : 'none',
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(debugInfo);
}
