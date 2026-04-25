import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // Clear all session cookies
    cookieStore.delete('admin-token');
    cookieStore.delete('user-token');
    
    console.log('All cookies cleared successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'All session cookies cleared' 
    });
  } catch (error) {
    console.error('Failed to clear cookies:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to clear cookies' 
    }, { status: 500 });
  }
}
