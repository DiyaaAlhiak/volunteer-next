import Header from '@/components/Header';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0f172b] text-white" dir="rtl">
      <Header 
        title="التسجيل في منصة سفراء التطوع"
        description="اختر طريقة التسجيل المناسبة لك: كفريق أو كعضو في فريق"
        breadcrumb="الرئيسية / التسجيل"
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* بطاقة تسجيل فريق جديد */}
          <div className="bg-[#1e293b] rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-blue-500 transition-all duration-300 group">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">تسجيل فريق تطوعي</h3>
              <p className="text-gray-400 mb-6">
                إذا كنت قائد فريق وترغب في تسجيل فريقك في المنصة للمشاركة في المبادرات
              </p>
            </div>
            <Link 
              href="/register/team"
              className="w-full block bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              سجل فريقك الآن
            </Link>
          </div>

          {/* بطاقة تسجيل عضو في فريق */}
          <div className="bg-[#1e293b] rounded-2xl shadow-xl p-8 border border-gray-800 hover:border-green-500 transition-all duration-300 group">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">تسجيل أعضاء الفرق</h3>
              <p className="text-gray-400 mb-6">
                إذا كنت ترغب في الانضمام كمتطوع تحت مظلة فريق مسجل مسبقاً في المنصة
              </p>
            </div>
            <Link 
              href="/register/member"
              className="w-full block bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              سجل كعضو الآن
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}