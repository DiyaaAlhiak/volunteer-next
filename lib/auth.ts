import { cookies } from 'next/headers';

export interface UserSession {
  id: string;
  username: string;
  email: string;
  role: string;
  userType: 'admin' | 'participant';
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return null;
    }

    try {
      const session = JSON.parse(sessionCookie) as UserSession;
      return session;
    } catch (error) {
      console.error('Error parsing session:', error);
      return null;
    }
  } catch (error) {
    console.error('Error reading session cookie:', error);
    return null;
  }
}

export async function getAdminSession(): Promise<UserSession | null> {
  const session = await getSession();
  
  // تعديل الشرط ليكون غير حساس لحالة الأحرف
  if (
    session && 
    session.userType === 'admin' && 
    (session.role.toLowerCase() === 'admin' || session.role.toLowerCase() === 'super_admin')
  ) {
    return session;
  }
  
  return null;
}

export async function getParticipantSession(): Promise<UserSession | null> {
  const session = await getSession();
  
  // Only return session if it's a participant user with valid role
  if (session && session.userType === 'participant' && session.role && session.role !== '0') {
    return session;
  }
  
  return null;
}

export async function createAdminSession(admin: any) {
  const sessionData: UserSession = {
    id: admin.id.toString(),
    username: admin.username,
    email: admin.email,
    role: admin.role.toLowerCase(), // تحويله لصغير عند التخزين لضمان التطابق
    userType: 'admin'
  };

  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

export async function createParticipantSession(user: any) {
  const sessionData: UserSession = {
    id: user.id.toString(),
    username: user.username,
    email: user.email,
    role: user.role || 'participant',
    userType: 'participant'
  };

  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });
}
