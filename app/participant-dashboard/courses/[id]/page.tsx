'use client';

import { useState, useEffect, use } from 'react'; // أضفنا use هنا
import { PlayCircle, Clock, BookOpen, AlertCircle, Loader2 } from 'lucide-react';

// تحديث تعريف الـ Props ليكون Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseWatchPage({ params }: PageProps) {
  // فك الـ params باستخدام React.use()
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        
        // التحقق من أن الرد ليس صفحة HTML
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("السيرفر لم يرسل JSON! تأكد من مسار الـ API");
        }

        const data = await response.json();
        if (data.success) {
          setCourse(data.course);
        } else {
          console.error("خطأ من الـ API:", data.error);
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold" dir="rtl">
      لم يتم العثور على الدورة المطلوبة.
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* منطقة عرض الفيديو */}
        <div className="bg-black rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video mb-8 border-8 border-white">
          {course.videoUrl ? (
            <iframe
              src={course.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-900">
              <AlertCircle size={48} className="text-gray-700 mb-4" />
              <p className="text-lg font-bold">لا يوجد محتوى فيديو متاح حالياً</p>
            </div>
          )}
        </div>

        {/* معلومات الدورة */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-white">
          <h1 className="text-3xl font-black text-gray-900 mb-4">{course.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold">
              <BookOpen size={16} /> {course.category}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">
              <Clock size={16} /> {course.duration}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900 border-r-4 border-emerald-500 pr-3">وصف الدورة التدريبية</h2>
            <p className="text-gray-600 leading-loose text-lg">
              {course.description || "هذه الدورة لا تحتوي على وصف نصي حالياً."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}