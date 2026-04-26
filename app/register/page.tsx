import Header from '@/components/Header';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900" dir="rtl">
      <Header 
        title="التسجيل في منصة سفراء التطوع"
        description="اختر طريقة التسجيل المناسبة لك: كفريق أو كعضو في فريق"
        breadcrumb="الرئيسية / التسجيل"
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* بطاقة تسجيل فريق جديد */}
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 hover:border-[#34bca3] transition-all duration-300 group hover:-translate-y-2">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#34bca3] transition-colors duration-300">
                <svg className="w-12 h-12 text-[#34bca3] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">تسجيل فريق تطوعي</h3>
              <p className="text-gray-500 leading-relaxed">
                إذا كنت قائد فريق وترغب في تسجيل فريقك في المنصة للمشاركة في المبادرات الصحية.
              </p>
            </div>
            <Link 
              href="/register/team"
              className="w-full block bg-[#34bca3] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#2da68f] transition-all text-center shadow-lg shadow-emerald-100"
            >
              سجل فريقك الآن
            </Link>
          </div>

          {/* بطاقة تسجيل عضو في فريق */}
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 hover:border-yellow-400 transition-all duration-300 group hover:-translate-y-2">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-400 transition-colors duration-300">
                <svg className="w-12 h-12 text-yellow-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">تسجيل أعضاء الفرق</h3>
              <p className="text-gray-500 leading-relaxed">
                إذا كنت ترغب في الانضمام كمتطوع تحت مظلة فريق مسجل مسبقاً في المنصة.
              </p>
            </div>
            <Link 
              href="/register/member"
              className="w-full block bg-yellow-400 text-black font-bold py-4 px-6 rounded-xl hover:bg-yellow-500 transition-all text-center shadow-lg shadow-yellow-50"
            >
              سجل كعضو الآن
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}