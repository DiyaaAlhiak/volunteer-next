'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  Play, 
  CheckCircle, 
  Award,
  Calendar,
  Loader2,
  ArrowLeft
} from 'lucide-react';

// مكون شريط التقدم الصغير
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
      <div 
        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}

// كرت الدورة بنظام الـ Grid (أجمل وأصغر)
function EnrolledCourseCard({ enrollment }: { enrollment: any }) {
  const { course, status, progress = 0, id: enrollmentId } = enrollment;
  
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* الجزء العلوي (صورة رمزية أو أيقونة) */}
      <div className="h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center relative">
        <div className="p-4 bg-white rounded-2xl shadow-sm">
           <BookOpen className="w-8 h-8 text-emerald-600" />
        </div>
        {status === 'completed' && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
            <CheckCircle size={14} />
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {course.category || 'دورة تدريبية'}
          </span>
          <h3 className="text-base font-black text-slate-900 mt-2 line-clamp-1">{course.title}</h3>
        </div>

        {/* حالة التقدم */}
        <div className="mb-6 mt-auto">
          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
            <span className="text-slate-400">إنجازك</span>
            <span className="text-emerald-600">{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {/* أزرار التحكم */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {status === 'completed' ? (
            <button className="col-span-2 bg-emerald-50 text-emerald-600 py-2.5 rounded-xl text-xs font-black hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
              <Award size={14} />
              عرض الشهادة
            </button>
          ) : (
            <Link 
              href={`/participant-dashboard/courses/${course.id}`}
              className="col-span-2 bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
            >
              <Play size={14} fill="currentColor" />
              تابِع التعلم
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        setLoading(true);
        const res = await fetch('/api/participant/enrollments');
        const data = await res.json();
        // تأكد أن الداتا تأتي كمصفوفة
        const enrollData = Array.isArray(data) ? data : (data.enrollments || []);
        setEnrollments(enrollData);
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, []);

  useEffect(() => {
    let filtered = enrollments;
    if (activeTab === 'active') filtered = enrollments.filter(e => e.status === 'in_progress');
    if (activeTab === 'completed') filtered = enrollments.filter(e => e.status === 'completed');
    setFilteredEnrollments(filtered);
  }, [enrollments, activeTab]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-tajawal">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-sm">جاري جلب كورساتك...</p>
      </div>
    );
  }

  return (
    <div className="font-tajawal min-h-screen bg-[#f8fafc]" dir="rtl">
      
      {/* Header */}
      <header className="mb-10 text-right">
        <h1 className="text-3xl font-black text-slate-900">كورساتي</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium italic">أهلاً بك، استكمل رحلتك التعليمية من حيث توقفت.</p>
      </header>

      {/* Tabs - نظام التبويبات الأنيق */}
      <div className="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl w-fit border border-slate-100 shadow-sm">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'active', label: 'قيد الدراسة' },
          { id: 'completed', label: 'المكتملة' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* شاشة العرض (Grid) */}
      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-20 text-center">
          <BookOpen className="text-slate-200 mx-auto mb-4" size={50} />
          <p className="text-slate-400 font-bold text-sm">لا يوجد دورات في هذا القسم حالياً.</p>
          <Link href="/participant-dashboard/catalog" className="text-emerald-600 text-xs font-black mt-4 inline-block hover:underline">
            تصفح دليل الكورسات الآن
          </Link>
        </div>
      )}
    </div>
  );
}