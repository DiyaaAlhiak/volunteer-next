'use client';
import { useState } from 'react';
import { registerTeamAction } from '@/app/register/team/actions';
import { useRouter } from 'next/navigation';

// بيانات المناطق والمدن
const locationData: { [key: string]: string[] } = {
  "الرياض": ["الرياض", "الخرج", "المجمعة", "الدوادمي"],
  "مكة المكرمة": ["مكة", "جدة", "الطائف", "القنفذة"],
  "المنطقة الشرقية": ["الدمام", "الخبر", "الأحساء", "الجبيل"],
  "المدينة المنورة": ["المدينة المنورة", "ينبع", "العلا"]
};

export default function TeamRegistrationForm() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // تنسيقات موحدة للحقول (ستايل فاتح)
  const inputStyle = "w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-slate-800 outline-none focus:bg-white focus:border-[#34bca3] focus:ring-4 focus:ring-[#34bca3]/10 transition-all placeholder:text-gray-400 text-right";
  const labelStyle = "block text-sm font-bold mb-2 text-slate-700 mr-1";

  // دالة التعامل مع الإرسال
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await registerTeamAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
      // التمرير لأعلى لرؤية الخطأ
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // النجاح التلقائي يتم عبر الأكشن ولكن كاحتياط
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 text-right" dir="rtl">
      
      {/* رسالة الخطأ في حال وجودها */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* اسم الفريق */}
        <div className="md:col-span-2">
          <label className={labelStyle}>اسم الفريق *</label>
          <input type="text" name="name" placeholder="أدخل اسم الفريق" className={inputStyle} required />
        </div>

        {/* اسم القائد */}
        <div>
          <label className={labelStyle}>اسم قائد الفريق *</label>
          <input type="text" name="leader_name" placeholder="الاسم الثلاثي" className={inputStyle} required />
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className={labelStyle}>البريد الإلكتروني *</label>
          <input type="email" name="email" placeholder="example@mail.com" className={inputStyle} required />
        </div>

        {/* المنطقة */}
        <div>
          <label className={labelStyle}>المنطقة *</label>
          <select 
            name="region" 
            className={inputStyle} 
            required 
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">-- اختر المنطقة --</option>
            {Object.keys(locationData).map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* المدينة */}
        <div>
          <label className={labelStyle}>المدينة *</label>
          <select 
            name="city" 
            className={inputStyle} 
            required 
            disabled={!selectedRegion}
          >
            <option value="">-- اختر المدينة --</option>
            {selectedRegion && locationData[selectedRegion].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* الجوال */}
        <div>
          <label className={labelStyle}>رقم الجوال *</label>
          <input type="tel" name="phone" placeholder="05xxxxxxxx" className={inputStyle} required />
        </div>

        {/* الهوية */}
        <div>
          <label className={labelStyle}>رقم الهوية *</label>
          <input type="text" name="nationalId" placeholder="1xxxxxxxxx" className={inputStyle} required />
        </div>

        {/* المهنة والجهة */}
        <div>
          <label className={labelStyle}>المهنة</label>
          <input type="text" name="job" className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>الجهة التابع لها</label>
          <input type="text" name="organization" className={inputStyle} />
        </div>

        {/* المرفقات */}
        <div className="md:col-span-2">
          <label className={labelStyle}>المرفقات (صورة أو PDF)</label>
          <input 
            type="file" 
            name="attachments" 
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.size > 10 * 1024 * 1024) {
                alert("الملف كبير جداً! الحد الأقصى هو 10 ميجابايت.");
                e.target.value = "";
              }
            }}
            className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-3 text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#34bca3] file:text-white file:font-bold cursor-pointer"
          />
        </div>

        {/* كلمات المرور */}
        <div>
          <label className={labelStyle}>كلمة المرور *</label>
          <input type="password" name="password" placeholder="••••••••" className={inputStyle} required />
        </div>
        <div>
          <label className={labelStyle}>تأكيد كلمة المرور *</label>
          <input type="password" name="confirm_password" placeholder="••••••••" className={inputStyle} required />
        </div>
      </div>

      {/* زر الإرسال */}
   {/* زر الإرسال بالتنسيق القديم */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-6 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/center" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>جاري التسجيل...</span>
          </>
        ) : (
          "تسجيل الفريق"
        )}
      </button>
    </form>
  );
}