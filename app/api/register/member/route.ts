import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
  console.log('API POST request received');
  
  let prisma: PrismaClient | null = null;
  
  try {
    // Initialize prisma client with error handling
    try {
      prisma = new PrismaClient();
      await prisma.$connect();
      console.log('Database connection established');
    } catch (connectionError) {
      console.error('Database connection failed:', connectionError);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    const requiredFields = [
      'username', 'email', 'password'
    ];
    
    console.log('Validating required fields...');
    console.log('✅ Validating required fields...');
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `حقل ${field} مطلوب` },
          { status: 400 }
        );
      }
    }

    console.log('Checking settings table...');
    // Safety check: Ensure settings record exists with fallback
    let settings;
    try {
      settings = await prisma.settings.findFirst();
      console.log('Settings found:', !!settings);
      
      if (!settings) {
        console.log('Creating default settings...');
        // Create default settings record
        settings = await prisma.settings.create({
          data: {
            id: 1,
            allow_member_registration: true
          }
        });
        console.log('Default settings created');
      }
    } catch (settingsError) {
      console.error('Settings query failed, using hardcoded default:', settingsError);
      // Use hardcoded default if database query fails
      settings = { allow_member_registration: true };
    }
    
    // Check if member registration is enabled
    console.log('Registration enabled:', settings?.allow_member_registration);
    if (!settings?.allow_member_registration) {
      console.log('Registration disabled by settings');
      return NextResponse.json(
        { error: 'Member registration is currently disabled.' },
        { status: 403 }
      );
    }

    console.log('🔧 Checking team validation...');
    // Check if team exists and is accepted
    const team = await prisma.team.findFirst({
      where: { 
        id: parseInt(body.teamId),
        status: 'accepted'
      }
    });

    console.log('Team found:', !!team);
    if (!team) {
      console.log('❌ Team not found or not accepted');
      return NextResponse.json(
        { error: 'الفريق المحدد غير موجود أو غير مقبول' },
        { status: 404 }
      );
    }

    console.log('🔧 Checking for existing users...');
    // Check if username already exists
    const existingUsername = await prisma.user.findFirst({
      where: { username: body.username }
    });

    if (existingUsername) {
      console.log('❌ Username already exists');
      return NextResponse.json(
        { error: 'اسم المستخدم هذا مسجل بالفعل' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findFirst({
      where: { email: body.email }
    });

    if (existingEmail) {
      console.log('❌ Email already exists');
      return NextResponse.json(
        { error: 'هذا البريد الإلكتروني مسجل بالفعل' },
        { status: 409 }
      );
    }

    // Check if national ID already exists
    const existingNationalId = await prisma.user.findFirst({
      where: { nationalId: body.nationalId }
    });

    if (existingNationalId) {
      console.log('❌ National ID already exists');
      return NextResponse.json(
        { error: 'رقم الهوية الوطنية مسجل بالفعل' },
        { status: 409 }
      );
    }

    console.log('🔧 Hashing password...');
    // Hash password
    const hashedPassword = await bcryptjs.hash(body.password, 12);
    console.log('Password hashed successfully');

    console.log('🔧 Creating user...');
    // Create new user
    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        phone: body.phone,
        nationalId: body.nationalId,
        region: body.region,
        city: body.city,
        organization: body.organization,
        jobTitle: body.jobTitle,
        roleInTeam: body.roleInTeam,
        teamId: parseInt(body.teamId)
      }
    });

    console.log('✅ User created successfully with ID:', user.id);
    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب التسجيل بنجاح. سيتم مراجعته من قبل الإدارة.',
      userId: user.id
    });

  } catch (error) {
    console.error('Member registration error:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    // Specific Prisma error code handling
    if (error instanceof Error) {
      const errorMessage = error.message;
      
      // P2002: Unique constraint violation
      if (errorMessage.includes('P2002') || errorMessage.includes('Unique constraint')) {
        console.error('P2002: Unique constraint violation detected');
        if (errorMessage.includes('email')) {
          return NextResponse.json(
            { error: 'This email is already registered.' },
            { status: 409 }
          );
        }
        if (errorMessage.includes('username')) {
          return NextResponse.json(
            { error: 'This username is already taken.' },
            { status: 409 }
          );
        }
        if (errorMessage.includes('nationalId')) {
          return NextResponse.json(
            { error: 'This national ID is already registered.' },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { error: 'A record with this data already exists.' },
          { status: 409 }
        );
      }
      
      // P2003: Foreign key constraint violation
      if (errorMessage.includes('P2003') || errorMessage.includes('foreign key')) {
        console.error('P2003: Foreign key constraint violation detected');
        return NextResponse.json(
          { error: 'Invalid team selected.' },
          { status: 400 }
        );
      }
      
      // P1001: Database connection timeout
      if (errorMessage.includes('P1001') || errorMessage.includes('timeout') || errorMessage.includes('ECONNREFUSED')) {
        console.error('P1001: Database connection timeout detected');
        return NextResponse.json(
          { error: 'Database connection failed. Please try again later.' },
          { status: 503 }
        );
      }
      
      // P2021: Table does not exist
      if (errorMessage.includes('P2021') || errorMessage.includes('does not exist')) {
        console.error('P2021: Table does not exist');
        return NextResponse.json(
          { error: 'Database schema error. Please contact administrator.' },
          { status: 500 }
        );
      }
      
      // P2022: Column does not exist
      if (errorMessage.includes('P2022') || errorMessage.includes('column') && errorMessage.includes('does not exist')) {
        console.error('P2022: Column does not exist');
        return NextResponse.json(
          { error: 'Database schema error. Please contact administrator.' },
          { status: 500 }
        );
      }
    }
    
    console.error('Unknown error occurred');
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration. Please try again.' },
      { status: 500 }
    );
  } finally {
    // Ensure database connection is closed
    if (prisma) {
      try {
        await prisma.$disconnect();
        console.log('Database connection closed');
      } catch (disconnectError) {
        console.error('Error closing database connection:', disconnectError);
      }
    }
  }
}
