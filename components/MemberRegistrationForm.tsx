'use client';
import { useState } from 'react';
import { registerMemberAction } from '@/app/register/member/actions';
import { useRouter } from 'next/navigation';

interface Team {
  id: number;
  name: string;
}

const locationData: { [key: string]: string[] } = {
  "الرياض": ["الرياض", "الخرج", "المجمعة"],
  "مكة المكرمة": ["مكة", "جدة", "الطائف"],
  "المنطقة الشرقية": ["الدمام", "الخبر", "الأحساء"],
  "المدينة المنورة": ["المدينة المنورة", "ينبع"]
};

export default function MemberRegistrationForm({ 
  acceptedTeams = [], 
  isMemberRegistrationEnabled 
}: { 
  acceptedTeams: Team[], 
  isMemberRegistrationEnabled: boolean 
}) {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // دالة التعامل مع الإرسال لالتقاط الأخطاء
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await registerMemberAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
      // التمرير للأعلى لرؤية رسالة الخطأ
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // في حال النجاح
      router.refresh();
      router.push('/login'); // أو أي صفحة تريدها بعد النجاح
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 text-right" dir="rtl">
      
      {/* عرض رسالة الخطأ هنا */}
      {error && (
        <div className="bg-red-50 border-r-4 border-red-500 p-4 mb-6 rounded-xl animate-in fade-in duration-500">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-bold text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* الحقول (تم تحويلها لستايل فاتح ليتناسب مع طلبك السابق، يمكنك إعادتها للداكن لو فضلت) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-2xl">
        
        {/* اختيار الفريق */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold mb-2 text-slate-700">الفريق الذي تود الانضمام إليه *</label>
          <select 
            name="teamId" 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 outline-none focus:border-[#34bca3]" 
            required
          >
            <option value="">-- اختر الفريق من القائمة --</option>
            {acceptedTeams && acceptedTeams.length > 0 ? (
              acceptedTeams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))
            ) : (
              <option disabled>لا توجد فرق متاحة حالياً</option>
            )}
          </select>
        </div>

        {/* الاسم واسم المستخدم */}
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">الاسم الكامل *</label>
          <input type="text" name="name" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 outline-none focus:border-[#34bca3]" required />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">اسم المستخدم *</label>
          <input type="text" name="username" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 outline-none focus:border-[#34bca3]" required />
        </div>

        {/* البريد والجوال */}
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">البريد الإلكتروني *</label>
          <input type="email" name="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 outline-none focus:border-[#34bca3]" required />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">رقم الجوال *</label>
          <input type="tel" name="phone" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 outline-none focus:border-[#34bca3]" required />
        </div>

        {/* المنطقة والمدينة */}
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">المنطقة *</label>
          <select name="region" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800" required onChange={(e) => setSelectedRegion(e.target.value)}>
            <option value="">-- اختر المنطقة --</option>
            {Object.keys(locationData).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">المدينة *</label>
          <select name="city" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 disabled:opacity-50" required disabled={!selectedRegion}>
            <option value="">-- اختر المدينة --</option>
            {selectedRegion && locationData[selectedRegion].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* الهوية والمهنة */}
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">رقم الهوية *</label>
          <input type="text" name="nationalId" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">المهنة</label>
          <input type="text" name="jobTitle" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold mb-2 text-slate-700">الجهة التابع لها</label>
          <input type="text" name="organization" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 outline-none" />
        </div>

        {/* كلمة المرور */}
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">كلمة المرور *</label>
          <input type="password" name="password" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700">تأكيد كلمة المرور *</label>
          <input type="password" name="confirm_password" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-800 outline-none" required />
        </div>
      </div>

      {/* الزر بالتنسيق القديم المطلوب */}
      <button 
        type="submit" 
        disabled={isLoading || !isMemberRegistrationEnabled}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-green-900/20 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>جاري إرسال الطلب...</span>
          </>
        ) : (
          "إرسال طلب الانضمام"
        )}
      </button>
    </form>
  );
}