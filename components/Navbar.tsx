"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions";

interface NavbarProps {
  user: any;
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  const getDashboardLink = () => {
    if (!user) return '#';
    if (user.role === 'admin') return '/admin-dashboard';
    return '/dashboard';
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLoginDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700 font-tajawal">
      <div className="mx-5 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20"> {/* زدنا الارتفاع قليلاً ليتناسب مع اللوجو */}
          
          {/* Right Side: Logo + Navigation Links */}
          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <img 
                src="https://pioneerseg.ddns.net:6901/assets/uploads/media-uploader/large-group-2911687478757.png" 
                alt="Logo" 
                className="h-14 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </a>

            {/* Nav Links */}
            <div className="flex items-center space-x-reverse space-x-2">
              <a href="/" className="text-white px-3 py-2 rounded-md hover:text-yellow-400 font-medium transition-colors">
                الرئيسية
              </a>
              <a href="/ambassadors" className="text-white px-3 py-2 rounded-md hover:text-yellow-400 font-medium transition-colors">
                سفراء التطوع 
              </a>
              <a href="/content" className="text-white px-3 py-2 rounded-md hover:text-yellow-400 font-medium transition-colors">
                محتوى التأهيل
              </a>
            </div>
          </div>

          {/* Left Side: Buttons & Icons */}
          <div className="hidden md:flex items-center space-x-reverse space-x-6">
            {!user ? (
              <div className="flex items-center space-x-reverse">
                <a href="/register" className="px-4 py-2 mx-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors">
                  تسجيل
                </a>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="px-4 py-2 mx-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center"
                  >
                    <span>تسجيل الدخول</span>
                    <svg 
                      className={`w-4 h-4 mr-2 transition-transform duration-200 ${isLoginDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isLoginDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden transform transition-all">
                      <div className="py-1">
                        <a href="/login" className="block px-4 py-3 text-sm text-gray-800 hover:bg-yellow-50 transition-colors text-right font-medium border-b border-gray-50">
                          تسجيل دخول المشارك 
                        </a>
                        <a href="/admin/login" className="block px-4 py-3 text-sm text-gray-800 hover:bg-yellow-50 transition-colors text-right font-medium">
                          تسجيل دخول مدير 
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-reverse">
                <a href={getDashboardLink()} className="px-4 py-2 mx-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors">
                  لوحة التحكم
                </a>
                <button onClick={handleLogout} className="px-4 py-2 mx-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
                  تسجيل الخروج
                </button>
              </div>
            )}

            {/* Social Icons */}
            <div className="flex items-center space-x-reverse space-x-3">
              <a href="https://www.instagram.com/h_volunteering/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/></svg>
              </a>
              <a href="https://www.youtube.com/@h_volunteering" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://x.com/H_Volunteering" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-md hover:text-yellow-400 transition-colors"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-slate-700 animate-in fade-in slide-in-from-top-4">
            {/* Mobile Logo */}
            <div className="flex justify-center mb-6">
              <img src="https://pioneerseg.ddns.net:6901/assets/uploads/media-uploader/large-group-2911687478757.png" alt="Logo" className="h-16 w-auto" />
            </div>

            <div className="space-y-1">
              <a href="/" className="block px-4 py-3 text-white hover:bg-slate-800 rounded-lg transition-colors">الرئيسية</a>
              <a href="/ambassadors" className="block px-4 py-3 text-white hover:bg-slate-800 rounded-lg transition-colors">سفراء التطوع</a>
              <a href="/content" className="block px-4 py-3 text-white hover:bg-slate-800 rounded-lg transition-colors">محتوى التأهيل</a>
            </div>

            <div className="pt-4 border-t border-slate-800">
              {!user ? (
                <div className="grid grid-cols-2 gap-3 px-2">
                  <a href="/register" className="px-4 py-3 bg-yellow-400 text-black font-bold rounded-xl text-center">تسجيل</a>
                  <a href="/login" className="px-4 py-3 bg-slate-700 text-white font-bold rounded-xl text-center">دخول</a>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 px-2">
                  <a href={getDashboardLink()} className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl text-center">لوحة التحكم</a>
                  <button onClick={handleLogout} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl text-center">تسجيل الخروج</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}