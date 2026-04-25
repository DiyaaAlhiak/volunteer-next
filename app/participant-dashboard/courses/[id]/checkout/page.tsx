'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, BookOpen, Clock, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseCheckoutPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        const courseData = await courseResponse.json();
        
        if (courseData.success) {
          setCourse(courseData.course);
        }

        // Fetch user info from session
        const userResponse = await fetch('/api/participant/profile');
        const userData = await userResponse.json();
        
        if (userData.email) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const handleConfirmEnrollment = async () => {
    setEnrolling(true);
    
    try {
      const response = await fetch('/api/participant/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirect to course player after successful enrollment
        router.push(`/participant-dashboard/courses/${courseId}`);
      } else {
        alert(data.error || 'فشل في التسجيل');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('حدث خطأ أثناء التسجيل');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">لم يتم العثور على الدورة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">العودة</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-emerald-600" />
                معلومات المتسجل
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الاسم</p>
                    <p className="font-medium text-gray-900">
                      {user?.name || user?.username || 'غير محدد'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Mail size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium text-gray-900">
                      {user?.email || 'غير محدد'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-600" />
                ملخص الطلب
              </h3>
              
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h4>
                <div className="flex flex-wrap gap-3">
                  {course.category && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/80 text-emerald-700 rounded-lg text-sm font-medium">
                      <BookOpen size={14} />
                      {course.category}
                    </div>
                  )}
                  {course.duration && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/80 text-gray-600 rounded-lg text-sm font-medium">
                      <Clock size={14} />
                      {course.duration}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">السعر</span>
                  <span className="font-medium text-gray-900">0.00 ر.س</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الضريبة</span>
                  <span className="font-medium text-gray-900">0.00 ر.س</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-emerald-100">
                  <span className="text-lg font-bold text-gray-900">الإجمالي</span>
                  <span className="text-xl font-bold text-emerald-600">مجاني</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg p-6 text-white sticky top-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">تأكيد التسجيل</h3>
                <p className="text-emerald-100 text-sm">ستتمكن من الوصول إلى محتوى الدورة فوراً بعد التأكيد</p>
              </div>

              <button
                onClick={handleConfirmEnrollment}
                disabled={enrolling}
                className="w-full bg-white text-emerald-600 font-black py-4 rounded-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {enrolling ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    جاري التسجيل...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    تأكيد التسجيل
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-emerald-100 text-xs">
                  بالضغط على تأكيد، أنت توافق على شروط استخدام المنصة
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
