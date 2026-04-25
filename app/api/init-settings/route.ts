import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Check if settings already exist
    const existingSettings = await prisma.settings.findFirst();
    
    if (existingSettings) {
      return NextResponse.json({
        success: true,
        message: 'Settings already exist',
        settings: existingSettings
      });
    }

    // Create default settings
    const settings = await prisma.settings.create({
      data: {
        allow_team_registration: true,
        allow_member_registration: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Default settings created successfully',
      settings
    });

  } catch (error) {
    console.error('Error creating settings:', error);
    return NextResponse.json(
      { error: 'Failed to create settings' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    
    if (!settings) {
      return NextResponse.json({
        success: false,
        message: 'No settings found'
      });
    }

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
