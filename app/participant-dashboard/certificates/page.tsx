'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, Download, Calendar, Clock, BookOpen, Loader2, Trophy } from 'lucide-react';

interface Certificate {
  id: number;
  courseTitle: string;
  instructorName: string;
  duration: string;
  volunteerHours: number;
  completedAt: string;
  userName: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/user/certificates');
      const data = await response.json();
      
      if (data.success) {
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (certificate: Certificate) => {
    const certificateText = `
شهادة إتمام الدورة التدريبية

يُشهد أن: ${certificate.userName}
قد أتم بنجاح الدورة التدريبية:
${certificate.courseTitle}

المدرب: ${certificate.instructorName}
المدة: ${certificate.duration}
ساعات التطوع: ${certificate.volunteerHours} ساعة
تاريخ الإتمام: ${new Date(certificate.completedAt).toLocaleDateString('ar-SA')}

سفراء التطوع - المملكة العربية السعودية
    `;

    const blob = new Blob([certificateText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `شهادة_${certificate.courseTitle}_${certificate.userName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">شهاداتي</h1>
          <p className="text-gray-600">شهادات إنجازاتك في الدورات التدريبية</p>
        </div>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 border border-gray-100 text-center">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap size={48} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">لا توجد شهادات بعد</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              أكمل الدورات التدريبية للحصول على شهادات إنجازك
            </p>
            <a
              href="/participant-dashboard/catalog"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
            >
              <BookOpen size={20} className="ml-2" />
              استكشاف الدورات
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Trophy size={24} className="text-emerald-600" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    مكتملة
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{certificate.courseTitle}</h3>
                <p className="text-sm text-gray-600 mb-4">المدرب: {certificate.instructorName}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{certificate.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{new Date(certificate.completedAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold">
                    <Trophy size={14} />
                    <span>{certificate.volunteerHours} ساعة تطوع</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadCertificate(certificate)}
                  className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  تحميل الشهادة
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
