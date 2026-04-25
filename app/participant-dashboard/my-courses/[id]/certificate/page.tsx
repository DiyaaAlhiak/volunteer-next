'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Download, AlertCircle, Trophy, Star, Loader2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CertificatePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        const courseData = await courseResponse.json();
        
        if (courseData.success) {
          setCourse(courseData.course);
        }

        // Fetch user info
        const userResponse = await fetch('/api/participant/profile');
        const userData = await userResponse.json();
        
        if (userData.email) {
          setUser(userData);
        }

        // Fetch enrollment status
        const enrollmentResponse = await fetch(`/api/user/enrollment/${courseId}`);
        const enrollmentData = await enrollmentResponse.json();
        
        if (enrollmentData.success) {
          setEnrollment(enrollmentData.enrollment);
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

  useEffect(() => {
    // Trigger confetti when course is completed
    if (enrollment?.status === 'completed' && !loading) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 500);
    }
  }, [enrollment, loading]);

  const handleDownloadCertificate = async () => {
    setGeneratingPdf(true);
    
    try {
      // Create certificate data
      const certificateData = {
        userName: user?.name || user?.username || 'المتسجل',
        courseTitle: course?.title || 'الدورة التدريبية',
        completionDate: enrollment?.completedAt || new Date().toISOString(),
        instructorName: course?.instructorName || 'المدرب',
        duration: course?.duration || 'غير محدد',
        volunteerHours: course?.volunteerHours || 0
      };

      // Generate PDF using html2canvas or similar approach
      // For now, we'll create a simple text-based certificate
      const certificateText = `
شهادة إتمام الدورة التدريبية

يُشهد أن: ${certificateData.userName}
قد أتم بنجاح الدورة التدريبية:
${certificateData.courseTitle}

المدرب: ${certificateData.instructorName}
المدة: ${certificateData.duration}
ساعات التطوع: ${certificateData.volunteerHours} ساعة
تاريخ الإتمام: ${new Date(certificateData.completionDate).toLocaleDateString('ar-SA')}

سفراء التطوع - المملكة العربية السعودية
      `;

      // Create and download text file as certificate
      const blob = new Blob([certificateText], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `شهادة_${course?.title || 'الدورة'}_${user?.name || 'المتسجل'}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Trigger more confetti on download
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('حدث خطأ أثناء إنشاء الشهادة');
    } finally {
      setGeneratingPdf(false);
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
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">لم يتم العثور على الدورة</p>
        </div>
      </div>
    );
  }

  // Completion Guard
  if (enrollment?.status !== 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
        <main className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">العودة</span>
          </button>

          <div className="bg-white rounded-3xl shadow-sm p-12 border border-gray-100 text-center">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={48} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">يجب إكمال الدورة أولاً</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              لا يمكنك الحصول على الشهادة إلا بعد إكمال جميع محتويات الدورة التدريبية بنجاح.
            </p>
            <button
              onClick={() => router.push(`/participant-dashboard/courses/${courseId}`)}
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
            >
              متابعة الدورة
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Celebratory UI for completed courses
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 font-tajawal" dir="rtl">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">العودة</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-8 border-double border-emerald-200 relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30"></div>
              
              <div className="relative z-10 text-center">
                {/* Trophy Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Trophy size={40} className="text-white" />
                </div>

                {/* Certificate Title */}
                <h1 className="text-4xl font-black text-gray-900 mb-2">شهادة إتمام</h1>
                <p className="text-xl text-emerald-600 font-bold mb-8">الدورة التدريبية</p>

                {/* Certificate Content */}
                <div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl p-8 mb-8 border-2 border-emerald-100">
                  <p className="text-lg text-gray-700 mb-6">يُشهد بأن:</p>
                  <h2 className="text-3xl font-black text-gray-900 mb-6">
                    {user?.name || user?.username || 'المتسجل'}
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">قد أتم بنجاح الدورة التدريبية:</p>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-6">
                    {course?.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/80 rounded-xl p-3">
                      <p className="text-gray-500">المدرب</p>
                      <p className="font-bold text-gray-900">{course?.instructorName || 'المدرب'}</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3">
                      <p className="text-gray-500">المدة</p>
                      <p className="font-bold text-gray-900">{course?.duration || 'غير محدد'}</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3">
                      <p className="text-gray-500">ساعات التطوع</p>
                      <p className="font-bold text-gray-900">{course?.volunteerHours || 0} ساعة</p>
                    </div>
                  </div>
                </div>

                {/* Date and Signature */}
                <div className="flex justify-between items-center mt-8">
                  <div>
                    <p className="text-sm text-gray-500">تاريخ الإتمام</p>
                    <p className="font-bold text-gray-900">
                      {new Date(enrollment?.completedAt || new Date()).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="text-left">
                    <div className="border-t-2 border-gray-300 pt-2">
                      <p className="text-sm text-gray-500">توقيع</p>
                      <p className="font-bold text-gray-900">سفراء التطوع</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Stars */}
              <div className="absolute top-4 left-4 text-emerald-200">
                <Star size={32} fill="currentColor" />
              </div>
              <div className="absolute top-4 right-4 text-emerald-200">
                <Star size={32} fill="currentColor" />
              </div>
              <div className="absolute bottom-4 left-4 text-emerald-200">
                <Star size={32} fill="currentColor" />
              </div>
              <div className="absolute bottom-4 right-4 text-emerald-200">
                <Star size={32} fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1">
            <div className="bg-[#0f172b] rounded-2xl shadow-lg p-6 text-white sticky top-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">مبارك! 🎉</h3>
                <p className="text-gray-300 text-sm">لقد أكملت الدورة بنجاح</p>
              </div>

              <button
                onClick={handleDownloadCertificate}
                disabled={generatingPdf}
                className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg mb-4"
              >
                {generatingPdf ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    تحميل الشهادة
                  </>
                )}
              </button>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/participant-dashboard/my-courses')}
                  className="w-full bg-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-all"
                >
                  دوراتي الأخرى
                </button>
                <button
                  onClick={() => router.push('/participant-dashboard/catalog')}
                  className="w-full bg-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-all"
                >
                  استكشاف المزيد
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-2">مشاركة إنجازك</p>
                  <div className="flex justify-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Star size={16} className="text-yellow-400" />
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Trophy size={16} className="text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
