'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Ticket, 
  Bell, 
  User, 
  KeyRound, 
  LogOut,
  Settings,
  Menu,
  X,
  Award,
  MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Admin menu items
const adminMenuItems = [
  {
    title: 'لوحة التحكم',
    href: '/admin-dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'الأعضاء',
    href: '/admin-dashboard/members',
    icon: Users
  },
  {
    title: 'الفرق المسجلة',
    href: '/admin-dashboard/teams',
    icon: Users
  },
    {
    title: 'المدربين',
    href: '/admin-dashboard/trainers',
    icon: Users   
  },
  {
    title: 'الدورات التدريبية',
    href: '/admin-dashboard/courses',
    icon: GraduationCap
  },
  {
    title: 'الشهادات',
    href: '/admin-dashboard/certificates',
    icon: Award
  },
  {
    title: 'تذاكر الدعم',
    href: '/admin-dashboard/support',
    icon: MessageSquare
  },

  {
    title: 'إعدادات النظام',
    href: '/admin-dashboard/settings',
    icon: Settings
  },

];

// Participant menu items
const participantMenuItems = [
  {
    title: 'Overview',
    arabicTitle: 'Overview (Overview)',
    href: '/participant-dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Course Catalog',
    arabicTitle: 'Course Catalog (Course Catalog)',
    href: '/participant-dashboard/catalog',
    icon: GraduationCap
  },
  {
    title: 'My Courses',
    arabicTitle: 'My Courses (My Courses)',
    href: '/participant-dashboard/my-courses',
    icon: BookOpen
  },
  {
    title: 'Profile',
    arabicTitle: 'Profile (Profile)',
    href: '/participant-dashboard/profile',
    icon: User
  }
];

export default function RoleBasedSidebar({ userRole }: { userRole: 'admin' | 'participant' }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine menu items based on user role
  const menuItems = userRole === 'admin' ? adminMenuItems : participantMenuItems;
  const isAdmin = userRole === 'admin';

  return (
    <>
      {/* Mobile menu button */}
      {!isAdmin && (
        <div className="lg:hidden fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-[#0f172b] text-white p-3 rounded-lg shadow-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 right-0 z-40 w-64 bg-[#0f172b] text-white h-screen flex flex-col border-l border-gray-800 transform transition-transform duration-300 ease-in-out
        ${!isAdmin && !isMobileMenuOpen ? 'translate-x-full lg:translate-x-0' : 'translate-x-0'}
      `} dir="rtl">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-emerald-500">سفراء التطوع</h2>
          <p className="text-[10px] text-gray-400 mt-1">
            {isAdmin ? 'لوحة الإدارة' : 'Participant Dashboard'}
          </p>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => !isAdmin && setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 ml-3" />
                <span>{isAdmin ? item.title : item.arabicTitle || item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 ml-3" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Mobile overlay - only for participant dashboard */}
      {!isAdmin && isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
