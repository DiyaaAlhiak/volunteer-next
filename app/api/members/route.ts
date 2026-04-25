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
    // Data Fetching: Fetch all users from prisma.user with correct schema fields
const members = await prisma.user.findMany({
  select: {
    id: true,
    name: true,      // use name instead of username
    email: true,
    phone: true,
    nationalId: true,
    region: true,    // field exists per schema
    city: true,      // field exists per schema
    role: true,
    status: true,
    teamId: true,    // field exists per schema
    team: {
      select: {
        id: true,
        name: true,
      }
    }
  }
});

// Add job and organization fields manually since they're missing from schema
const membersWithAdditionalFields = members.map(member => ({
  ...member,
  job: '', // Empty string since job field doesn't exist in schema
  organization: member.team?.name || '' // Use team name as organization if available
}));

    // BigInt: Convert all BigInt fields to String before returning JSON
    const convertedMembers = convertBigIntToString(membersWithAdditionalFields);

    return NextResponse.json({
      success: true,
      members: convertedMembers
    });

  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch members' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, status } = body;

    // Update Status: Update the status of a user
    // If the status becomes 'approved', also set their role to 'participant' if it's currently 'pending'
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    // If status becomes 'approved', set role to 'participant'
    if (status === 'approved') {
      updateData.role = 'participant';
    }

    const updatedMember = await prisma.user.update({
      where: { id: parseInt(memberId) },
      data: updateData
    });

    // Convert BigInt to string for JSON response
    const convertedMember = convertBigIntToString(updatedMember);

    return NextResponse.json({
      success: true,
      message: 'Member status updated successfully',
      member: convertedMember
    });

  } catch (error) {
    console.error('Error updating member status:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update member status' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId } = body;

    // Delete Member: Implement a safe delete for a user by their ID
    const deletedMember = await prisma.user.delete({
      where: { id: parseInt(memberId) }
    });

    // Convert BigInt to string for JSON response
    const convertedMember = convertBigIntToString(deletedMember);

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully',
      member: convertedMember
    });

  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete member' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
