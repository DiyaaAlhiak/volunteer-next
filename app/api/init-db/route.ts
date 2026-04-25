import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('🔍 Initializing database...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Check if settings already exist
    const existingSettings = await prisma.settings.findFirst();
    
    if (!existingSettings) {
      console.log('📝 Creating default settings...');
      const settings = await prisma.settings.create({
        data: {
          allow_team_registration: true,
          allow_member_registration: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('✅ Default settings created:', settings);
      
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
        settings
      });
    } else {
      console.log('✅ Settings already exist:', existingSettings);
      
      return NextResponse.json({
        success: true,
        message: 'Settings already exist',
        settings: existingSettings
      });
    }
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to initialize database' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    
    if (!settings) {
      return NextResponse.json({
        success: false,
        message: 'No settings found - database needs initialization'
      });
    }

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch settings' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
