'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap,
  User,
  LogOut,
  Users,
  Settings,
  LifeBuoy
} from 'lucide-react';
import { useState, useEffect } from 'react';

// 1. الشاشات المشتركة للاثنين
const baseMenuItems = [
  { title: 'لوحة التحكم', href: '/participant-dashboard', icon: LayoutDashboard },
  { title: 'دليل الكورسات', href: '/participant-dashboard/catalog', icon: BookOpen },
  { title: 'كورساتي', href: '/participant-dashboard/my-courses', icon: GraduationCap },
  { title: 'شهاداتي', href: '/participant-dashboard/certificates', icon: GraduationCap },
  { title: 'الدعم الفني', href: '/participant-dashboard/support', icon: LifeBuoy },
  
];

// 2. الشاشات الخاصة بالقائد فقط
const teamLeaderItems = [
  { title: 'أعضاء الفريق', href: '/participant-dashboard/team-members', icon: Users },
  { title: 'بيانات الفريق', href: '/participant-dashboard/team-profile', icon: Settings },
];

export default function ParticipantSidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  // جلب الرتبة من الـ API عند تحميل الصفحة
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me'); // تأكد من وجود هاد الـ API عندك
        const data = await res.json();
        setUserRole(data.role);
      } catch (error) {
        console.error('Failed to fetch role');
      }
    }
    fetchUser();
  }, []);

  // دمج القوائم بناءً على الشرط
  const finalMenuItems = [
    ...baseMenuItems,
    ...(userRole === 'TEAM_LEADER' ? teamLeaderItems : []), // إضافة شاشات القائد بالشرط
    { title: 'الملف الشخصي', href: '/participant-dashboard/profile', icon: User } // الملف الشخصي دائماً بالأخير
  ];

  return (
    <div className="w-64 bg-[#0f172b] border-l border-gray-800 h-screen sticky top-0 text-white shadow-2xl" dir="rtl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
             <GraduationCap className="text-white w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">سفراء التطوع</h2>
        </div>
        
        <nav className="space-y-1">
          {finalMenuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ml-3 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`} />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 w-full left-0 px-6">
           <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
             <LogOut className="w-5 h-5 ml-3" />
             تسجيل الخروج
           </button>
        </div>
      </div>
    </div>
  );
}