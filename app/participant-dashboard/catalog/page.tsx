'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  User as UserIcon,
  Loader2,
  Filter,
  CheckCircle,
  AlertCircle,
  Lock
} from 'lucide-react';

// مكون كرت الدورة التدريبية
function CourseCard({ course, onEnroll }: { course: any; onEnroll: (courseId: number) => Promise<void> }) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled || false);

  const handleEnroll = async () => {
    if (isEnrolled) return;
    setIsEnrolling(true);
    try {
      await onEnroll(course.id);
      setIsEnrolled(true);
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('عذراً، فشل التسجيل في الدورة. تأكد من اتصالك بالشبكة.');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 group">
      <div className="flex flex-col h-full">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors duration-300">
          <BookOpen className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
        </div>

        <div className="flex-1 text-right">
          <h3 className="text-lg font-black text-slate-900 mb-2">{course.title}</h3>
          
          <div className="flex items-center text-[11px] font-bold text-slate-400 mb-4 gap-4">
            <div className="flex items-center">
              <UserIcon className="w-3.5 h-3.5 ml-1" />
              <span>{course.trainer?.name || 'مدرب الأكاديمية'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 ml-1" />
              <span>{course.duration || '4 ساعات'}</span>
            </div>
          </div>

          <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
            {course.description || 'لا يوجد وصف متاح لهذه الدورة حالياً.'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 uppercase">
            {course.category || 'عام'}
          </span>
          
          <button
            onClick={handleEnroll}
            disabled={isEnrolled || isEnrolling}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              isEnrolled
                ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed'
                : isEnrolling
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'
            }`}
          >
            {isEnrolled ? (
              <>
                <CheckCircle size={14} />
                <span>تم التسجيل</span>
              </>
            ) : isEnrolling ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>جاري...</span>
              </>
            ) : (
              'تسجيل الآن'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<string>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // جلب بيانات البروفايل
        const profileRes = await fetch('/api/auth/profile');
        const contentType = profileRes.headers.get("content-type");
        
        if (profileRes.ok && contentType?.includes("application/json")) {
          const profileData = await profileRes.json();
          const status = profileData.user?.status || 'pending';
          setUserStatus(status);

          // إذا كان مقبولاً، نجلب الكورسات
          if (status === 'approved') {
            const coursesRes = await fetch('/api/courses');
            if (coursesRes.ok) {
              const data = await coursesRes.json();
              const coursesArray = Array.isArray(data) ? data : (data.courses || []);
              setCourses(coursesArray);
              setFilteredCourses(coursesArray);
            }
          }
        } else {
          setUserStatus('pending');
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setUserStatus('pending');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!Array.isArray(courses)) return;
    let filtered = courses;
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }
    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedCategory]);

  const categories = ['all', ...new Set((Array.isArray(courses) ? courses : [])
    .map(course => course.category)
    .filter(Boolean))
  ];

  const handleEnroll = async (courseId: number) => {
    // 1. إرسال الطلب للـ API
    const res = await fetch('/api/participant/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId })
    });

    // 2. التحقق من نجاح العملية
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to enroll');
    }

    // 3. تحديث الواجهة محلياً
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, isEnrolled: true } : course
    ));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-tajawal">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  // إذا كان العضو قيد الانتظار
  if (userStatus !== 'approved') {
    return (
      <div className="font-tajawal flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-100" dir="rtl">
        <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Lock size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">بانتظار موافقة الإدارة</h2>
        <p className="text-slate-500 max-w-md leading-relaxed mb-8 font-medium">
          عذراً، لا يمكنك استعراض الدورات التدريبية حالياً. حسابك قيد المراجعة من قبل السوبر أدمن وإدارة الفريق. سيتم إشعارك فور تفعيل صلاحياتك.
        </p>
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-sm font-bold">
          <AlertCircle size={16} />
          <span>الحالة الحالية: قيد الانتظار</span>
        </div>
      </div>
    );
  }

  return (
    <div className="font-tajawal" dir="rtl">
      <div className="mb-10 text-right">
        <h1 className="text-3xl font-black text-slate-900">دليل الدورات</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">استكشف البرامج التدريبية المتاحة وانضم إليها بضغطة زر.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن اسم الدورة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
            />
          </div>

          <div className="lg:w-64">
            <div className="relative">
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-300 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold appearance-none cursor-pointer"
              >
                <option value="all">كل التصنيفات</option>
                {categories.slice(1).map((category: any) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-20 text-center">
          <BookOpen className="text-slate-200 mx-auto mb-6" size={60} />
          <h3 className="text-xl font-black text-slate-900 mb-2">لا توجد نتائج</h3>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="text-emerald-600 font-black text-sm hover:underline"
          >
            إعادة تعيين البحث
          </button>
        </div>
      )}
    </div>
  );
}