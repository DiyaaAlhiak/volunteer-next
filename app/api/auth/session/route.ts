import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ session: null });
    }

    try {
      const session = JSON.parse(sessionCookie);
      return NextResponse.json({ session });
    } catch (error) {
      console.error('Error parsing session:', error);
      return NextResponse.json({ session: null });
    }
  } catch (error) {
    console.error('Error reading session cookie:', error);
    return NextResponse.json({ session: null });
  }
}
